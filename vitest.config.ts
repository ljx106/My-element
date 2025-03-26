// node环境下没有dom，所以需要另外配置vitest环境，设置test配置中的enviroment属性为jsdom
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueMacros.vite({
      plugins:{
        vue:vue(),
        vueJsx:vueJsx(),
      }
    }),
  ],
  test:{
    globals: true,
    environment: 'jsdom'
  }
})

