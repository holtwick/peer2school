<template>
  <div class="jitsi">
    <jitsi-video v-if="stream" :stream="stream"></jitsi-video>
  </div>
</template>

<style lang="scss">
.jitsi {
  max-width: 100%;
  width: 100%;

  video {
    width: 100%;
  }
}
</style>

<script>
import { JitsiBridge } from './jitsi'
import JitsiVideo from './jitsi-video'

require('debug').enable('*')
const log = require('debug')('jitsi:main')

export default {
  name: 'jitsi-main',
  components: { JitsiVideo },
  data() {
    return {
      stream: null,
      room: '',
    }
  },
  methods: {},
  async mounted() {
    this.room = location.hash.substr(1)
    const jitsi = new JitsiBridge({ room: this.room })

    jitsi.on('stream', ({ stream }) => {
      log('stream', stream)
      this.stream = stream // local video
    })

    // jitsi.on('joined', ({ id }) => {
    //   let peerID = state.peerID
    //   log('joined', peerID, id)
    //   jitsiID = id
    //   if (peerID) {
    //     log('set jitsi id via joined', peerID, jitsiID)
    //     sync.tracks.set(jitsiID, state.peerID)
    //   }
    // })
    //
    // jitsi.on('add', ({ id, track, video }) => {
    //   let peerID = state.tracks[id]
    //   log('add', id, video, peerID)
    //   assert(id)
    //   assert(track)
    //   if (video) {
    //     videoTracks[id] = track
    //     if (peerID) {
    //       log('set stream', peerID, id)
    //       Vue.set(state.streams, peerID, track)
    //     }
    //   } else {
    //     audioTracks[id] = track
    //   }
    //   if (videoTracks[id] && audioTracks[id]) {
    //
    //   }
    //   log('add done')
    // })

    jitsi.connect().then(_ => log('jitsi connect')).catch(err => log('jitsi err', err))
  },
}
</script>

