<template>
  <div>
    <h1>Peer2School</h1>
    <app-peers></app-peers>
<!--    <app-webrtc></app-webrtc>-->
    <!--    <app-jitsi></app-jitsi>-->
  </div>
</template>

<style lang="scss"></style>

<script>
import AppJitsi from './app-jitsi'
import AppPeers from './app-peers'
import AppWebrtc from './app-webrtc'

export default {
  name: 'app-main',
  components: { AppPeers, AppWebrtc, AppJitsi },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

