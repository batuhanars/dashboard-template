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
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(i18n)

registerGuards(router)

const authStore = useAuthStore()

registerAuthFailureCallback(() => {
  authStore.logout()
  router.push('/login')
})

await authStore.fetchCurrentUser()

app.mount('#app')
