import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'

import * as Y from 'yjs'

const doc = new Y.Doc()

const log = require('debug')('app:sync')

function encode(v) {
  return JSON.stringify(Array.from(v))
}

function decode(v) {
  return Uint8Array.from(JSON.parse(v))
}

export function setupSync({ room, webrtc } = {}) {
  // doc.on('update', update => {
  //   update = encode(update)
  //   log('webrtc sync send', JSON.stringify(update, null, 2))
  //   webrtc.send('sync', { update })
  // })
  //
  // webrtc.on('sync', info => {
  //   let { update } = info
  //   log('xxx', JSON.stringify(info, null, 2))
  //   update = decode(update)
  //   log('webrtc sync receive', update)
  //   Y.applyUpdate(doc, update)
  // })

  const webrtcProvider = new WebrtcProvider('peer-school-' + room, doc, {
    signaling: ['ws://localhost:4448'],
  })

  //  const awareness = webrtcProvider.awareness // websocketProvider.awareness
  const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, doc)
  // const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, doc)

  return {
    chat: doc.getArray('chat'),
  }

}
