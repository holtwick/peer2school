<template>
  <div v-if="this.visible">
    <video ref="video"/>
  </div>
</template>

<style lang="scss">

</style>

<script>

import { connectStreamToVideoElement } from '../lib/usermedia'

export default {
  name: 'app-video',
  props: {
    stream: {
    },
    visible: false,
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

