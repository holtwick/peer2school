<template>
  <div class="chat">
    <form @submit.prevent.stop="doSend">
      <div v-for="msg in state.chat">
        <!-- {{ msg.sender }}: -->
        {{msg.msg}}
      </div>
      <div>
        <input placeholder="Send message" v-model="message">
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.chat {
  input {
    display: block;
    width: 100%;
    padding: 0.25rem;
  }
}
</style>

<script>
import { addChatMessage } from '../state'

export default {
  name: 'app-chat',
  data() {
    return {
      message: '',
    }
  },
  methods: {
    doSend() {
      addChatMessage(this.message)
      this.message = ''
    },
  },
  async mounted() {
  },
}
</script>

