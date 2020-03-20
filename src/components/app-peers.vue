<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div>

    <div class="video-local">
      <app-video :stream="state.stream"></app-video>
    </div>

    <div class="video-remote">
      <div class="peer" v-for="peer in state.status">
        <app-video :stream="peer.peer.stream"></app-video>
      </div>
    </div>

    <h2>Chat</h2>

    <form @submit.prevent.stop="doSend">
      <ol>
        <li v-for="msg in state.chat">{{msg.sender}}: <b>{{msg.msg}}</b></li>
        <li>
          <input placeholder="Send message" v-model="message">
          <button type="submit">Send</button>
        </li>
      </ol>
    </form>

    <pre>{{ state }}</pre>

  </div>
</template>

<style lang="scss">
.video-local {

}

.video-remote {
  display: flex;

  .peer {
    border: 1px solid red;
  }
}
</style>

<script>

import { sendChatMessage } from '../state'
import AppVideo from './app-video'

const log = require('debug')('sandbox:webrtc')

export default {
  name: 'app-peers',
  components: { AppVideo },
  data() {
    return {
      items: [],
      status: [],
      message: '',
      messages: [],
      webrtc: null,
    }
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
  },
  async mounted() {

  },
}
</script>

