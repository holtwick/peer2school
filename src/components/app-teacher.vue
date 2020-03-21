<template>
  <div class="vstack">
    <div class="header hstack">
      <h1 class="-fit">peer.school</h1>
      <div class="link">
        <span>TEACHER</span>
        Share <a :href="url">{{ url }}</a>
      </div>
    </div>

    <div class="video">
      <app-video :stream="state.stream" :visible="true" class="peer"/>
      <app-video v-for="peer in state.status" :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>
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

.video {
  width: 20%;
  padding: 1rem;
  background: #eee;
  overflow: auto;
  overflow-y: scroll;
  max-height: 90%;
}

</style>

<script>
import AppVideo from './app-video'

export default {
  name: 'app-teacher',
  components: {
    AppVideo,
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

