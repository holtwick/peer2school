import { PostChannel } from '../lib/mq/channel'
import { ChannelTaskQueue } from '../lib/mq/mq'

const log = require('debug')('jitsi:state')

export let state = {

  // Streams per peerID
  streams: {},
}

export let queue = new ChannelTaskQueue(new PostChannel(this))
queue.on('ready', _ => {
  log('ready iframe')
})

queue.emit('ready')

log('jitsi setup done')
