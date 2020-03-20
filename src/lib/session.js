import { Emitter } from './emitter'
import { WebRTC } from './webrtc'

class Session extends Emitter {

  roomName
  rtc

  reset() {
    this.roomName = null
  }

  join(room) {
    this.roomName = room
    this.rtc = new WebRTC({
      room,
    })
  }

  getPeers() {
    // this.rtc.peerConnections
  }

  getPeer(id) {

  }

}

const session = new Session()

export { session }
