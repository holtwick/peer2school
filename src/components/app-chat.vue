<template>
  <div class="text">
    <h3>Chat</h3>
    <form @submit.prevent.stop="doSend">
      <div v-for="msg in state.chat">
        {{msg.sender}}: <b>{{msg.msg}}</b>
      </div>
      <div>
        <input placeholder="Send message" v-model="message">
        <!--        <button type="submit">Send message</button>-->
      </div>
    </form>
    <form @submit.prevent.stop="pointOut">
      <button type ="submit"><img src="./img/aufzeigen.png" id="pointPic" style=""></button>
    </form>
  </div>
</template>

<style lang="scss"></style>

<script>
import { sendChatMessage } from '../state'

export default {
  name: 'app-chat',
  data() {
    return {pointsOut : false}
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
      this.message = this.message //wtf, warning prevention...

      var pic = document.getElementById("pointPic")


      if(!this.pointsOut)
      {
        pic.style.backgroundColor = "orange"
        sendChatMessage("*Zeigt auf!*")
        this.pointsOut = true
      }
      else
      {
        pic.style.backgroundColor = ""
        sendChatMessage("*Zeigt nicht mehr auf!*")
        this.pointsOut = false
      }
    },
  },
  async mounted() {

  },
}
</script>

