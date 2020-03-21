<template>
  <div class="vstack">

    <div class="header hstack">
      <h1 class="-fit">peer.school</h1>
      <div class="link">
        <span>TEACHER</span>
        Share <a :href="url">{{ url }}</a>
      </div>
    </div>

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
  name: 'app-teacher',
  components: {
    AppPeers,
  },
  data() {
    return {}
  },
  computed: {
    url() {
      return `https://peer.school/class/${this.state.room}`
    },
  },
  methods: {},
  async mounted() {
  },
}
</script>

