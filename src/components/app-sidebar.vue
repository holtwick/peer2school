<template>
  <div class="vstack sidebar text">
    <app-video :stream="state.stream" class="peer"/>

    {{ state.peers }}
    <app-video v-for="peer in state.peers" :key="peer" :id="peer" class="peer"/>
    <slot></slot>
    <app-chat/>
  </div>
</template>

<style lang="scss">
.sidebar {
  width: 20%;
  min-width: 8rem;
  background: #eee;
  padding: 1rem;
}
</style>

<script>
import AppChat from './app-chat'
import AppVideo from './app-video'

export default {
  name: 'app-sidebar',
  components: {
    AppChat,
    AppVideo,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

