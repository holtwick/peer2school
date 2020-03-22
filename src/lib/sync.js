import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

const ydoc = new Y.Doc()

const log = require('debug')('app:sync')

export function setupSync({ room, webrtc } = {}) {
  ydoc.on('update', update => {
    let buf = Buffer.from(update).toJSON().data
    log('webrtc sync send', buf, update)
    webrtc.send('sync', update)
  })

  webrtc.on('sync', update => {
    log('webrtc sync receive', update)
    Y.applyUpdate(ydoc, update)
  })

  const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, ydoc)

  return {
    chat: ydoc.getArray('chat'),
  }

}

