import type { User, LoginRequest } from '@/types/api'
import { api } from '@/lib/api'
import { authStorage } from '@/lib/auth-storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function login(payload: LoginRequest): Promise<void> {
    const session = await api.auth.login(payload)
    authStorage.setTokens(session.tokens)
    user.value = session.user
  }

  async function logout(): Promise<void> {
    // Yerel state hemen temizlenir — API çağrısı ikincil
    authStorage.clear()
    user.value = null
    try {
      await api.auth.logout()
    } catch {
      // no-op: yerel state zaten temizlendi
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!authStorage.getAccessToken()) return
    try {
      user.value = await api.auth.me()
    } catch {
      authStorage.clear()
      user.value = null
    }
  }

  return { user, isAuthenticated, login, logout, fetchCurrentUser }
})
