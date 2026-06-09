import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './lib/i18n'
import { queryClient } from './lib/query-client'
import { registerAuthFailureCallback } from './lib/api'
import { registerGuards } from './router/guards'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Router kurulmadan önce oturumu yükle.
// app.use(router) çağrısı initial navigation'ı başlatır ve beforeEach guard'ları hemen çalışır.
// fetchCurrentUser burada tamamlanmazsa guard user=null görür ve login'e yönlendirir.
const authStore = useAuthStore()
await authStore.fetchCurrentUser()

app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(i18n)

registerGuards(router)

registerAuthFailureCallback(() => {
  authStore.logout()
  router.push('/login')
})

app.mount('#app')
