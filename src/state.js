import { getUserMedia } from './lib/usermedia'
import { WebRTC } from './lib/webrtc'

export let state = {
  room: '',
  peers: [],
  status: {},
  chat: [],
  stream: null
}

getUserMedia(stream => {
  state.stream = stream
})

export let webrtc = new WebRTC()

webrtc.on('status', info => {
  state.status = info.status
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
})

// webrtc.on('stream', stream => {
//
// })

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
