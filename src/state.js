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
  teacher_stream: [],
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
  // Set the teacher id
  console.log("DEBUG DEBUG" + state.teacher_stream.find(webrtc.io.id) >= 0 )
  if(state.teacher && 
    !(state.teacher_stream.find(webrtc.io.id) >= 0) ) {
    state.teacher_stream.push(webrtc.io.id)
  }
})

webrtc.on('chat', msg => {
  state.chat.push(msg)
})

webrtc.on('connected', ({ peer }) => {
  console.log("DEBUG: " + peer)
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
