<template>
  <div class="jitsi-container">
    <iframe
      :src="url"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      scrolling="no"
      class="iframe"
      style="overflow: hidden;"
      ref="iframe"></iframe>
  </div>
</template>

<style lang="scss">
.jitsi-container {
  margin: -0.5rem;
}

.iframe {
  width: 100%;
}
</style>

<script>
import { channel, queue } from '../state'

const log = require('debug')('app:app-jitsi')

const minHeight = 100

export default {
  name: 'app-jitsi',
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    url() {
      return `jitsi.html#${this.state.room}`
    },
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
  },
  async mounted() {
    window.scrollTo(0, 0)
    this.clearTimer()
    let iFrame = this.$refs.iframe
    if (iFrame) {
      iFrame.style.height = minHeight + 'px'
      const iFrameWindow = iFrame.contentWindow
      const iFrameDocument = iFrameWindow.document
      iFrame.style.height = Math.max(minHeight, iFrameDocument.body.offsetHeight + 1) + 'px'
      let prevHeight = 0
      this.timer = setInterval(() => {
        const iFrameDocument = iFrameWindow.document
        // let bodyHeight = Math.ceil(+iFrameDocument.body.getBoundingClientRect().height)
        let childrenHeight = 0
        let el = iFrameDocument.body.firstElementChild
        while (el) {
          childrenHeight += el.getBoundingClientRect().height
          el = el.nextElementSibling
        }
        // log('heights', childrenHeight, bodyHeight)
        // const currentHeight = Math.ceil(Math.max(childrenHeight, bodyHeight))
        const currentHeight = Math.ceil(childrenHeight)
        prevHeight = currentHeight
        iFrame.style.height = Math.max(minHeight, currentHeight) + 'px'
      }, 500)

      log('iframe connect', iFrameWindow)
      channel.connect(iFrameWindow)

      queue.emit('state', {
        peerID: this.state.peerID,
        teacherID: this.state.info.teacherID,
        studentID: this.state.info.studentID,
      })
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  watch: {
    'state.peerID'(value) {
      queue.emit('state', { peerID: value })
    },
    'state.info.teacherID'(value) {
      queue.emit('state', { teacherID: value })
    },
    'state.info.studentID'(value) {
      queue.emit('state', { studentID: value })
    },
    'state.tracks': {
      handler(value) {
        queue.emit('state', { tracks: value })
      },
      deep: true,
    },
    'state.profiles': {
      handler(value) {
        queue.emit('state', { profiles: value })
      },
      deep: true,
    },
  },
}
</script>

