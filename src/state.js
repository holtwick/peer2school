import Vue from 'vue'
import { ENABLE_VIDEO } from './config'
import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'
import { setupSync } from './sync'

const log = require('debug')('app:state')

// Force a unique room ID
const teacherToken = '.teacher'
let hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let teacher = hash.endsWith(teacherToken)
let room = hash
if (teacher) room = room.replace(teacherToken, '')
room = room.substr(0, UUID_length)
location.hash = `#${hash}`

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
  streams: [],

  // Video stream of the local user without sound
  stream: null,

  // The teachers stream
  teacherStream: null,

  // By Yjs synched objects
  ...synched,
}

// SYNC

export let sync = setupSync({
  room,
})

function getTeacherID() {
  return sync.info.get('teacherID')
}

sync.on('ready', () => {
  state.peerID = sync.peerID
  if (teacher) {
    sync.info.set('teacherID', sync.peerID)
  }
  updateState()
})

sync.whiteboard = sync.doc.getArray('whiteboard')

for (const [name, dft] of Object.entries(synched)) {
  sync[name] = Array.isArray(dft) ? sync.doc.getArray(name) : sync.doc.getMap(name)
  sync[name].observe(event => {
    state[name] = sync[name].toJSON()
    if (name === 'info') updateState()
  })
}

function updateState() {
  state.peers = sync.getPeerList()
  log('peers', state.peers)
  if (!teacher) {
    let teacherID = getTeacherID()
    if (teacherID) {
      state.teacherStream = sync.getStream(teacherID)
    }
  }
}

sync.on('peers', updateState)

sync.on('stream', ({ peerID, stream }) => {
  Vue.set(state.streams, peerID, stream)
  // state.streams[peerID] = stream
  updateState() // todo
})

// MEDIA

ENABLE_VIDEO && getUserMedia(stream => {
  state.stream = new MediaStream(stream.getVideoTracks())
  sync.setStream(stream)
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
  sync.profiles.set(state.peerID, { name })
}

export function setStudent(peerID = null, allowWhiteboard = false) {
  sync.info.set('studentID', peerID)
  sync.info.set('allowWhiteboard', allowWhiteboard)
}
