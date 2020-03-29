import { assert } from '../assert'
import { HandshakeChannel } from './channel'

const log = require('debug')('mq:iframe')

// https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/SafariJSProgTopics/Cross-documentmessaging.html

function targetOrigin() {
  return '*' // todo: set real origin for security considerations, usually shouldn't be harmful though
}

export class ToIFrameChannel extends HandshakeChannel {

  _id

  constructor(id, channel) {
    super()
    this._id = id
    if (channel) {
      this.connect(channel)
    }
  }

  connect(channel) {
    if (channel.contentWindow) {
      channel = channel.contentWindow
    }
    super.connect(channel)
  }

  _connectChannel() {
    window.addEventListener('message', e => {
      log('receive postchannel', this._name, e)
      let info = e.data
      if (info.source === this._id) {
        this.receive(info.data)
      }
    }, false)
    super._connectChannel()
  }

  send(data) {
    log('send postmessage', this._name, data)
    this._channel.postMessage({ source: 'window', data }, targetOrigin())
  }

}

export class FromIFrameChannel extends HandshakeChannel {

  _id

  constructor(id) {
    assert(id, 'An identifier is required to get in sync with the parent page')
    super()
    this._id = id
    this.connect(window.parent)
  }

  connect(channel) {
    super.connect(channel)
  }

  _connectChannel() {
    window.addEventListener('message', e => {
      log('receive postchannel', this._name, e)
      let info = e.data
      if (info.source === 'window') {
        this.receive(info.data)
      }
    }, false)
    super._connectChannel()
  }

  send(data) {
    log('send postmessage', this._name, data)
    this._channel.postMessage({ source: this._id, data }, targetOrigin())
  }

}
