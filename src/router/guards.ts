import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function registerGuards(router: Router): void {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)

    if (requiresAuth && !auth.isAuthenticated) {
      return { name: 'login' }
    }

    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'home' }
    }
  })
}
