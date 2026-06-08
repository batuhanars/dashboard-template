import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './lib/i18n'
import { queryClient } from './lib/query-client'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(i18n)

app.mount('#app')
