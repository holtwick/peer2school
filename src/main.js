import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'
import { state } from './state'

Vue.config.productionTip = false

require('debug').enable('app:*,mq*')

Vue.mixin({
  data() {
    return { state }
  },
})

new Vue({
  render: h => h(App),
}).$mount('#app')
