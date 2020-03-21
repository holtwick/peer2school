<template>
  <vue-slider
    :lazy="true"
    :min="min"
    :max="max"
    :dotSize="12"
    :height="3"
    :interval="2"
    :processStyle="{'background': 'black'}"
    :bgStyle="{'backgroundColor': '#e6e9f0'}"
    :sliderStyle="{'backgroundColor': 'black', 'boxShadow': 'unset'}"
    tooltip="none"
    :width="'168px'"
    v-model="sliderValue"
  ></vue-slider>
</template>

<script>
import VueSlider from 'vue-slider-component'

export default {
  components: {
    VueSlider,
  },
  data() {
    return {
      sliderValue: this.value,
    }
  },
  props: ['min', 'max', 'value', 'onChange'],
  watch: {
    sliderValue: function (size) {
      this.onChange(size)
    },
  },
}
</script>
