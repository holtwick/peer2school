<template>
  <div>
    <h1>Room {{ state.room }}</h1>
    <app-peers></app-peers>
    <!--    <app-webrtc></app-webrtc>-->
    <!--    <app-jitsi></app-jitsi>-->
  </div>
</template>

<style lang="scss"></style>

<script>
import AppPeers from './app-peers'
// import AppJitsi from './app-jitsi'
// import AppWebrtc from './app-webrtc'

export default {
  name: 'app-main',
  components: {
    AppPeers,
    // AppWebrtc,
    // AppJitsi,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

