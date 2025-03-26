import DefaultTheme from 'vitepress/theme'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '../../../src/styles/index.css'

import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css' 
import './custom.css'

library.add(fas)

export default {
    ...DefaultTheme,
    enhanceApp({ app }) { // 对原样式扩展
      app.component('demo-preview', ElementPlusContainer)
    }
  }