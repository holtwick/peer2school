<template>
  <!--  <audio autoplay ref="audio" v-if="audioStream" />-->
  <video autoplay ref="video" v-if="stream"/>
  <div v-else class="video-placeholder -content-placeholder">
    <i data-f7-icon="rectangle_stack_person_crop"></i>
  </div>
</template>

<style lang="scss">
video {
  display: block;
  margin: 0;
}

.video-placeholder {
  min-height: 6rem;
  background: #333;
  color: white;

  i {
    font-size: 4rem;
    color: white;
    animation: blink 1000ms infinite;
  }
}

</style>

<script>
const log = require('debug')('app:app-video')

export default {
  name: 'jitsi-video',
  props: {
    stream: {
      type: MediaStream | Object,
    },
    audioStream: {
      type: MediaStream | Object,
    },
  },
  data() {
    return {}
  },
  methods: {
    async doConnectStream(stream) {
      log('doConnectStream')
      if (stream) {
        await this.$nextTick()
        log('doConnectStream jitsi', stream)
        stream.attach(this.$refs.video)
      }
    },
  },
  async mounted() {
    await this.doConnectStream(this.stream)
  },
  watch: {
    stream(value) {
      this.doConnectStream(value)
    },
  },
}
</script>

