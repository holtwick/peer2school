import { WebRTC } from './lib/webrtc'

export let state = {
  room: '',
  peers: [],
  status: {},
  chat: [],
}

export let webrtc = new WebRTC()

webrtc.on('status', info => {
  state.status = info.status
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
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
