<template>
  <div class="mainPanel">
    <!-- Actions panel -->
    <div class="actionsPanel">
      <!-- Tool select -->
      <panelToolIcon
        @click.native="toggleToolSettings"
        :toolColor="toolColor"
        :isActive="tool === 'pencil' || tool === 'brush'"
        :icon="activeTool"
      />
      <!-- Eraser select -->
      <panelToolIcon
        @click.native="toggleEraserSettings(); setWhiteboardTool('eraser')"
        toolColor="#133337"
        :isActive="tool === 'eraser'"
        icon="eraser"
      />
      <!-- Shape select -->
      <panelToolIcon
        @click.native="toggleShapeSettings"
        :toolColor="shapeColor"
        :isActive="tool === 'circle' || tool === 'square' || tool === 'triangle' || tool === 'line'"
        :icon="activeShape"
      />
    </div>

    <!-- Action settings settings -->
    <div class="actionSettingsPanel">
      <!-- Tool settings -->
      <panelToolSettings v-if="isToolSettingsOpened">
        <!-- SettingsActions -->
        <div class="settingsActions" slot="settingsActions">
          <!-- Pencil select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('pencil')"
            :toolColor="toolColor"
            :isActive="tool === 'pencil'"
            icon="pencil-alt"
          />
          <!-- Brush select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('brush')"
            :toolColor="toolColor"
            :isActive="tool === 'brush'"
            icon="paint-brush"
          />
        </div>
        <!-- ColorPicker -->
        <colorPicker
          :onSelectColor="setToolColor"
          class="settingsColorPicker"
          slot="settingsColorPicker"
          :colors="colors"
        />
        <!-- Slider -->
        <rangeSlider
          :onChange="setToolSize"
          :min="0"
          :max="6"
          :value="toolSize"
          class="settingsSlider"
          slot="slider"
        />
      </panelToolSettings>
      <!-- Eraser settings -->
      <panelToolSettings v-if="isEraserSettingsOpened">
        <!-- Slider -->
        <rangeSlider
          :onChange="setEraserSize"
          :min="0"
          :max="24"
          :value="eraserSize"
          class="settingsSlider"
          slot="slider"
        />
      </panelToolSettings>
      <!-- Shape settings -->
      <panelToolSettings v-if="isShapeSettingsOpened">
        <!-- SettingsActions -->
        <div class="settingsActions" slot="settingsActions">
          <!-- Circle select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('circle')"
            :toolColor="shapeColor"
            :isActive="tool === 'circle'"
            icon="circle"
          />
          <!-- Square select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('square')"
            :toolColor="shapeColor"
            :isActive="tool === 'square'"
            icon="square"
          />
          <!-- Triangle select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('triangle')"
            :toolColor="shapeColor"
            :isActive="tool === 'triangle'"
            icon="exclamation-triangle"
          />
          <!-- Line select -->
          <panelToolIcon
            @click.native="setWhiteboardTool('line')"
            :toolColor="shapeColor"
            :isActive="tool === 'line'"
            icon="slash"
          />
        </div>
        <!-- ColorPicker -->
        <colorPicker
          :onSelectColor="setShapeColor"
          class="settingsColorPicker"
          slot="settingsColorPicker"
          :colors="colors"
        />
        <!-- Slider -->
        <rangeSlider
          :onChange="setShapeSize"
          :min="0"
          :max="6"
          :value="shapeSize"
          class="settingsSlider"
          slot="slider"
        />
      </panelToolSettings>
    </div>
  </div>
</template>

<script>
import colorPalette from '../../config/colorPalette.js'
import { store } from '../../tools/paperStore'
import tools from '../../tools/tool/tools'
import ColorPicker from '../ColorPicker'
import RangeSlider from '../RangeSlider'
import PanelToolIcon from './PanelToolIcon'
import PanelToolSettings from './PanelToolSettings'

export default {
  components: {
    panelToolIcon: PanelToolIcon,
    panelToolSettings: PanelToolSettings,
    rangeSlider: RangeSlider,
    colorPicker: ColorPicker,
  },
  data() {
    return {
      isToolSettingsOpened: false,
      isEraserSettingsOpened: false,
      isShapeSettingsOpened: false,
      colors: colorPalette,
      store,
    }
  },
  methods: {
    // Toggle
    toggleToolSettings() {
      this.isToolSettingsOpened = !this.isToolSettingsOpened
      this.isEraserSettingsOpened = false
      this.isShapeSettingsOpened = false
    },
    toggleEraserSettings() {
      this.isEraserSettingsOpened = !this.isEraserSettingsOpened
      this.isToolSettingsOpened = false
      this.isShapeSettingsOpened = false
    },
    toggleShapeSettings() {
      this.isShapeSettingsOpened = !this.isShapeSettingsOpened
      this.isEraserSettingsOpened = false
      this.isToolSettingsOpened = false
    },
    // Set Color
    setToolColor(color) {
      this.store.toolArgs.color = color
    },
    setShapeColor(color) {
      this.store.shapeArgs.color = color
    },
    // Set size
    setToolSize(size) {
      this.store.toolArgs.size = size
    },
    setEraserSize(size) {
      this.store.eraserArgs.size = size
    },
    setShapeSize(size) {
      this.store.shapeArgs.size = size
    },
    // Set tool
    setWhiteboardTool(tool) {
      this.store.tool = tool
      if (tools[tool]) {
        tools[tool].activate()
      }
    },
  },
  computed: {
    // Active
    activeTool: function () {
      if (this.tool === 'pencil') {
        return 'pencil-alt'
      } else if (this.tool === 'brush') {
        return 'paint-brush'
      } else {
        return 'pencil-alt'
      }
    },
    activeShape: function () {
      if (this.tool === 'cricle') {
        return 'circle'
      } else if (this.tool === 'square') {
        return 'square'
      } else if (this.tool === 'triangle') {
        return 'exclamation-triangle'
      } else if (this.tool === 'line') {
        return 'slash'
      } else {
        return 'circle'
      }
    },
    // tool: function () {
    //   return this.$store.getters.tool
    // },
    // Color
    toolColor: function () {
      return this.store.toolArgs.color
    },
    shapeColor: function () {
      return this.store.shapeArgs.color
    },
    // Size
    toolSize: function () {
      return this.store.toolArgs.size
    },
    eraserSize: function () {
      return this.store.eraserArgs.size
    },
    shapeSize: function () {
      return this.store.shapeArgs.size
    },
  },
  mounted() {
    this.setWhiteboardTool('pencil')
  },
}
</script>


<style lang="scss">
.mainPanel {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 1rem;
  right: 1rem;
  padding: 10px;
  background: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 10px 30px 8px rgba(0, 0, 0, 0.4);

  .actionsPanel {
    .tool:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
