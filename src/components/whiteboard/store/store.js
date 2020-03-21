import Vue from 'vue'
import Vuex from 'vuex'
import whiteboardModule from './modules/whiteboard'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    whiteboardModule,
  },
})
