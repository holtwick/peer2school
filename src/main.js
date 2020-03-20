import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'

Vue.config.productionTip = false

// require('debug').enable('*,-sock*,-engine*')
require('debug').enable('app:*')

Vue.mixin({
  data() {
    return {
      state: {
        room: '',
        peers: {}
      }
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
