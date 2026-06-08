import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { AuthTokens, LoginRequest, Session, User } from '@/types/api'
import { authStorage } from '@/lib/auth-storage'
import * as mockHandlers from '@/lib/mocks/handlers'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

let authFailureCallback: (() => void) | null = null

export function registerAuthFailureCallback(cb: () => void): void {
  authFailureCallback = cb
}

// Request interceptor — Bearer token eklenir
http.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Single-flight refresh — birden fazla eşzamanlı 401 tek refresh tetikler
let refreshPromise: Promise<void> | null = null

function doRefresh(): Promise<void> {
  const refreshToken = authStorage.getRefreshToken()
  if (!refreshToken) return Promise.reject(new Error('refresh token yok'))
  return http
    .post<AuthTokens>('/auth/refresh', { refreshToken })
    .then((res) => authStorage.setTokens(res.data))
}

// Response interceptor — 401'de refresh dene, başarısızsa onAuthFailure
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as AxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true
      if (!authStorage.getRefreshToken()) {
        authStorage.clear()
        authFailureCallback?.()
        return Promise.reject(error)
      }
      if (!refreshPromise) {
        refreshPromise = doRefresh()
          .catch(() => {
            authStorage.clear()
            authFailureCallback?.()
          })
          .finally(() => {
            refreshPromise = null
          })
      }
      return refreshPromise.then(() => http(config))
    }
    return Promise.reject(error)
  },
)

export const api = {
  auth: {
    login: (payload: LoginRequest): Promise<Session> =>
      USE_MOCKS
        ? mockHandlers.authLogin(payload)
        : http.post<Session>('/auth/login', payload).then((r) => r.data),

    logout: (): Promise<void> =>
      USE_MOCKS
        ? mockHandlers.authLogout()
        : http.post('/auth/logout').then(() => undefined),

    me: (): Promise<User> =>
      USE_MOCKS
        ? mockHandlers.authMe()
        : http.get<User>('/auth/me').then((r) => r.data),

    refresh: (refreshToken: string): Promise<AuthTokens> =>
      USE_MOCKS
        ? mockHandlers.authRefresh(refreshToken)
        : http.post<AuthTokens>('/auth/refresh', { refreshToken }).then((r) => r.data),
  },
}
