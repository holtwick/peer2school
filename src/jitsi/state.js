import { FromIFrameChannel } from '../lib/mq/channel'
import { ChannelTaskQueue } from '../lib/mq/mq'

require('debug').enable('*')
const log = require('debug')('jitsi:state')

export let state = {

  // Streams per peerID
  streams: {},
}

export let queue = new ChannelTaskQueue(new FromIFrameChannel('jitsi'))

queue.on('xready', _ => {
  log('ready received on iframe', _)
  queue.emit('xtest')
})

queue.on('xtest', _ => {
  log('ready received on iframe xtest', _)
})

queue.emit('xready', 'from iframe')

log('jitsi setup done')
