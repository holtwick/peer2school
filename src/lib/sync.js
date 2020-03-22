import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'
import { Emitter } from './emitter'

const log = require('debug')('app:sync')

const doc = new Y.Doc()

class Sync extends Emitter {

  chat
  stream
  indexeddbPersistence
  webrtcProvider

  constructor({ room }) {
    super()

    log('setupSync')

    const webrtcProvider = new WebrtcProvider('peer-school-' + room, doc, {
      // signaling: ['ws://localhost:4448'],
    })

    webrtcProvider.on('peers', info => {
      log('peers', info)
      // let peers = Array.from(info.webrtcPeers)
      // log('peers', peers)
      // for (let peerId of peers) {
      //   let peer = webrtcProvider.room.webrtcConns.get(peerId)
      //   log('peer', peer.peer)
      // }

      if (this.stream) {
        let added = Array.from(info.added)
        for (let peerID of added) {
          let peer = this.getPeer(peerID)
          peer.peer.addStream(this.stream)
          // log('added', this.getPeer(peerID))

          peer.peer.on('stream', stream => {
            log('streamx', stream)
            peer.peer.stream = stream
            this.emit('peers') // hack
          })
        }
      }

      // this.emit('peers', [])
    })

    webrtcProvider.on('synced', info => {
      // log('synched', info, webrtcProvider.room.peerId)
      // log('synched conns', webrtcProvider.room.webrtcConns.values())
    })

    //  const awareness = webrtcProvider.awareness

    const indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, doc)
    log('setupSync done', webrtcProvider)

    this.webrtcProvider = webrtcProvider
    this.indexeddbPersistence = indexeddbPersistence

    this.chat = doc.getArray('chat')
  }

  getPeers() {
    return Array.from(this.webrtcProvider.room.webrtcConns.values() || [])
  }

  getPeer(peerID) {
    return this.webrtcProvider.room.webrtcConns.get(peerID) || null
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
    return this.getPeer(peerID).peer.stream
  }

  setStream(stream) {
    log('setstream', stream)
    this.stream = stream
    let currentPeers = this.getPeers()
    log('currentperrs', currentPeers)
    for (let peer of currentPeers) {
      log('ppp', peer)
      peer.peer.addStream(stream)
    }
    // this.webrtcProvider.on('peers', info => {
    //   log('xpeers', info)
    //   let added = Array.from(info.added)
    //   for (let peerID of added) {
    //     log('added', this.getPeer(peerID))
    //   }
    //
    //   // let peers = Array.from(info.webrtcPeers)
    //   // log('peers', peers)
    //   // for (let peerId of peers) {
    //   //   let peer = webrtcProvider.room.webrtcConns.get(peerId)
    //   //   log('peer', peer.peer)
    //   // }
    // })
  }

}

export function setupSync({ room } = {}) {
  return new Sync({ room })
}
