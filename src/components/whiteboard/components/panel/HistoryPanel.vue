<template>
  <div class="historyPanel">
    <panelToolIcon @click.native="undo" icon="arrow_counterclockwise"/>
    <panelToolIcon @click.native="redo" icon="arrow_clockwise"/>
  </div>
</template>

<script>
import history from '../../tools/history.js'
import PanelToolIcon from './PanelToolIcon'

export default {
  components: {
    panelToolIcon: PanelToolIcon,
  },
  methods: {
    undo() {
      history.undo()
    },
    redo() {
      history.redo()
    },
  },
}
</script>


<style lang="scss">
.historyPanel {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 11rem;
  right: 1rem;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 10px 30px 8px rgba(0, 0, 0, 0.4);
}
</style>
