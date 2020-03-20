import io from 'socket.io-client'

let room = 'sample' //  prompt('Enter room name:');

const signalServerURL = 'ws://localhost:4445'

const socket = io.connect(signalServerURL, {
  transports: ['websocket'],
})

const log = require('debug')('app:signal')

socket.on('connect', () => {
  if (room !== '') {
    log('Joining room ' + room)
    socket.emit('join', { room })
  }
})

socket.on('joined', ({ room, peers }) => {
  log(`Did join room ${room} with peers ${peers}`)
})

socket.on('log', (array) => {
  log('log', array)
})
