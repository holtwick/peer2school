<template>
  <video autoplay playsinline ref="video" v-if="stream" @click="handleClick"/>
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
export function connectStreamToVideoElement(stream, video) {
  if (stream) {
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }
    video.play()
  }
}

const log = require('debug')('app:app-video')

export default {
  name: 'app-video',
  props: {
    stream: {
      type: MediaStream | Object,
    },
  },
  data() {
    return {}
  },
  methods: {
    playVideo(video) {
      let startPlayPromise = video.play()
      log('play', startPlayPromise)
      if (startPlayPromise !== undefined) {
        startPlayPromise.then(() => {
          // Start whatever you need to do only after playback
          // has begun.
        }).catch(error => {
          if (error.name === 'NotAllowedError') {
            this.showPlayButton = true
          } else {
            console.error(error)
          }
        })
      }
    },
    async doConnectStream(stream) {
      log('doConnectStream', this.title, stream)
      if (stream) {
        try {
          await this.$nextTick()

          let video = this.$refs.video
          log('connectStreamToVideoElement', stream, video)
          if (stream) {
            if ('srcObject' in video) {
              video.srcObject = stream
            } else {
              video.src = window.URL.createObjectURL(stream) // for older browsers
            }

            // Keep in mind https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
            // But if the user allows to access camera it should be fine
            // https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
            video.onloadedmetadata = e => this.playVideo(video)
            video.onloadeddata = e => this.playVideo(video)
          }
        } catch (err) {
          console.error(err)
        }
      }
    },
    handleClick() {
      this.doPlay()
    },
    async doPlay() {
      try {
        log('force play manually')
        this.$refs?.video?.play()
        this.showPlayButton = false
      } catch (err) {
        console.error(err)
      }
    },
  },
  async mounted() {
    if (this.stream) {
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

