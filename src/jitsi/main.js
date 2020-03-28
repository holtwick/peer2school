import Vue from 'vue'
import App from './jitsi-main.vue'
import { state } from './state'

Vue.config.productionTip = false

require('debug').enable('app:*')

Vue.mixin({
  data() {
    return { state }
  },
})

new Vue({
  render: h => h(App),
}).$mount('#app')
