<template>
  <iframe
    src="about:blank"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    scrolling="no"
    class="app-jitsi"
    style="overflow: hidden;"
    ref="iframe"
  />
</template>

<style lang="scss">
.app-jitsi {
  width: 100%;
  height: 600px;
}
</style>

<script>
export default {
  name: 'app-jitsi',
  data() {
    return {}
  },
  methods: {
    async doUpdateHTML(value) {
      if (value) {
        // this.html = `data:text/html,` + value
        // await this.$nextTick()
        let iFrame = this.$refs.iframe
        if (iFrame) {
          const iFrameWindow = iFrame.contentWindow
          const iFrameDocument = iFrameWindow.document
          // if (isApple) {
          //   iFrameDocument.documentElement.innerHTML = value
          // } else {
          iFrameDocument.open()
          iFrameDocument.write(value)
          iFrameDocument.close()
          // }
        }
      }
    },
  },
  async mounted() {
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Jitsi</title>
    ${'<script src=\'https://meet.jit.si/external_api.js\'></scr' + 'ipt>'}
</head>
<body>
<div id="meet"></div>
<scr${'ipt'}>
const domain = 'meet.jit.si'
const options = {
  // interfaceConfigOverwrite: { filmStripOnly: true },
  noSsl: false,
  // userInfo: {
  //   email: 'email@jitsiexamplemail.com'
  // },
  roomName: 'JitsiMeetAPIExample123',
  width: 700,
  height: 700,
  parentNode: document.querySelector('#meet'),
}
const api = new JitsiMeetExternalAPI(domain, options)
</scr${'ipt'}>
</body>
</html>
`
    await this.doUpdateHTML(html)
  },
}
</script>
