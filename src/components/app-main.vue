<template>
  <div>
    <h1>Peer2School</h1>
    <app-jitsi></app-jitsi>
  </div>
</template>

<style lang="scss"></style>

<script>
import AppJitsi from './app-jitsi'
export default {
  name: 'app-main',
  components: { AppJitsi },
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    doSome() {

    },
  },
  async mounted() {

  },
}
</script>

