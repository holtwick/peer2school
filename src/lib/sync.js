import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

const ydoc = new Y.Doc()

const log = require('debug')('app:sync')

export function setupSync({ room } = {}) {
  const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, ydoc)

  ydoc.on('update', update => {
    log('on update', update)
    // Y.applyUpdate(doc2, update)
  })

  return {
    chat: ydoc.getArray('chat')
  }

}

