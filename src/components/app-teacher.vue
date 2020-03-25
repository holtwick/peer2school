<template>
  <div class="vstack">
    <app-peers class="-fit"></app-peers>
    <div class="header hstack" v-if="false">
      <div class="title -fit">peer.school</div>
      <div class="link">
        Share <a :href="url">{{ url }}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.header {
  color: white;
  background: #333;
  height: 2rem;
  align-items: center;

  .title {
    margin-left: 1rem;
    // font-size: 2rem;
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
import { createLinkForRoom } from '../lib/share'
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
      return createLinkForRoom(this.state.room)
    },
  },
  methods: {},
  async mounted() {
  },
}
</script>

