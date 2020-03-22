<template>
  <div
    class="student"
    v-for="student of students"
    :key="student.id"
    :class="{ '-active': student.active }"
  >
    {{ student.name }}
  </div>
</template>

<style lang="scss">
.student {
  font-size: 0.8rem;

  &:before {
    content: '-'
  }

  &.-active:before {
    content: '+'
  }
}
</style>

<script>
export default {
  name: 'app-students',
  data() {
    return {}
  },
  computed: {
    students() {
      return this.state.peers.map(id => {
        return {
          id,
          name: this.state.profiles[id]?.name || 'Unnamed',
          active: this.state.signals[id] === true,
        }
      })
    },
  },
  methods: {},
  async mounted() {
  },
}
</script>

