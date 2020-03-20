<template>
  <video ref="video">

  </video>
</template>

<style lang="scss"></style>

<script>
import Peer from 'simple-peer'

const log = require('debug')('app:app-webrtc')

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia)

export default {
  name: 'app-webrtc',
  data() {
    return {}
  },
  methods: {},
  async mounted() {
    const peer1 = new Peer({ initiator: true }) // you don't need streams here
    const peer2 = new Peer()

    // await this.$nextTick()

    let video = this.$refs.video //  document.querySelector('video')
    log('video', video)

    peer1.on('signal', data => {
      log('signal1', data)
      peer2.signal(data)
    })

    peer2.on('signal', data => {
      log('signal2', data)
      peer1.signal(data)
    })

    peer2.on('stream', stream => {
      log('stream')
      // got remote video stream, now let's show it in a video tag

      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        video.src = window.URL.createObjectURL(stream) // for older browsers
      }

      video.play()
    })

    function addMedia(stream) {
      log('addMedia')
      peer1.addStream(stream) // <- add streams to peer dynamically
    }

    // then, anytime later...
    navigator.getUserMedia({ video: true, audio: true }, addMedia, () => {
    })
  },
}
</script>

