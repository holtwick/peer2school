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
      <div v-if="!state.teacher">
        <li v-for="peer in state.status">
          <div v-if="state.teacherStreams.find(s => s === peer.remote)" class="peer-name">{{ getPeerNameBySenderId(peer.remote) }}</div>
          <app-video v-if="state.teacherStreams.find(s => s === peer.remote)" :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>
          <app-video v-else :key="peer.remote" :stream="peer.peer.stream" :visible="false" class="peer"/>
        </li>
      </div>
      <div v-else>
        <li v-for="peer in state.status">
          <div class="peer-name">{{ getPeerNameBySenderId(peer.remote) }}</div>
          <app-video :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>
        </li>
      </div>
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

