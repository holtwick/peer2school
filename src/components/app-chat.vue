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
      <div id="picBackground">
      <button type ="submit"><img src="./img/aufzeigen.png" id="pointPic" style=""></button>
      </div>
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
      sendChatMessage("*Zeigt auf!*")
      this.message = ''

      var pic = document.getElementById("pointPic");
      var picBackground = document.getElementById("pointPic");

      if(picBackground.style.backgroundColor != "grey")
        picBackground.style.backgroundColor = "grey";
      else
        picBackground.style.backgroundColor = "";
    },
  },
  async mounted() {

  },
}
</script>

