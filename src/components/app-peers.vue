<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div>
    <h1>WebRTC</h1>

    <h2>Peers</h2>

    <ol>
      <li v-for="peer in status">
        Peer {{peer.name}} {{peer.active}}
        <video></video>
      </li>
    </ol>

    <h2>Chat</h2>

    <ol>
      <li v-for="msg in messages">{{msg.sender}}: <b>{{msg.msg}}</b></li>
    </ol>

    <form @submit.prevent.stop="doSend">
      <input placeholder="Send message" v-model="message">
      <button type="submit">Send</button>
    </form>

    <pre>{{status}}</pre>


  </div>
</template>

<script>

import { WebRTC } from '../lib/webrtc'

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
      webrtc.send('chat', {
        sender: webrtc.io.id,
        msg: this.message,
      })
      this.messages.push({
        sender: 'me',
        msg: this.message,
      })
      this.message = ''
    },
  },
  async mounted() {
    webrtc = new WebRTC()

    webrtc.on('stream', stream => {

    })

    webrtc.on('status', info => {
      this.status = info.status
    })
    webrtc.on('chat', msg => {
      this.messages.push(msg)
    })
  },
}
</script>

