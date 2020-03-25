<template>
  <video ref="video" v-if="stream" />
  <div v-else class="video-paceholder -content-placeholder">
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

  i {
    font-size: 4rem;
    color: white;
    animation: blink 1000ms infinite;
  }
}

</style>

<script>
import { connectStreamToVideoElement } from '../lib/usermedia'

const log = require('debug')('app:app-video')

export default {
  name: 'app-video',
  props: {
    stream: {
      type: MediaStream,
    },
  },
  data() {
    return {}
  },
  methods: {
    async doConnectStream(stream) {
      await this.$nextTick()
      connectStreamToVideoElement(stream, this.$refs.video)
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

