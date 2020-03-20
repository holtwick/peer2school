<template>
  <div>
    Video:
    <video ref="video">

    </video>
  </div>
</template>

<style lang="scss"></style>

<script>
import Peer from 'simple-peer'

const log = require('debug')('app:app-webrtc')

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

log('getUserMedia', navigator.getUserMedia)

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

    function errorHandler(err) {
      log('error', err)
    }

    // Solution via https://stackoverflow.com/a/47958949/140927
    // Only available for HTTPS! See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security
    const opt = {
      audio: true,
      video: {
        facingMode: 'user',
        // frameRate: {
        //   ideal: 10,
        //   max: 15,
        // },
      },
    }
    if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
      navigator.getUserMedia(opt, addMedia, errorHandler)
    } else {
      navigator.mediaDevices.getUserMedia(opt).then(addMedia).catch(errorHandler)
    }
  },
}
</script>

