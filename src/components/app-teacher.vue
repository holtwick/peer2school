<template>
  <div class="vstack">
    <app-peers class="-fit"></app-peers>
    <div class="header hstack bg-blue-600 shadow text-white p-3 border-ts-4 border-blue-400">
      <h1 class="-fit text-lg">peer.school (Teacher)</h1>
      <div class="link">
        <font-awesome-icon icon="share-square" />
        Share
        <a class="text-white hover:underline" :href="url">{{ url }}</a>
      </div>
    </div>
  </div>
</template>

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

