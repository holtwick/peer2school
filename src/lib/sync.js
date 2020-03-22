import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

const ydoc = new Y.Doc()

export function setupSync({ room } = {}) {
  const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, ydoc)

  // ydoc.on('update', update => {
  //   Y.applyUpdate(doc2, update)
  // })

}

