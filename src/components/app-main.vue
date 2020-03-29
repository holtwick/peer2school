<template>
  <div class="vstack">
    <div class="-fit hstack">
      <app-sidebar/>
      <app-whiteboard class="-fit" :editable="state.teacher"/>
    </div>
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
import AppSidebar from './app-sidebar'
import AppWhiteboard from './app-whiteboard'

export default {
  name: 'app-main',
  components: {
    AppWhiteboard,
    AppSidebar,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

