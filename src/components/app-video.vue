<template>
  <video ref="video"></video>
</template>

<style lang="scss"></style>

<script>
import { session } from '../lib/session'
import { connectStreamToVideoElement } from '../lib/usermedia'

export default {
  name: 'app-video',
  props: {
    id: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {}
  },
  methods: {
    async doConnectStream(id) {
      let stream = session.getPeer(id).stream
      connectStreamToVideoElement(stream, this.$refs.video)
    },
  },
  async mounted() {
    await this.doConnectStream(id)
  },
  watch: {
    id(value) {
      this.doConnectStream(value)
    },
  },
}
</script>

