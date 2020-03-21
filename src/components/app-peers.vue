<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="hstack">

    <div class="vstack sidebar text">
      <app-video :stream="state.stream" class="peer"/>
      <app-video v-for="peer in state.status" :key="peer.remote" :stream="peer.peer.stream" class="peer"/>
      <app-chat class="chat"/>
    </div>

    <app-whiteboard class="-fit"></app-whiteboard>

  </div>
</template>

<style lang="scss">

.sidebar {
  width: 20%;
  background: #eee;
  padding: 1rem;
}

/*.video {*/
/*  padding: 1rem;*/
/*  display: flex;*/
/*  flex-wrap: wrap;*/

/*}*/

.chat {

}

.peer {
  background: #333;
  max-width: 20rem;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

</style>

<script>

import { sendChatMessage } from '../state'
import AppChat from './app-chat'
import AppVideo from './app-video'
import AppWhiteboard from './app-whiteboard'

const log = require('debug')('sandbox:webrtc')

export default {
  name: 'app-peers',
  components: { AppWhiteboard, AppChat, AppVideo },
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

