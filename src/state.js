import Vue from 'vue'
import * as Y from 'yjs'
import { ENABLE_MEDIASERVER, ENABLE_VIDEO, LOCAL_ID, LOCAL_NAME } from './config'
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

    // Use the media server
    useMediaServer: false,

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

  useJitsi: ENABLE_MEDIASERVER,

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
      sync.tracks.set(peerID, jitsiID)
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

export function toggleMediaServer() {
  sync.info.set('useMediaServer', !sync.info.get('useMediaServer'))
}

//

export let channel
export let queue

let jitsiID = null

if (ENABLE_MEDIASERVER) {

  channel = new ToIFrameChannel('jitsi')
  queue = new ChannelTaskQueue(channel)

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

  queue.on('action', ({ action }) => {
    if (action === 'stop') {
      setStudent()
    } else if (action === 'edit') {
      let name = prompt('What\'s your name?')
      if (name) {
        setProfileName(name)
      }
    } else {
      alert(`Unknown command ${action}`)
    }
  })

} else if (ENABLE_VIDEO) {

  sync.on('stream', ({ peerID, stream }) => {
    Vue.set(state.streams, peerID, stream)
    updateState() // todo
  })

  function getUserMedia(fn) {
    try {
      // Solution via https://stackoverflow.com/a/47958949/140927
      // Only available for HTTPS! See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security
      const opt = {
        audio: true,
        video: {
          facingMode: 'user',
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: {
            min: 1,
            ideal: 15,
          },
        },
      }
      navigator.mediaDevices.getUserMedia(opt).then(fn).catch(err => log('error', err))
    } catch (err) {
      console.warn('getUserMedia err', err)
    }
  }

  getUserMedia(stream => {
    state.stream = new MediaStream(stream.getVideoTracks())
    sync.setStream(stream)
  })

}

