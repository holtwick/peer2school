import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'
import { Emitter } from './lib/emitter'

const log = require('debug')('app:sync')

const doc = new Y.Doc()

class Sync extends Emitter {

  chat
  stream
  indexeddbPersistence
  webrtcProvider
  peerID
  doc

  constructor({ room }) {
    super()

    log('setupSync')

    const webrtcProvider = new WebrtcProvider('peer-school-' + room, doc, {
      filterBcConns: true,
    })

    webrtcProvider.on('peers', info => {
      log('peers', info)
      if (this.stream) {
        let added = Array.from(info.added)
        for (let peerID of added) {
          let peer = this.getPeer(peerID)
          peer.peer.on('stream', stream => {
            peer.peer.stream = stream
            this.emit('stream', { peer, stream })
          })
          peer.peer.addStream(this.stream)
        }
      }
      this.emit('peers')
    })

    webrtcProvider.on('synced', info => {
      this.peerID = webrtcProvider.room.peerId
      this.emit('ready', { peerID: this.peerID })
    })

    //  const awareness = webrtcProvider.awareness

    const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, doc)
    log('setupSync done', webrtcProvider)

    this.webrtcProvider = webrtcProvider
    this.indexeddbPersistence = indexeddbPersistence

    this.doc = doc
  }

  getPeers() {
    return Array.from(this.webrtcProvider.room.webrtcConns.values() || [])
  }

  getPeer(peerID) {
    const peer = this.webrtcProvider.room.webrtcConns.get(peerID) || null
    log('found peer', peer)
    return peer
  }

  getPeerList() {
    try {
      return Array.from(this.webrtcProvider.room.webrtcConns.keys() || [])
    } catch (err) {
      // console.error('Exception:', err)
    }
    return []
  }

  getStream(peerID) {
    try {
      return this.getPeer(peerID).peer.stream
    } catch (err) {
      // console.error('Exception:', err)
    }
  }

  setStream(stream) {
    log('setStream', stream)
    this.stream = stream
    let currentPeers = this.getPeers()
    for (let peer of currentPeers) {
      peer.peer.addStream(stream)
    }
  }

}

export function setupSync({ room } = {}) {
  return new Sync({ room })
}
