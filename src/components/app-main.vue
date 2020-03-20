<template>
  <div>
    <h1>Peer2School</h1>
    <app-webrtc></app-webrtc>
    <!--    <app-jitsi></app-jitsi>-->
  </div>
</template>

<style lang="scss"></style>

<script>
import AppJitsi from './app-jitsi'
import AppWebrtc from './app-webrtc'

export default {
  name: 'app-main',
  components: { AppWebrtc, AppJitsi },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

