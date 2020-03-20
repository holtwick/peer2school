require('debug').enable('*,-sock*,-engine*')

import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
