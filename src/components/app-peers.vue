<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="hstack">

    <app-chat class="chat"/>

    <div class="video -fit">
      <app-video :stream="state.stream" class="peer"/>
      <app-video v-for="peer in state.status" :key="peer.remote" :stream="peer.peer.stream" class="peer"/>
    </div>

  </div>
</template>

<style lang="scss">
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

import { sendChatMessage } from '../state'
import AppChat from './app-chat'
import AppVideo from './app-video'

const log = require('debug')('sandbox:webrtc')

export default {
  name: 'app-peers',
  components: { AppChat, AppVideo },
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

