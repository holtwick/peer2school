<template>
  <div class="jitsi">
    <jitsi-peer :stream="state.stream">
      Me
    </jitsi-peer>

    {{ state.teacher }}

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
import JitsiPeer from './jitsi-peer'
import JitsiVideo from './jitsi-video'

const log = require('debug')('jitsi:main')

export default {
  name: 'jitsi-main',
  components: { JitsiPeer, JitsiVideo },
  data() {
    return {
    }
  },
  methods: {},
  async mounted() {

  },
}
</script>

