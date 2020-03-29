import Vue from 'vue'
import * as Y from 'yjs'
import { ENABLE_JITSI, ENABLE_VIDEO, LOCAL_ID, LOCAL_NAME } from './config'
import { getLocal, setLocal } from './lib/local'
import { ToIFrameChannel } from './lib/mq/iframe'
import { ChannelTaskQueue } from './lib/mq/mq'
import { UUID, UUID_length } from './lib/uuid'
import { setupSync } from './sync'

const log = require('debug')('app:state')

// ROOM

const testToken = '.test'
const teacherToken = '.teacher'

const hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let room = hash

const TEST = hash.endsWith(testToken)
if (TEST) room = room.replace(testToken, '')

const teacher = hash.endsWith(teacherToken)
if (teacher) room = room.replace(teacherToken, '')

room = room.substr(0, UUID_length)
location.hash = `#${hash}`

// PEER / STUDENT

export let profileID = getLocal(LOCAL_ID, UUID)

// STATE

let synched = {

  // Flags
  info: {

    // Teacher's peer ID that is used for video stream
    teacherID: null,

    // Student's peer ID that is used for video stream
    studentID: null,

    // Allow active student (studentID) to use single whiteboard tool
    allowWhiteboard: false,

  },

  // Simple chat
  chat: [],

  // Peer IDs of students raising their hands
  signals: {},

  // Details of participants, like name
  profiles: {},

  tracks: {},
}

export let state = {

  // ID of this room
  room,

  // Boolean
  teacher,

  // Local users peer ID
  peerID: null,

  // IDs of all currently active WebRTC peers
  peers: [],

  // Streams per peerID
  streams: {},

  // Video stream of the local user without sound
  stream: null,

  // By Yjs synched objects
  ...synched,
}

// SYNC

export let sync = setupSync({
  room,
})

sync.whiteboard = sync.doc.getArray('whiteboard')
export const whiteboardUndoManager = new Y.UndoManager(sync.whiteboard)

for (const [name, dft] of Object.entries(synched)) {
  sync[name] = Array.isArray(dft) ? sync.doc.getArray(name) : sync.doc.getMap(name)
  sync[name].observe(event => {
    state[name] = sync[name].toJSON()
    if (name === 'info') updateState()
  })
}

sync.on('ready', ({ peerID }) => {
  updateState()
})

function updateState() {
  state.peers = sync.getPeerList()
}

sync.on('peers', updateState)

sync.on('peerID', peerID => {
  log('peerID', peerID)
  if (peerID) {

    state.peerID = peerID
    let name = getLocal(LOCAL_NAME)
    if (name) {
      setProfileName(name)
    }

    if (teacher) {
      sync.info.set('teacherID', peerID)
    }

    if (jitsiID) {
      log('set jitsi id', jitsiID, peerID, !!videoTracks[jitsiID])
      sync.tracks.set(peerID, jitsiID)
      // let track = videoTracks[jitsiID]
      // if (track) {
      //   Vue.set(state.streams, peerID, track)
      // }
    }
  }
})


// UTILS

export function addChatMessage(msg) {
  sync.chat.push([{
    sender: sync.peerID,
    msg,
  }])
}

export function toggleSignal() {
  let active = sync.signals.get(sync.peerID)
  sync.signals.set(sync.peerID, !active)
}

export function setProfileName(name) {
  setLocal(LOCAL_NAME, name)
  sync.profiles.set(state.peerID, { name })
}

export function setStudent(peerID = null, allowWhiteboard = false) {
  sync.info.set('studentID', peerID)
  sync.info.set('allowWhiteboard', allowWhiteboard)
}

//

let videoTracks = {}
let audioTracks = {}
let jitsiID = null

if (ENABLE_JITSI) {
  // import(/* webpackChunkName: "jitsi" */ './jitsi').then(({ JitsiBridge }) => {
  //   const jitsi = new JitsiBridge({ room })
  //
  //   jitsi.on('stream', ({ stream }) => {
  //     state.stream = stream // local video
  //   })
  //
  //   jitsi.on('joined', ({ id }) => {
  //     let peerID = state.peerID
  //     log('joined', peerID, id)
  //     jitsiID = id
  //     if (peerID) {
  //       log('set jitsi id via joined', peerID, jitsiID)
  //       sync.tracks.set(jitsiID, state.peerID)
  //     }
  //   })
  //
  //   jitsi.on('add', ({ id, track, video }) => {
  //     let peerID = state.tracks[id]
  //     log('add', id, video, peerID)
  //     assert(id)
  //     assert(track)
  //     if (video) {
  //       videoTracks[id] = track
  //       if (peerID) {
  //         log('set stream', peerID, id)
  //         Vue.set(state.streams, peerID, track)
  //       }
  //     } else {
  //       audioTracks[id] = track
  //     }
  //     if (videoTracks[id] && audioTracks[id]) {
  //
  //     }
  //     log('add done')
  //   })
  //
  //   jitsi.connect().then(_ => log('jitsi connect') ).catch(err => log('jitsi err', err))
  // })
} else if (ENABLE_VIDEO) {

  sync.on('stream', ({ peerID, stream }) => {
    Vue.set(state.streams, peerID, stream)
    updateState() // todo
  })

  navigator.getUserMedia = (
    navigator['getUserMedia'] ||
    navigator['webkitGetUserMedia'] ||
    navigator['mozGetUserMedia'] ||
    navigator['msGetUserMedia']
  )

  function getUserMedia(fn) {

    function errorHandler(err) {
      log('error', err)
    }

    try {
      // Solution via https://stackoverflow.com/a/47958949/140927
      // Only available for HTTPS! See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security
      const opt = {
        audio: true,
        video: {
          facingMode: 'user',
          video: {
            width: { ideal: 224 },
            height: { ideal: 168 },
          },
          frameRate: {
            ideal: 10,
          },
        },
      }
      if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        navigator.getUserMedia(opt, fn, errorHandler)
      } else {
        navigator.mediaDevices.getUserMedia(opt).then(fn).catch(errorHandler)
      }
    } catch (err) {
      console.warn('getUserMedia err', err)
    }
  }

  getUserMedia(stream => {
    state.stream = new MediaStream(stream.getVideoTracks())
    sync.setStream(stream)
  })

}

export let channel = new ToIFrameChannel('jitsi')
export let queue = new ChannelTaskQueue(channel)

queue.emit('state', { teacher })

queue.on('jitsi', ({ id }) => {
  let peerID = state.peerID
  log('joined', peerID, id)
  jitsiID = id
  if (peerID) {
    log('set jitsi id via joined', peerID, jitsiID)
    sync.tracks.set(state.peerID, jitsiID)
  }
})

// window.launchConnections = (n = 1) => {
//   for (let i = 0; i < n; i++) {
//     let el = document.createElement('iframe')
//     el.setAttribute('style', `position: absolute; width: 20rem; height: 20rem; bottom: ${i}rem; right: ${i}rem;`)
//     el.src = createLinkForRoom(room) // + testToken
//     document.body.appendChild(el)
//   }
// }
