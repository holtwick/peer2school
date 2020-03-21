// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

import SimplePeer from 'simple-peer'
import { Emitter } from './emitter'

const log = require('debug')('app:webrtc-peer')

let ctr = 1

export class WebRTCPeer extends Emitter {

  constructor({ remote, local, ...opt } = {}) {
    super()

    this.remote = remote
    this.local = local
    this.initiator = opt.initiator
    this.id = 'webrtc-peer' + ctr++
    this.active = false
    this.stream = null
    this.name = "unknown";

    log('peer', this.id)

    this.peer = new SimplePeer(opt)

    // We receive a connection error
    this.peer.on('error', err => {
      log(`${this.id} | error`, err)
      this.emit('error', err)
    })

    // This means, we received network details (signal) we need to provide
    // the remote peer, so he can set up a connection to us. Usually we will
    // send this over a separate channel like the web socket signaling server
    this.peer.on('signal', data => {
      log(`${this.id} | signal`, this.initiator)
      this.emit('signal', data)
    })

    // We received data from the peer
    this.peer.on('data', data => {
      log(`${this.id} | data`, data)
      this.emit('data', data)
      this.emit('message', { data }) // Channel compat
    })

    // Connection succeeded
    this.peer.on('connect', event => {
      log(`${this.id} | connect`)
      this.active = true
      // p.send('whatever' + Math.random())
      this.emit('connect', event)
    })

    this.peer.on('stream', stream => {
      this.stream = stream
      this.emit('stream', stream)
    })

  }

  addStream(stream) {
    this.peer.addStream(stream)
  }

  // We got a signal from the remote peer and will use it now to establish the connection
  signal(data) {
    this.peer.signal(data)
  }

  postMessage(data) {  // Channel compat
    this.peer.send(data)
  }

  setName(name) {
    this.name = name;
  }

  close() {
    if (this.peer?.close) {
      this.peer.close()
    }
    this.active = false
  }

}
