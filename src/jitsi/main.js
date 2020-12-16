import Vue from "vue"
import locale from "../lib/locale"
import de from "../locales/de"
import en from "../locales/en"
import it from "../locales/it"
import fr from "../locales/fr"
import App from "./jitsi-main.vue"
import { state } from "./state"

Vue.config.productionTip = false

Vue.mixin({
  data() {
    return { state }
  },
})

Vue.use(locale, {
  locales: { en, de, it, fr },
})

new Vue({
  render: (h) => h(App),
}).$mount("#app")
