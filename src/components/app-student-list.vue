<template>
  <div class="studentList" style="float: right">
    <h3>Student List</h3>
        <div v-for="msg in state.chat">
            {{msg.sender}}: <b>{{msg.msg}}</b>
        </div>
  </div>
</template>

<style lang="scss"></style>

<script>
import { sendChatMessage } from '../state'

watch("state.chat", (newVal, oldVal) => {
    console.log("DEBUG DEBUG DEBUG: " + newVal)
})

export default {
  name: 'app-student-list',
  data() {
    return {pointsOut : false}
  },
  methods: {
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
    },
  },
  async mounted() {
  },
}
</script>

