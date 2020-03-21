<template>
  <div>
    <canvas id="whiteboard" resize></canvas>
    <mainPanel></mainPanel>
    <historyPanel></historyPanel>
  </div>
</template>

<script>
import paper from 'paper'
import HistoryPanel from './panel/HistoryPanel'
import MainPanel from './panel/MainPanel'

export default {
  components: {
    mainPanel: MainPanel,
    historyPanel: HistoryPanel,
  },
  created() {
    paper.install(window)
  },
  mounted() {
    paper.setup('whiteboard')
  },
}
</script>


<style lang="scss">
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

canvas {
  height: 100vh;
  width: 100%;
  background: #133337;
}
</style>
