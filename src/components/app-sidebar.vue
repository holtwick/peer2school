<template>
  <div class="vstack sidebar text">
    <app-video :stream="state.stream" class="peer"/>
    <app-video v-for="peer in state.status" :key="peer.remote" :stream="peer.peer.stream" class="peer"/>
    <slot></slot>
    <app-chat/>
  </div>
</template>

<style lang="scss">
.sidebar {
  width: 20%;
  background: #eee;
  padding: 1rem;
}
</style>

<script>
export default {
  name: 'app-sidebar',
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

