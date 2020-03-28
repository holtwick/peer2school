<template>
  <div class="jitsi">
    <jitsi-peer :stream="stream">
      Me
    </jitsi-peer>

    <!--    <jitsi-peer v-if="!state.teacher" :id="state.info.teacherID">-->
    <!--      {{ teacherName }}-->
    <!--    </jitsi-peer>-->

    <!--    <jitsi-peer v-if="state.info.studentID && state.info.studentID !== state.peerID" :id="state.info.studentID" @click="stopVideo">-->
    <!--      {{ studentName }}-->
    <!--      <i v-if="state.teacher" data-f7-icon="person_crop_circle_fill_badge_xmark"></i>-->
    <!--    </jitsi-peer>-->

    <!--    <jitsi-peer :stream="state.stream" @click="editProfile" :active="state.peerID && state.info.studentID === state.peerID">-->
    <!--      {{ name }}-->
    <!--      <i v-if="!hasName" data-f7-icon="pencil"></i>-->
    <!--    </jitsi-peer>-->

  </div>
</template>

<style lang="scss">
@import "../css/index";

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
import JitsiPeer from './jitsi-peer'
import JitsiVideo from './jitsi-video'

const log = require('debug')('jitsi:main')

export default {
  name: 'jitsi-main',
  components: { JitsiPeer, JitsiVideo },
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

