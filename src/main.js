require('debug').enable('*')

import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'
import './lib/signal'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
