// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

import io from 'socket.io-client'
import { assert } from './assert'
import { Emitter } from './emitter'
import { WebRTCPeer } from './webrtc-peer'

const log = require('debug')('app:webrtc')

// const signalServerURL = 'ws://localhost:4445'
const signalServerURL = 'wss://signal.peer.school'
// const signalServerURL = `ws://192.168.0.111:4445`

// Handles multiple connections, one to each peer
export class WebRTC extends Emitter {

  peerConnections = {}

  constructor({
                wrtc, // wrtc is used for unit testing via node.js
                room = 'sample',
              } = {}) {
    super()
    assert(room, 'room cannot be empty')

    log('webrtc reaches out to', signalServerURL)

    // https://socket.io/docs/client-api/
    this.io = io(signalServerURL, {
      // transports: ['websocket'],
    })
    assert(this.io, `should not fail to reach out to ${signalServerURL}`)

    this.io.on('connect', () => {
      log('connect', this.io.id)
      this.emit('io', {
        online: true,
      })
      this.emit('connect')
      this.io.emit('join', { room })
    })

    this.io.on('disconnect', () => {
      log('disconnect')
      this.emit('io', {
        online: false,
      })
      this.emit('disconnect')
    })

    this.io.on('remove', ({ id }) => {
      let peer = this.peerConnections[id]
      if (peer) {
        peer.close()
        delete this.peerConnections[id]
        this.updateStatus()
        this.emit('disconnected', { peer })
      }
    })

    // Receive all other currently available peers
    this.io.on('joined', ({ room, peers }) => {
      const local = this.io.id
      log('me', local, room, 'peers', peers)

      // We will try to establish a separate connection to all of them
      // If the new participant (us) initiates the connections, the others do
      // not need to get updates about new peers
      this.io.on('signal', ({ from, to, signal, initiator }) => {
        log('received signal', from, to === local, initiator)

        // If we are not already connected, do it now
        let peer = this.peerConnections[from]
        if (!peer) {
          peer = this.handlePeer({
            remote: from,
            local,
            initiator: false,
            wrtc,
          })
        }
        peer.signal(signal)
        this.updateStatus()
      })

      for (let remote of peers) {
        this.handlePeer({
          remote,
          local,
          initiator: true,
          wrtc,
        })
      }

      this.updateStatus()
    })
  }

  updateStatus() {
    let status = Object.values(this.peerConnections).map(peer => {
      let { active, initiator, local, remote } = peer
      return {
        active, initiator, local, remote, peer
      }
    })
    this.emit('status', { status })
  }

  getPeer(id) {
    return this.peerConnections[id] || null
  }

  handlePeer({ remote, wrtc, local, initiator = false } = {}) {
    let peer = new WebRTCPeer({
      local,
      remote,
      initiator,
      trickle: false,
      wrtc,
    })

    this.peerConnections[remote] = peer

    // We received the local signal (i.e. network location description) that
    // we will now send via web socket signaling server to the remote peer
    peer.on('signal', signal => {
      log('received peer signal', remote)
      this.io.emit('signal', {
        from: local,
        to: remote,
        signal,
        initiator,
      })
    })

    // The full connection is established, from now on we can exchange data
    peer.on('connect', () => {
      this.emit('connected', { peer })
      this.updateStatus()
    })

    // A message from the remote peer
    peer.on('data', data => { // depr
      let { type, ...msg } = JSON.parse(data)
      this.emit(type, msg)
    })

    peer.on('message', data => {
      this.emit('message', data)  // Channel compat
    })

    peer.on('stream', stream => {

    })

    return peer
  }

  postMessage(data) {  // Channel compat
    Object.values(this.peerConnections).forEach(peer => {
      peer.postMessage(data)
    })
  }

  send(type, msg = {}) {  // depr
    this.postMessage(JSON.stringify({ ...msg, type }))
  }

  close() {
    Object.values(this.peerConnections).forEach(peer => peer.close())
    this.peerConnections = {}
    this.io.close()
  }

  async cleanup() {
    // await super.cleanup()
    this.close()
  }

}
