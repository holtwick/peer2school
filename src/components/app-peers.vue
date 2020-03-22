<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="flex w-full">
    <app-sidebar class="w-1/4"></app-sidebar>
    <app-whiteboard class="w-3/4"></app-whiteboard>
  </div>
</template>

<script>
import AppSidebar from './app-sidebar'
import AppWhiteboard from './app-whiteboard'

export default {
  name: 'app-peers',
  components: {
    AppSidebar,
    AppWhiteboard,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

