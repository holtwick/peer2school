import Vue from 'vue'
import App from './app.vue'
import locale from './lib/locale'
import de from './locales/de'
import en from './locales/en'
import it from './locales/it'
import { state } from './state'

Vue.config.productionTip = false

require('debug').enable('app:*,mq*')

Vue.mixin({
  data() {
    return { state }
  },
})

Vue.use(locale, {
  locales: { en, de, it },
})

new Vue({
  render: h => h(App),
}).$mount('#app')
