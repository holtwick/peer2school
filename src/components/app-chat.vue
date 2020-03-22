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
import { sendChatMessage, sendPointOutInfo } from '../state'

export default {
  name: 'app-chat',
  data() {
    return {
      pointsOut: false,
      message: '',
    }
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
        pic.style.backgroundColor = 'orange'
        this.pointsOutState = true
      }
      else
      {
        pic.style.backgroundColor = ''
        this.pointsOutState = false
      }

      sendPointOutInfo(this.pointsOutState)
    },
  },
  async mounted() {

  },
}
</script>

