import { getUserMedia } from './lib/usermedia'
import { UUID } from './lib/uuid'
import { WebRTC } from './lib/webrtc'

// Force a unique room ID
let room = (location.hash || `#${UUID()}`).substr(1)
location.hash = `#${room}`

export let state = {
  room,
  peers: [],
  status: {},
  chat: [],
  stream: null,
}

getUserMedia(stream => {
  state.stream = stream
})

export let webrtc = new WebRTC({ room })

webrtc.on('status', info => {
  state.status = info.status
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
})

webrtc.on('connected', ({ peer }) => {
  setTimeout(() => {
    peer.addStream(state.stream)
  }, 1000)
})

export function sendChatMessage(msg) {
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
