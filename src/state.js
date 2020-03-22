import { ENABLE_VIDEO } from './config'
import { setupSync } from './lib/sync'
import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'
import { WebRTC } from './lib/webrtc'

const log = require('debug')('app:state')

// Force a unique room ID
const teacherToken = '.teacher'
let hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let teacher = hash.endsWith(teacherToken)
let room = hash.substr(0, UUID_length)
location.hash = `#${hash}`

export let sync = setupSync({
  room,
})

sync.chat.observe(event => {
  log('yarray was modified', JSON.stringify(sync.chat.toJSON(), null, 2))
})

export let state = {
  room,
  teacher,
  peers: [],
  status: {},
  chat: [],
  stream: null,
  whiteboard: [],
}

ENABLE_VIDEO && getUserMedia(stream => {
  state.stream = stream
})

export let webrtc = new WebRTC({ room })

webrtc.on('status', info => {
  state.status = info.status
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
})

webrtc.on('whiteboard', ({ action }) => {
  this.whiteboard.push(action)
})

webrtc.on('connected', ({ peer }) => {
  setTimeout(() => {
    peer.addStream(state.stream)
  }, 1000)
})

export function sendChatMessage(msg) {
  // const entry = new Y.Map()
  // entry.set('sender', webrtc.io.id)
  // entry.set('msg', msg)
  sync.chat.push([{
    sender: webrtc.io.id,
    msg,
  }])

  webrtc.send('chat', {
    sender: webrtc.io.id,
    msg,
  })
  state.chat.push({
    sender: 'me',
    msg,
  })
}

export function getPeer(id) {
  return webrtc.peerConnections[id]
}
