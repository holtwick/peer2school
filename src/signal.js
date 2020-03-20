import io from 'socket.io-client'

let room = 'sample' //  prompt('Enter room name:');

const signalServerURL = 'ws://localhost:2020'

const socket = io.connect(signalServerURL)

const log = require('debug')('app:signal')

let isInitiator

if (room !== '') {
  log('Joining room ' + room)
  socket.emit('create or join', room)
}

socket.on('full', (room) => {
  log('Room ' + room + ' is full')
})

socket.on('empty', (room) => {
  isInitiator = true
  log('Room ' + room + ' is empty')
})

socket.on('join', (room) => {
  log('Making request to join room ' + room)
  log('You are the initiator!')
})

socket.on('log', (array) => {
  log('log', array)
})
