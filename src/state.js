import { ENABLE_VIDEO } from './config'
import { setupSync } from './lib/sync'
import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'

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
  })
}

function updateState() {
  log('updateState')
  state.peers = sync.getPeerList()
  if (!teacher && state.info.teacherID) {
    log('search teacher stream', state.info.teacherID)
    state.teacherStream = sync.getStream(state.info.teacherID)
  }
}

updateState()

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

export function setSignal(active) {
  sync.signals.set(state.peerID, { active })
}

export function setProfileName(name) {
  sync.profiles.set(state.peerID, { name })
}
