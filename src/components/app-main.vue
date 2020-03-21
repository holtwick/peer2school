<template>
  <div class="vstack">
    <div class="header">Header</div>
    <app-peers class="-fit"></app-peers>
  </div>
</template>

<style lang="scss">
.header {
  background: #666;
  height: 4rem;
}
</style>

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

