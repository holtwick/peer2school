// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

import SimplePeer from 'simple-peer'
import { Emitter } from './emitter'

const log = require('debug')('app:webrtc-peer')

export class SeaWebRTCPeer extends Emitter {

  ctr = 1

  constructor({ remote, local, ...opt } = {}) {
    super()

    log('peer', name)

    this.remote = remote
    this.local = local
    this.initiator = opt.initiator
    this.id = 'webrtc-peer' + this.ctr++
    this.active = false
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
  }

  // We got a signal from the remote peer and will use it now to establish
  // the connection.
  signal(data) {
    this.peer.signal(data)
  }

  // send(data) {
  //   this.peer.send(data)
  // }

  postMessage(data) {  // Channel compat
    this.peer.send(data)
  }

  close() {
    if (this.peer?.close) {
      this.peer.close()
    }
    this.active = false
  }

}
