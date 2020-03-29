<template>
  <div class="chat -scrollable">
    <form @submit.prevent.stop="doSend">
      <div v-for="msg in messages" class="item">
        <div class="name">
          {{msg.name}}
        </div>
        <div class="message">
          {{msg.msg}}
        </div>
      </div>
      <div ref="chat">
        <input :placeholder="l.send_message" v-model="message">
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.chat {

  .item {
    margin-bottom: 0.5rem;
  }

  .name {
    font-size: 0.8rem;
    font-weight: bold;
  }

  input {
    display: block;
    width: 100%;
    padding: 0.25rem;
    background: white;
    border-radius: 0.25rem;
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
  computed: {
    messages() {
      return this.state.chat.map(({ sender, msg }) => {
        return {
          sender,
          name: this.state.profiles[sender]?.name || 'Unnamed',
          msg,
        }
      })
    },
  },
  methods: {
    async doSend() {
      addChatMessage(this.message)
      this.message = ''
      await this.$nextTick()
      this.$refs.chat.scrollIntoView(false)
    },
  },
  async mounted() {
  },
}
</script>

