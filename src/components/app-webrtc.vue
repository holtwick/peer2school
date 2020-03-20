<template>
  <div>
    <pre>{{ info }}</pre>
    <video ref="video"/>
  </div>
</template>

<style lang="scss">
video {
  border: 1px solid gray;
}
</style>

<script>

import { WebRTC } from '../lib/webrtc'

let rtc = new WebRTC('sample')

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
    return {
      info: {},
    }
  },
  methods: {},
  async mounted() {
    let video = this.$refs.video //  document.querySelector('video')
    log('video', video)

    rtc.on('connect', _ => {
      log('peer!')
    })

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

    function errorHandler(err) {
      log('error', err)
    }

    // Solution via https://stackoverflow.com/a/47958949/140927
    // Only available for HTTPS! See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security
    const opt = {
      audio: true,
      video: {
        facingMode: 'user',
        frameRate: {
          ideal: 10,
        },
      },
    }
    // if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
    //   navigator.getUserMedia(opt, addMedia, errorHandler)
    // } else {
    //   navigator.mediaDevices.getUserMedia(opt).then(addMedia).catch(errorHandler)
    // }
  },
}
</script>

