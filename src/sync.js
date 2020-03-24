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

  streams = {}

  constructor({ room }) {
    super()

    log('setupSync')

    const webrtcProvider = new WebrtcProvider('peer-school-' + room, doc, {
      filterBcConns: true,
    })

    webrtcProvider.on('peers', info => {
      log('peers', info)
      let added = Array.from(info.added)
      for (let peerID of added) {
        log('start listening for stream', peerID)
        let peer = this.getPeer(peerID)
        if (peer) {
          if (this.stream) {
            peer.peer.addStream(this.stream)
          }
          peer.peer.on('stream', stream => {
            log('stream received', peerID, stream)
            this.streams[peerID] = stream
            log('streams', this.streams)
            this.emit('stream', { peer, stream })
          })
        } else {
          console.warn('added peer but cannot find', peerID, info)
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

  getWebRTCConns() {
    return this.webrtcProvider?.room?.webrtcConns || null
  }

  getPeers() {
    return Array.from(this.getWebRTCConns()?.values() || [])
  }

  getPeer(peerID) {
    const peer = this.getWebRTCConns()?.get(peerID) || null
    log('getPeer', peer)
    return peer
  }

  getPeerList() {
    try {
      // log('getPeerList', this.webrtcProvider?.room)
      return Array.from(Object.keys(this.getWebRTCConns()?.keys) || [])
    } catch (err) {
      console.warn('getPeerList err', err)
    }
    return []
  }

  getStream(peerID) {
    try {
      let stream = this.streams[peerID] // this.getPeer(peerID)?.peer?.stream
      log('getStream', peerID, stream)
      return stream
    } catch (err) {
      console.warn('getStream err', err, peerID)
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
