<template>
  <video ref="video"/>
</template>

<style lang="scss"></style>

<script>
import { connectStreamToVideoElement } from '../lib/usermedia'

const log = require('debug')('app:app-video')

export default {
  name: 'app-video',
  props: {
    stream: null,
  },
  data() {
    return {}
  },
  methods: {
    async doConnectStream(stream) {
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

