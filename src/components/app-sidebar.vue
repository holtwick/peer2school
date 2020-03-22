<template>
  <div class="vstack sidebar text">
    <form @submit.prevent.stop="setUsername" class="account-wrapper">
      <input type="text" v-model="username" placeholder="Name" />
      <input type="submit" value="Save"/>
    </form>
    <br />

    <app-video :stream="state.stream" class="peer"/>
    <app-video v-for="peer in state.status" :key="peer.remote" :stream="peer.peer.stream" class="peer"/>

    <slot></slot>
    <app-chat/>
  </div>
</template>

<style lang="scss">
  .account-wrapper {
    input {
      float: left;
      &[type="text"] {
        width: 70%;
        margin-right: 3%;
      }
      &[type="submit"] {
        width: 27%;
      }
    }
  }
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
import {setPeerName} from '../state';

export default {
  name: 'app-sidebar',
  components: {
    AppChat,
    AppVideo,
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    setUsername() {
      setPeerName(this.username);
    }
  },
  async mounted() {
  },
}
</script>

