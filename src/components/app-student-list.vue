<template>
  <div class="studentList" style="float: right">
    <h3>Student List</h3>
    <div v-for="student in this.pointingUp">{{ student }}</div>
  </div>
</template>

<style lang="scss"></style>

<script>
import { sendChatMessage } from "../state";

export default {
  name: "app-student-list",
  data() {
    return {
      pointingUp: []
    };
  },
  methods: {
    doSend() {
      sendChatMessage(this.message);
      this.message = "";
    },
    pointOut() {}
  },
  watch: {
    "state.chat": function(val) {
      const msg = val[val.length - 1];
      console.log("DEBUG DEBUG DEBUG: " + msg);
      if (msg.msg == "*Zeigt auf!*") this.pointingUp.push(msg.sender);
      else if (msg.msg == "*Zeigt nicht mehr auf!*") {
        this.pointingUp = this.pointingUp.filter(
          student => student == msg.sender
        );
      }
    }
  },
  async mounted() {}
};
</script>

