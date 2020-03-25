<template>
  <div class="vstack">
    <app-peers class="-fit"></app-peers>
  </div>
</template>

<style lang="scss">
.header {
  color: white;
  background: #666;
  height: 4rem;
  align-items: center;

  h1 {
    margin-left: 1rem;
    font-size: 2rem;
  }

  .link {
    margin-right: 1rem;

    a {
      color: #e3e3e3;
      text-decoration: none;
    }
  }
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

