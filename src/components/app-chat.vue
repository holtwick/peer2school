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
    return {}
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
<<<<<<< HEAD
      this.message = this.message //wtf, warning prevention...

      var pic = document.getElementById("pointPic")


      if(pic.style.backgroundColor != "orange")
      {
        pic.style.backgroundColor = "orange"
=======

      var pic = document.getElementById("pointPic")
      var picBackground = document.getElementById("pointPic")

      if(picBackground.style.backgroundColor != "orange")
      {
        picBackground.style.backgroundColor = "orange"
        pic.src="./img/nicht_aufzeigen.png"
>>>>>>> develop
        sendChatMessage("*Zeigt auf!*")
      }
      else
      {
<<<<<<< HEAD
        pic.style.backgroundColor = ""
=======
        picBackground.style.backgroundColor = ""
        pic.src="./img/aufzeigen.png"
>>>>>>> develop
        sendChatMessage("*Zeigt nicht mehr auf!*")
      }
    },
  },
  async mounted() {

  },
}
</script>

