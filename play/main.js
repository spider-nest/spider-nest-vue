import { createApp } from 'vue'
import Play from './play.vue'

import '@spider-nest-vue/theme-chalk/src/index.less'

const app = createApp(Play)

app.mount('#play')
