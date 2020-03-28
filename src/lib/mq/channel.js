// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

import { assert } from '../assert'
import { UUID } from '../uuid'

export class Channel {

  _name = UUID()
  _channel
  _subscriber

  buffer = []

  constructor(channel) {
    if (channel) {
      this.connect(channel)
    }
  }

  _connectChannel() {
    this.publishBuffered()
  }

  connect(channel) {
    assert(channel, 'Channel missing')
    this._channel = channel
    this._connectChannel()
  }

  publishBuffered() {
    this.buffer.forEach(data => this.send(data))
    this.buffer = []
  }

  disconnect() {
    this._subscriber = null // ?
    this._channel = null
  }

  isConnected() {
    return this._channel != null
  }

  encode(obj) {
    return obj // e.g. JSON.stringify
  }

  decode(obj) {
    return obj // e.g. JSON.parse
  }

  publish(obj) {
    const data = this.encode(obj)
    if (this.isConnected()) {
      this.send(data)
    } else {
      this.buffer.push(data)
    }
  }

  subscribe(fn) {
    this._subscriber = fn
  }

  receive(data) {
    let obj = this.decode(data)
    if (this._subscriber) {
      this._subscriber(obj)
    }
  }

  // Override this in a subclass!
  send(data) {
    // this._channel.postMessage(payload)
    this._channel.receive(data)
  }

}

const HANDSHAKE = '__handshake__'

class HandshakeChannel extends Channel {

  _handshake = false

  _connectChannel() {
    this.send(HANDSHAKE)
    this.subscribe(HANDSHAKE, () => {
      super._connectChannel()
      this.publish(HANDSHAKE)
    })
    this.send(HANDSHAKE)
  }

  receive(data) {
    if (!this._handshake && data === HANDSHAKE) {
      this._handshake = true
    } else {
      super.receive(data)
    }
  }

  subscribe(fn) {

    super.subscribe(fn)
  }

}

export class PostChannel extends HandshakeChannel {

  _connectChannel() {
    super._connectChannel()
    this._channel.addEventListener('message', e => this.receive(e.data))
    // this._channel.onmessage = e => this.receive(e.data)
  }

  send(data) {
    this._channel.postMessage(data)
  }

  // Proxy?
  // Heartbeat?
  // Error and disconnect handling?

}

export class JSONPostChannel extends PostChannel {

  encode(obj) {
    return JSON.stringify(obj)
  }

  decode(obj) {
    return JSON.parse(obj)
  }

}
