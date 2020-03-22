<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="hstack">
    <div class="flex w-full">
      <div class="vstack sidebar text bg-gray-200 shadow w-1/4">
        <app-video :stream="state.stream"
                   class="rounded my-2 shadow"/>

        <div class="overflow-auto bg-white rounded px-4 my-3 shadow" v-if="state.status.length">
          <div class="flex flex-wrap -mx-2">
            <div class="px-1 my-2 w-1/2" v-for="peer in state.status" :key="peer.remote">
              <app-video :stream="peer.peer.stream"
                         class="rounded shadow"/>
            </div>
          </div>
        </div>

        <app-chat/>
      </div>
      <app-whiteboard class="w-3/4"></app-whiteboard>

    </div>



  </div>
</template>

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

