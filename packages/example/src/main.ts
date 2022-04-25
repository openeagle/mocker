import { createApp } from 'vue'
import Van, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import router from './router'
import App from './App'
import './global.less'


createApp(App)
  .use(Van)
  .use(Lazyload, {
    lazyComponent: true,
  })
  .use(router)
  .mount('#app')
