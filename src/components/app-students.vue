<template>
  <div class="students">
    <div
      class="student"
      v-for="student of students"
      :key="student.id"
      :class="{ '-active': student.active }"
    >
      {{ student.name }}
    </div>
  </div>
</template>

<style lang="scss">
.students {
  margin-bottom: 1rem;

  .student {
    font-size: 0.8rem;

    &:before {
      content: '-'
    }

    &.-active:before {
      content: '+'
    }
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

