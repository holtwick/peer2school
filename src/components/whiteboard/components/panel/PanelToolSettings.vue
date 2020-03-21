<template>
  <div class="toolSettings">
    <slot name="settingsActions"/>
    <slot name="slider"/>
    <slot name="settingsColorPicker"/>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.toolSettings {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: #fff;
  padding: 10px 5px;
  border-radius: 5px;
  right: 65px;
  top: 0;
  box-shadow: 0px 10px 30px 8px rgba(0, 0, 0, 0.2);

  .settingsActions {
    display: flex;

    .tool:not(:last-child) {
      margin-right: 5px;
    }
  }

  .settingsSlider {
    margin-top: 10px;
    padding: 5px !important;
  }

  .settingsColorPicker {
    margin-top: 10px;
  }
}
</style>
