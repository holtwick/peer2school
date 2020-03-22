import Vue from 'vue'
import App from './app.vue'
import './lib/registerServiceWorker'
import { state } from './state'
import './css/tailwind.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShareSquare, faHandPointUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faShareSquare, faHandPointUp)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
