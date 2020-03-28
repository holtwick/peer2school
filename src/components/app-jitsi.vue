<template>
  <iframe
    src="/jitsi.html"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    scrolling="no"
    class="iframe"
    style="overflow: hidden;"
    ref="iframe"></iframe>
</template>

<style lang="scss">
.iframe {
  width: 100%;
  border: 1px solid gray;
}
</style>

<script>
export default {
  name: 'app-jitsi',
  props: {
    value: String,
  },
  data() {
    return {
      timer: null,
    }
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    async doUpdateHTML(value) {
      window.scrollTo(0, 0)
      this.clearTimer()
      if (value) {
        let iFrame = this.$refs.iframe
        if (iFrame) {
          iFrame.style.height = '400px'
          const iFrameWindow = iFrame.contentWindow
          const iFrameDocument = iFrameWindow.document
          iFrame.style.height = Math.max(400, iFrameDocument.body.offsetHeight + 120) + 'px'
          let prevHeight = 0
          this.timer = setInterval(() => {
            let bodyHeight = +iFrameDocument.body.getBoundingClientRect().height
            let childrenHeight = 0
            let el = iFrameDocument.body.firstElementChild
            while (el) {
              childrenHeight += el.getBoundingClientRect().height
              el = el.nextElementSibling
            }
            const currentHeight = Math.max(childrenHeight, bodyHeight)
            prevHeight = currentHeight
            iFrame.style.height = Math.max(400, currentHeight) + 'px'
          }, 500)
        }
      }
    },
  },
  async mounted() {
    await this.doUpdateHTML(this.value)
  },
  beforeDestroy() {
    this.clearTimer()
  },
}
</script>

