<template>
  <div>
    <h1>Room {{ state.room }}</h1>
    <app-peers></app-peers>
  </div>
</template>

<style lang="scss"></style>

<script>
import AppPeers from './app-peers'


export default {
  name: 'app-main',
  components: {
    AppPeers,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

