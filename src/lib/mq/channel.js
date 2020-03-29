// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

import { assert } from '../assert'
import { UUID } from '../uuid'

const log = require('debug')('mq:channel')

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
    assert(!this._channel, 'Already connected to a channel')
    this._channel = channel
    this._connectChannel()
  }

  publishBuffered() {
    if (this.isConnected()) {
      log('publishBuffered', this._name)
      let data
      while ((data = this.buffer.shift())) {
        log('send buffered', this._name, data)
        this.send(data)
      }
    }
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
    log('publish', this._name, obj)
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
    log('receive channel', this._name, data)
    let obj = this.decode(data)
    if (this._subscriber) {
      this._subscriber(obj)
    }
  }

  // Override this in a subclass!
  send(data) {
    log('send', this._name, data)
    this._channel.receive(data)
  }

}

const HANDSHAKE_PING = '__handshake__ping__'
const HANDSHAKE_PONG = '__handshake__pong__'

export class HandshakeChannel extends Channel {

  _handshake = false

  isConnected() {
    return this._handshake
  }

  _connectChannel() {
    log('_connectChannel HandshakeChannel', this._name)
    // super._connectChannel()
    this.send(HANDSHAKE_PING)
  }

  receive(data) {
    log('receive handshake', this._name, data)
    if (data === HANDSHAKE_PING) {
      if (this._channel && !this._handshake) {
        this._handshake = true
        this.send(HANDSHAKE_PONG)
        this.publishBuffered()
      }
    } else if (data === HANDSHAKE_PONG) {
      if (!this._handshake) {
        this._handshake = true
        this.publishBuffered()
      }
    } else {
      super.receive(data)
    }
  }

}

export class PostChannel extends HandshakeChannel {

  _connectChannel() {
    this._channel.addEventListener('message', e => {
      log('receive postchannel', this._name, e)
      this.receive(e.data)
    }, false)
    super._connectChannel()
  }

  send(data) {
    log('send postmessage', this._name, data)
    this._channel.postMessage(data)
  }

}

export class JSONPostChannel extends PostChannel {

  encode(obj) {
    return JSON.stringify(obj)
  }

  decode(obj) {
    return JSON.parse(obj)
  }

}
