import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'
import { state } from './state'
import store from './components/whiteboard/store/store'

Vue.config.productionTip = false

require('debug').enable('app:*')

Vue.mixin({
  data() {
    return { state }
  },
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
