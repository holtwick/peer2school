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
    <form>
      <button @click="pointOut" type ="submit"><img src="./img/aufzeigen.png" ref="pointPic" style=""></button>
    </form>
  </div>
</template>

<style lang="scss"></style>

<script>
import { sendChatMessage, sendPointOutInfo } from '../state'

export default {
  name: 'app-chat',
  data() {
    return {pointsOutState : false}
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
      let pic = this.$refs.pointPic


      if(!this.pointsOutState)
      {
        pic.style.backgroundColor = "orange"
        this.pointsOutState = true
      }
      else
      {
        pic.style.backgroundColor = ""
        this.pointsOutState = false
      }

      sendPointOutInfo(this.pointsOutState)
    },
  },
  async mounted() {

  },
}
</script>

