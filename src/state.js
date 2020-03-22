import { setupSync } from './lib/sync'
import { getUserMedia } from './lib/usermedia'
import { UUID, UUID_length } from './lib/uuid'
import { WebRTC } from './lib/webrtc'

// Force a unique room ID
const teacherToken = '.teacher'
let hash = (location.hash || `#${UUID()}${teacherToken}`).substr(1)
let teacher = hash.endsWith(teacherToken)
let room = hash.substr(0, UUID_length)
location.hash = `#${hash}`

setupSync({
  room,
})

export let state = {
  room,
  teacher,
  peers: [],
  status: {},
  chat: [],
  pointOuts: [],
  teacherStreams: [],
  stream: null,
  whiteboard: [],
}

getUserMedia(stream => {
  state.stream = stream
})

export let webrtc = new WebRTC({ room })

webrtc.on('status', info => {
  state.status = info.status
  if(state.teacher) {
    if(!state.teacherStreams.find(s => s === webrtc.io.id)){
      state.teacherStreams.push(webrtc.io.id)
    }

    webrtc.send('teacherStream', {      
      teacherStream: webrtc.io.id
    })
  }
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
})

webrtc.on('teacherStream', msg => {
  if(!state.teacherStreams.find(s => s === msg.teacherStream)){
    state.teacherStreams.push(msg.teacherStream)
  }
})

webrtc.on('whiteboard', ({ action }) => {
  this.whiteboard.push(action)
})

//pointsOut.state -> true = point out is activated 
//                   false = point out is deactivates 
webrtc.on('point_out', pointsOut => {
  if(pointsOut.state){
    state.pointOuts.push(pointsOut.sender)
  }
  else{
    const senderIndex = state.pointOuts.indexOf(pointsOut.sender)

    if(senderIndex >= 0) //check if sender is in list
      state.pointOuts.splice(senderIndex, 1)
  }
})

webrtc.on('connected', ({ peer }) => {
  syncTeacherStateWithPeers();
  setTimeout(() => {
    peer.addStream(state.stream)
  }, 1000)
})


/**
 * Sending the teachers state to (newly) connected
 * peers in the network allows to sync important informationn
 * like peer names and point outs. See the listener for sync_teacher_state event.
 */
export function syncTeacherStateWithPeers() {
  if(state.teacher) {
    webrtc.send('sync_teacher_state', state);
  }
}

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

export function sendPointOutInfo(pointsOutInfo) {

  // remote
  webrtc.send('point_out', {
    sender: webrtc.io.id,
    state: pointsOutInfo,
  })

  
  // local
  if(pointsOutInfo){
    state.pointOuts.push(webrtc.io.id)
  }
  else
  {
    const senderIndex = state.pointOuts.indexOf(webrtc.io.id)

    if(senderIndex >= 0) //check if sender is in list
      state.pointOuts.splice(senderIndex, 1)
  }

}

/**
 * Along with syncTeacherStateWithPeers() this listener
 * will manage to sync the teachers state (list of peers, list of pointouts, ..)
 * with all connected peers. This is a solution für #42
 */
webrtc.on('sync_teacher_state', newState => {
  state.peers = newState.peers;
  state.pointOuts = newState.pointOuts;
})


export function getPeer(id) {
  return webrtc.peerConnections[id]
}
