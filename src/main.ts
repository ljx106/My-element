import App from './App.vue'

import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)
import './styles/index.css'

createApp(App)
.mount('#app')