<template>
  <div class="chat">
    <input type="text" v-model="username" />
    <button @click="setUsername()">Save</button>
    <form @submit.prevent.stop="doSend">
      <div v-for="msg in state.chat">
        {{ msg.sender }}<br />
        {{ getPeerNameBySenderId(msg.sender) }}: <b>{{msg.msg}}</b>
      </div>
      <div>
        <input placeholder="Send message" v-model="message">
        <!--        <button type="submit">Send message</button>-->
      </div>
    </form>

    <div class="point">
      <button @click="pointOut" type="submit"><img src="../assets/img/aufzeigen.png" ref="pointPic"></button>
    </div>
  </div>
</template>

<style lang="scss">
.point {
  margin-top: 1rem;
}
.chat {
  input {
    display: block;
    width: 100%;
    padding: 0.25rem;
  }
}
</style>

<script>
import { sendChatMessage } from '../state'
import { setPeerName } from '../state'

export default {
  name: 'app-chat',
  data() {
    return {
      pointsOut : false,
      username: ""
    }
  },
  methods: {
    setUsername() {
      setPeerName(this.name);
      console.log(this.state);
    },
    getPeerNameBySenderId(senderId) {
      for (let i = 0; i < this.state.status.length; i++) {
        if (this.state.status[i].remote === senderId)
          return this.state.status[i].peer.name;
          break;
      }
    },
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
      this.message = this.message //wtf, warning prevention...

      let pic = this.$refs.pointPic


      if (!this.pointsOut) {
        pic.style.backgroundColor = 'orange'
        sendChatMessage('*Zeigt auf!*')
        this.pointsOut = true
      } else {
        pic.style.backgroundColor = ''
        sendChatMessage('*Zeigt nicht mehr auf!*')
        this.pointsOut = false
      }
    },
  },
  async mounted() {

  },
}
</script>

