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
  stream: null,
  whiteboard: [],
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

export function getPeer(id) {
  return webrtc.peerConnections[id]
}
