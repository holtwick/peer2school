<template>
  <div>
    <div class="jitsi">

      <jitsi-peer
        v-if="!state.teacher" :id="teacherJitsiID"
      >
        {{ teacherName }}
      </jitsi-peer>

      <jitsi-peer
        v-if="studentJitsiID && studentJitsiID !== state.jitsiID"
        :id="studentJitsiID" @click="stopVideo"
      >
        {{ studentName }}
        <i v-if="state.teacher" data-f7-icon="person_crop_circle_fill_badge_xmark"></i>
      </jitsi-peer>

      <jitsi-peer
        :stream="state.stream"
        @click="editProfile"
        :active="state.jitsiID && studentJitsiID === state.jitsiID"
      >
        {{ name }}
        <i v-if="!hasName" data-f7-icon="pencil"></i>
      </jitsi-peer>

    </div>
  </div>
</template>

<style lang="scss">
@import "../css/index";

.jitsi {
  padding: 0.5rem;
  max-width: 100%;
  width: 100%;

  video {
    width: 100%;
  }
}
</style>

<script>
import { LOCAL_NAME } from '../config'
import { getLocal } from '../lib/local'
import JitsiPeer from './jitsi-peer'
import JitsiVideo from './jitsi-video'
import { queue } from './state'

const log = require('debug')('jitsi:main')

export default {
  name: 'jitsi-main',
  components: { JitsiPeer, JitsiVideo },
  data() {
    return {}
  },
  computed: {
    studentJitsiID() {
      return this.state.tracks[this.state.studentID]
    },
    teacherJitsiID() {
      return this.state.tracks[this.state.teacherID]
    },
    hasName() {
      return this.state.profiles[this.state.peerID]?.name != null || getLocal(LOCAL_NAME) != null
    },
    name() {
      return this.state.profiles[this.state.peerID]?.name || getLocal(LOCAL_NAME) || this.l.set_name
    },
    teacherName() {
      return this.state.profiles[this.state.teacherID]?.name || this.l.teacher
    },
    studentName() {
      return this.state.profiles[this.state.studentID]?.name || this.l.student
    },
  },
  methods: {
    stopVideo() {
      queue.emit('action', { action: 'stop' })
    },
    editProfile() {
      queue.emit('action', { action: 'edit' })
    },
  },
  async mounted() {

  },
}
</script>

