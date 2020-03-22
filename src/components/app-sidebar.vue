<template>
  <div class="vstack sidebar text">
    <form @submit.prevent.stop="setUsername" class="account-wrapper">
      <input type="text" v-model="username" placeholder="Name" />
      <input type="submit" value="Save"/>
    </form>
    <br />

    <app-video :stream="state.stream" class="peer"/>
    <hr />
    <ul class="other-streams">
      <li v-for="peer in state.status">
        <div class="peer-name">{{ getPeerNameBySenderId(peer.remote) }}</div>
        <app-video :key="peer.remote" :stream="peer.peer.stream" class="peer"/>
      </li>
    </ul>

    <slot></slot>
    <br />
    <app-chat/>
  </div>
</template>

<style lang="scss">
  .other-streams {
    margin: 0 !important;
    li {
      list-style-type: none;
      margin: 0;
      div.peer-name {
        background: #ffffff;
        width: 100%;
        text-align: center;
      }

      video.peer {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-bottom: 0;
      }
    }
  }
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
import {getPeerNameBySenderId, setPeerName} from '../state';

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
    getPeerNameBySenderId(senderId) {
      return getPeerNameBySenderId(senderId);
    },
    setUsername() {
      setPeerName(this.username);
    }
  },
  async mounted() {
  },
}
</script>

