<template>
  <video ref="video"/>
</template>

<style lang="scss">

</style>

<script>

import { connectStreamToVideoElement } from '../lib/usermedia'

export default {
  name: 'app-video',
  props: {
    stream: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {}
  },
  methods: {
    async doConnectStream(stream) {
      // peer2.on('stream', stream => {
      //   log('stream')
      //
      //   // got remote video stream, now let's show it in a video tag
      //   if ('srcObject' in video) {
      //     video.srcObject = stream
      //   } else {
      //     video.src = window.URL.createObjectURL(stream) // for older browsers
      //   }
      //   video.play()
      // })

      // function addMedia(stream) {
      //   log('addMedia')
      //   peer1.addStream(stream) // <- add streams to peer dynamically
      // }

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

