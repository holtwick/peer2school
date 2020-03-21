<template>
  <div class="vstack">
    <div class="header hstack">
      <h1 class="-fit">peer.school</h1>
    </div>
    <div class="hstack">
      <app-chat class="chat" />

      <div class="video -fit">
        <app-video :stream="state.stream" class="peer" />
        <div v-for="peer in state.status" :key="peer.remote">
          <app-video v-if="peer.remote === state.teacher_stream"  :stream="peer.peer.stream" :visible="true" class="peer"/>
          <app-video v-else :stream="peer.peer.stream" class="peer"/>
        </div>
      </div>
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
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.chat {
  width: 20%;
  background: #eee;
  padding: 1rem;
}

.peer {
  // border: 1px solid red;
  background: #333;
  max-width: 20rem;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>

<script>
import AppChat from './app-chat'
import AppVideo from './app-video'

export default {
  name: "app-main",
  components: {
    AppChat, AppVideo
  },
  data() {
    return {};
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
  },
  async mounted() {}
};
</script>

