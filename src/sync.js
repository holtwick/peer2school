import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'
import { ENABLE_MEDIASERVER } from './config'
import { Emitter } from './lib/emitter'
import { WebrtcProvider } from './lib/y-webrtc'

const log = require('debug')('app:sync')

// https://webrtchacks.com/limit-webrtc-bandwidth-sdp/
function setMediaBitrate(sdp, media, bitrate) {
  let lines = sdp.split('\n')
  let line = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('m=' + media) === 0) {
      line = i
      break
    }
  }
  if (line === -1) {
    console.debug('Could not find the m line for', media)
    return sdp
  }
  log('Found the m line for', media, 'at line', line)

  // Pass the m line
  line++

  // Skip i and c lines
  while (lines[line].indexOf('i=') === 0 || lines[line].indexOf('c=') === 0) {
    line++
  }

  // If we're on a b line, replace it
  if (lines[line].indexOf('b') === 0) {
    log('Replaced b line at line', line)
    lines[line] = 'b=AS:' + bitrate
    return lines.join('\n')
  }

  // Add a new b line
  log('Adding new b line before line', line)
  let newLines = lines.slice(0, line)
  newLines.push('b=AS:' + bitrate)
  newLines = newLines.concat(lines.slice(line, lines.length))
  return newLines.join('\n')
}

const peerSettings = {
  // trickle: false,
  sdpTransform: sdp => {
    let newSDP = sdp
    log('Old SDP', newSDP)
    newSDP = setMediaBitrate(newSDP, 'video', 233)
    newSDP = setMediaBitrate(newSDP, 'audio', 80)
    log('New SDP', newSDP)
    return newSDP
  },
  config: {
    iceTransportPolicy: 'all',
    reconnectTimer: 3000,

    // iceServers: [{
    //   urls: 'stun:stun.l.google.com:19302',
    // }, {
    //   urls: 'stun:global.stun.twilio.com:3478?transport=udp',
    // }, {
    //   urls: 'turn:numb.viagenie.ca',
    //   username: 'dirk.holtwick@gmail.com',
    //   credential: 'ssg94JnM/;Pu',
    // }],
    // iceServers: [{
    //   urls: 'stun:vs.holtwick.de',
    // }, {
    //   urls: 'turn:vs.holtwick.de', // 3478
    // }],
    // iceServers: [{
    //   urls: 'stun:numb.viagenie.ca',
    //   username: 'dirk.holtwick@gmail.com',
    //   credential: 'ssg94JnM/;Pu',
    // }, {
    //   urls: 'turn:numb.viagenie.ca',
    //   username: 'dirk.holtwick@gmail.com',
    //   credential: 'ssg94JnM/;Pu',
    // }],

  },
}

export class Sync extends Emitter {

  chat
  stream
  indexeddbPersistence
  webrtcProvider
  peerID
  doc

  streams = {}

  constructor({ room }) {
    super()

    this.doc = new Y.Doc()

    const webrtcProvider = new WebrtcProvider('peer-school-' + room, this.doc, {
      // maxConns: 30 + Math.floor(Math.random() * 15), // just to prevent that exactly n clients form a cluster
      filterBcConns: true,
      peerSettings,
    })
    this.webrtcProvider = webrtcProvider

    webrtcProvider.on('peers', info => {
      if (!ENABLE_MEDIASERVER) {
        let added = Array.from(info.added)
        for (let peerID of added) {
          let peer = this.getPeer(peerID)
          if (peer) {
            if (this.stream) {
              peer.peer.addStream(this.stream)
            }
            peer.peer.on('stream', stream => {
              this.streams[peerID] = stream
              this.emit('stream', { peerID, stream })
            })
          } else {
            console.warn('added peer but cannot find', peerID, info)
          }
        }
      }
      this.checkPeerID()
      this.emit('peers')
    })

    webrtcProvider.on('synced', info => {
      log('synced', info)
      this.checkPeerID()
      this.emit('ready', { peerID: this.peerID })
    })

    //  const awareness = webrtcProvider.awareness

    this.indexeddbPersistence = new IndexeddbPersistence('peer-school-' + room, this.doc)
  }

  checkPeerID() {
    if (!this.peerID) {
      this.peerID = this.webrtcProvider.room.peerId
      if (this.peerID) {
        this.emit('peerID', this.peerID)
      }
    }
  }

  getWebRTCConns() {
    return this.webrtcProvider?.room?.webrtcConns
  }

  getPeers() {
    return Array.from(this.getWebRTCConns()?.values() || [])
  }

  getPeer(peerID) {
    log('getPeers', this.webrtcProvider?.room)
    return this.getWebRTCConns()?.get(peerID) || null
  }

  getPeerList() {
    try {
      return Array.from(this.getWebRTCConns()?.keys() || [])
    } catch (err) {
      console.warn('getPeerList err', err)
    }
    return []
  }

  getStream(peerID) {
    try {
      return this.streams[peerID]
    } catch (err) {
      console.warn('getStream err', err, peerID)
    }
    return null
  }

  setStream(stream) {
    this.stream = stream
    let currentPeers = this.getPeers()
    for (let peer of currentPeers) {
      peer.peer.addStream(stream)
    }
  }

}

export function setupSync(opt) {
  return new Sync(opt)
}
