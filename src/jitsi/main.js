import Vue from 'vue'
import App from './jitsi-main.vue'

Vue.config.productionTip = false

require('debug').enable('app:*')

new Vue({
  render: h => h(App),
}).$mount('#app')
