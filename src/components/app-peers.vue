<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div>

    <div class="video">
      <app-video :stream="state.stream" class="peer"/>
      <app-video v-for="peer in state.status" :stream="peer.peer.stream" class="peer"/>
    </div>

    <div class="chat">
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
    </div>

  </div>
</template>

<style lang="scss">
.video {
  display: flex;
}

.peer {
  border: 1px solid red;
  max-width: 20rem;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
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

