import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

const ydoc = new Y.Doc()

const log = require('debug')('app:sync')

function encode(v) {
  return JSON.stringify(Array.from(v))
}

function decode(v) {
  return Uint8Array.from(JSON.parse(v))
}

export function setupSync({ room, webrtc } = {}) {
  ydoc.on('update', update => {
    update = encode(update)
    log('webrtc sync send', JSON.stringify(update, null, 2))
    webrtc.send('sync', {update})
  })

  webrtc.on('sync', info => {
    let {update} = info
    log('xxx', JSON.stringify(info, null, 2))
    update = decode(update)
    log('webrtc sync receive', update)
    Y.applyUpdate(ydoc, update)
  })

  // const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, ydoc)

  return {
    chat: ydoc.getArray('chat'),
  }

}

