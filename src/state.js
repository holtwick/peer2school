import { ENABLE_VIDEO } from './config'
import { setupSync } from './lib/sync'
import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'

const log = require('debug')('app:state')

// Force a unique room ID
const teacherToken = '.teacher'
let hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let teacher = hash.endsWith(teacherToken)
let room = hash.substr(0, UUID_length)
location.hash = `#${hash}`

// STATE

export let state = {
  room,
  teacher,
  peers: [],
  status: {},
  chat: [],
  stream: null,
}

// SYNC

export let sync = setupSync({
  room,
})

sync.chat.observe(event => {
  state.chat = sync.chat.toJSON()
})

state.peers = sync.getPeerList()

sync.on('peers', () => {
  log('new peers')
  state.peers = sync.getPeerList()
})

// MEDIA

ENABLE_VIDEO && getUserMedia(stream => {
  state.stream = stream
  sync.setStream(stream)
})

// UTILS

export function sendChatMessage(msg) {
  sync.chat.push([{
    // sender: webrtc.io.id,
    msg,
  }])
}

export function sendWhiteboardAction(action) {
  log('sendWhiteboardAction', action)
  sync.whiteboard.push([action])
}
