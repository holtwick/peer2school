export default {
  install(Vue, { lang, locales = { en: {} } } = {}) {
    lang = lang || navigator?.language?.slice(0, 2)
    if (locales[lang] == null) {
      lang = "en"
    }

    Vue.mixin({
      data() {
        return {
          l: locales[lang],
        }
      },
    })
  },
}
