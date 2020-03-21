<template>
  <div class="chat">
    <form @submit.prevent.stop="doSend">
      <div v-for="msg in state.chat">
        {{msg.sender}}: <b>{{msg.msg}}</b>
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

export default {
  name: 'app-chat',
  data() {
    return { pointsOut: false }
  },
  methods: {
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

