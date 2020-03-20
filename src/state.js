import { WebRTC } from './lib/webrtc'

export let state = {
  room: '',
  peers: [],
  status: {}
}

export let webrtc = new WebRTC()

webrtc.on('status', info => {
  state.status = info.status
})
