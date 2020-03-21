import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faEraser, faExclamationTriangle, faFont, faPaintBrush, faPencilAlt, faRedo, faSlash, faSquare, faUndo, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

library.add({ faPencilAlt, faUndo, faRedo, faEraser, faCircle, faFont, faUpload, faPaintBrush, faSquare, faExclamationTriangle, faSlash })

Vue.component('font-awesome-icon', FontAwesomeIcon)
