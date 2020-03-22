<template>
  <video ref="video"/>
</template>

<style lang="scss">

</style>

<script>
import { connectStreamToVideoElement } from '../lib/usermedia'
import { sync } from '../state'

const log = require('debug')('app:app-video')

export default {
  name: 'app-video',
  props: {
    id: {},
    stream: {},
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
    if (this.id) {
      let stream = sync.getStream(this.id)
      log('stream', this.id, stream)
      await this.doConnectStream(stream)
    } else {
      await this.doConnectStream(this.stream)
    }
  },
  watch: {
    stream(value) {
      this.doConnectStream(value)
    },
  },
}
</script>

