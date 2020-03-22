import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'
import { WebRTC } from './lib/webrtc'

// Force a unique room ID
const teacherToken = '.teacher'
let hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let teacher = hash.endsWith(teacherToken)
let room = hash.substr(0, UUID_length)
location.hash = `#${hash}`

export let state = {
  room,
  teacher,
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

webrtc.on('set_peer_name', peer => {
  let peerData = this.state.peers.find( s => s.id === peer.sender)
  if(peerData){
    peerData.name = peer.name;
  } else {
    this.state.peers.push({id:peer.sender,name:peer.name})
  }
})

export function setPeerName(name) {
  // send remote
  webrtc.send('set_peer_name', {
    sender: webrtc.io.id,
    name: name
  })
  // set local
  const peer = this.state.peers.find( s => s.id === webrtc.io.id)
  if(peer){
     peer.name = name;
  } else {
    this.state.peers.push({id:webrtc.io.id,name:name})
  }

}

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
