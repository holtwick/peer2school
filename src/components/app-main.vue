<template>
  <div class="vstack">
    <div class="header hstack bg-blue-600 shadow text-white p-3 border-b-4 border-blue-400">
      <h1 class="-fit text-lg">peer.school</h1>
    </div>
    <app-peers class="-fit"></app-peers>
  </div>
</template>

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

