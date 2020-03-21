<template>
  <div :class="{ active : isActive }" class="tool">
    <font-awesome-icon :color="toolColor" :icon="icon"/>
  </div>
</template>

<script>
export default {
  props: ['icon', 'toolColor', 'isActive'],
}
</script>

<style lang="scss">
.tool {
  padding: 10px;
  cursor: pointer;

  &:not(.active):hover {
    background: #e6e9f0;
    border-radius: 5px;
  }
}

.active {
  background: #e6e9f0;
  border-radius: 5px;
}
</style>
