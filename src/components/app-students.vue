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
      display: inline-block;
      content: ' ';
      height: 0.5rem;
      width: 0.5rem;
      background: gray;
      border-radius: 1rem;
      margin-right: 0.25rem;
    }

    &.-active:before {
      background: #32b643;
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

