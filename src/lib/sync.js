import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

const log = require('debug')('app:sync')

const doc = new Y.Doc()

export function setupSync({ room, webrtc } = {}) {
  log('setupSync')

  const webrtcProvider = new WebrtcProvider('peer-school-' + room, doc, {
    // signaling: ['ws://localhost:4448'],
  })

  webrtcProvider.on('peers', info => {
    let peers = Array.from(info.webrtcPeers)
    log('peers', peers)
    for (let peerId of peers) {
      let peer = webrtcProvider.room.webrtcConns.get(peerId)
      log('peer', peer.peer)
    }
  })

  webrtcProvider.on('synced', info => {
    log('synched', info, webrtcProvider.room.peerId)
    log('synched conns', webrtcProvider.room.webrtcConns.values())
  })

  //  const awareness = webrtcProvider.awareness

  const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, doc)
  log('setupSync done', webrtcProvider)

  return {
    chat: doc.getArray('chat'),
  }

}
