<template>
  <div class="hstack">
    <canvas class="-fit" id="whiteboard" resize></canvas>
    <div class="anchor">
      <mainPanel></mainPanel>
      <historyPanel></historyPanel>
    </div>
  </div>
</template>

<script>
import paper from 'paper'

import 'vue-slider-component/theme/default.css'
import { sync } from '../../../state'
import { createLayer } from '../tools/shared'
import HistoryPanel from './panel/HistoryPanel'
import MainPanel from './panel/MainPanel'

const log = require('debug')('app:WhiteBoard')

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

    sync.whiteboard.observe(event => {
      let actions = sync.whiteboard.toJSON()

      paper.project.clear()
      for (let action of Array.from(actions)) {
        log('action', action)
        // if (!paper.project.layers[action.layer]) {
        createLayer(action.layer).addChildren(action)
        // }
        // (new DrawAction(action)).exec()
      }

    })

  },
  watch: {
    'state.whiteboard': {
      handler: function (value) {
        // log('wh', value)

      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
.anchor {
  position: relative;
  width: 0;
}

canvas {
  /*height: 100vh;*/
  /*width: 100%;*/
  /*background: red;*/
}
</style>
