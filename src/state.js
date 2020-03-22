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
  peerID: null,
  peers: [],
  status: {},
  chat: [],
  pointOuts: [],
  teacherStreams: [],
  stream: null,
  info: {
    teacherID: null,
    pointOuts: {},
  },
}

// SYNC

export let sync = setupSync({
  room,
})

sync.on('ready', () => {
  state.peerID = sync.peerID
  if (teacher) {
    sync.info.set('teacherID', sync.peerID)
  }
})

sync.chat.observe(event => {
  state.chat = sync.chat.toJSON()
})

sync.info.observe(event => {
  state.info = sync.info.toJSON()
})

state.peers = sync.getPeerList()

sync.on('peers', () => {
  log('new peers')
  state.peers = sync.getPeerList()
})

// MEDIA

ENABLE_VIDEO && getUserMedia(stream => {
  state.stream = new MediaStream(stream.getVideoTracks())
  sync.setStream(stream)
})

// UTILS

export function sendChatMessage(msg) {
  sync.chat.push([{
    // sender: webrtc.io.id,
    msg,
  }])
}

export function sendPointOut(active) {
  sync.info.get('pointOuts').set(state.peerID, {
    active,
  })
}


// /**
//  * Along with syncTeacherStateWithPeers() this listener
//  * will manage to sync the teachers state (list of peers, list of pointouts, ..)
//  * with all connected peers. This is a solution für #42
//  */
// webrtc.on('sync_teacher_state', newState => {
//   state.peers = newState.peers;
//   state.pointOuts = newState.pointOuts;
// })


//     webrtc.on('teacherStream', msg => {
//       if(!state.teacherStreams.find(s => s === msg.teacherStream)){
//         state.teacherStreams.push(msg.teacherStream)
//       }
//     })
//
//   //pointsOut.state -> true = point out is activated
//   //                   false = point out is deactivates
//   webrtc.on('point_out', pointsOut => {
//     if(pointsOut.state){
//       state.pointOuts.push(pointsOut.sender)
//     }
//     else{
//       const senderIndex = state.pointOuts.indexOf(pointsOut.sender)
//
//       if(senderIndex >= 0) //check if sender is in list
//         state.pointOuts.splice(senderIndex, 1)
//     }
//   })
//
//   webrtc.on('connected', ({ peer }) => {
//     syncTeacherStateWithPeers();
//     setTimeout(() => {
//       peer.addStream(state.stream)
//     }, 1000)
//   })
//
//
//   /**
//    * Sending the teachers state to (newly) connected
//    * peers in the network allows to sync important informationn
//    * like peer names and point outs. See the listener for sync_teacher_state event.
//    */
//   export function syncTeacherStateWithPeers() {
//     if(state.teacher) {
//       webrtc.send('sync_teacher_state', state);
//     }
//   }
//
//   /**
//    * On fired event "set_peer_name" update/create
//    * an array entry in state.peers containing
//    * the given name. It will look for the peer id (by webrtc)
//    * and if found update the entry. The state.peers array
//    * can later be used to store more information than the username
//    */
//   webrtc.on('set_peer_name', peer => {
//     let peerData = state.peers.find( s => s.id === peer.sender)
//     if(peerData){
//       peerData.name = peer.name;
//     } else {
//       state.peers.push({id:peer.sender,name:peer.name})
//     }
//   })
//
//   /**
//    * based on the webrtc sender id fetch
//    * the username from state.peers array. If the id
//    * does not match a name it will return the raw sender id. If
//    * the sender id matches the current user it will return the name extended
//    * with the suffix "(me)"
//    *
//    * @param string senderId
//    * @returns string
//    */
//   export function getPeerNameBySenderId(senderId) {
//     let name = senderId;
//     const peer = state.peers.find( s => s.id === senderId)
//     if(peer) {
//       name = peer.name;
//     }
//
//     name += (senderId === webrtc.io.id) ? ' (me)':'';
//     return name;
//   }
//
//   /**
//    * Set the peer name of current participant. It will
//    * be stored in the state.peers array.
//    *
//    * @param name
//    */
//   export function setPeerName(name) {
//     // send remote
//     webrtc.send('set_peer_name', {
//       sender: webrtc.io.id,
//       name: name
//     })
//     // set local
//     let peer = state.peers.find( s => s.id === webrtc.io.id)
//     if(peer){
//       peer.name = name;
//     } else {
//       state.peers.push({id:webrtc.io.id,name:name})
//     }
//   }
