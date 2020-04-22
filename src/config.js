export const ENABLE_VIDEO = true
export const ENABLE_MEDIASERVER = false

export const LOCAL_ID = 'id'
export const LOCAL_NAME = 'name'

// See https://github.com/feross/simple-peer#peer--new-peeropts
export const ICE_CONFIG = {
  iceTransportPolicy: 'all',
  reconnectTimer: 3000,
  iceServers: [{
    urls: 'stun:turn01.brie.fi:5349',
  }, {
    urls: 'turn:turn01.brie.fi:5349',
    username: 'brie',
    credential: 'fi',
  }],
}
