<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div>

    <ol>
      <li v-for="peer in status">
        Peer {{peer.name}} {{peer.active}}
      </li>
    </ol>

    <h2>Chat</h2>

    <ol>
      <li v-for="msg in state.chat">{{msg.sender}}: <b>{{msg.msg}}</b></li>
    </ol>

    <form @submit.prevent.stop="doSend">
      <input placeholder="Send message" v-model="message">
      <button type="submit">Send</button>
    </form>

    <pre>{{ state }}</pre>

  </div>
</template>

<script>


import { sendChatMessage } from '../state'

const log = require('debug')('sandbox:webrtc')

let webrtc

export default {
  name: 'app-peers',
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

