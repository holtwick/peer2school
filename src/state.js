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
  info: {},
  chat: [],
  signals: {},
  profiles: {},
}

export let state = {
  room,
  teacher,
  peerID: null,
  peers: [],
  stream: null,
  teacherStream: null,
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
sync.on('stream', updateState)

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
