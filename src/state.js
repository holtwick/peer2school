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

/**
 * On fired event "set_peer_name" update/create
 * an array entry in state.peers containing
 * the given name. It will look for the peer id (by webrtc)
 * and if found update the entry. The state.peers array
 * can later be used to store more information than the username
 */
webrtc.on('set_peer_name', peer => {
  let peerData = state.peers.find( s => s.id === peer.sender)
  if(peerData){
    peerData.name = peer.name;
  } else {
    state.peers.push({id:peer.sender,name:peer.name})
  }
})

/**
 * based on the webrtc sender id fetch
 * the username from state.peers array. If the id
 * does not match a name it will return the raw sender id. If
 * the sender id matches the current user it will return the name extended
 * with the suffix "(me)"
 *
 * @param string senderId
 * @returns string
 */
export function getPeerNameBySenderId(senderId) {
  let name = senderId;
  const peer = state.peers.find( s => s.id === senderId)
  if(peer) {
    name = peer.name;
  }

  name += (senderId === webrtc.io.id) ? ' (me)':'';
  return name;
}

/**
 * Set the peer name of current participant. It will
 * be stored in the state.peers array.
 *
 * @param name
 */
export function setPeerName(name) {
  // send remote
  webrtc.send('set_peer_name', {
    sender: webrtc.io.id,
    name: name
  })
  // set local
  let peer = state.peers.find( s => s.id === webrtc.io.id)
  if(peer){
     peer.name = name;
  } else {
    state.peers.push({id:webrtc.io.id,name:name})
  }
}

export function sendChatMessage(msg) {
  webrtc.send('chat', {
    sender: webrtc.io.id,
    msg,
  })
  state.chat.push({
    sender: webrtc.io.id,
    msg,
  })
}

export function getPeer(id) {
  return webrtc.peerConnections[id]
}
