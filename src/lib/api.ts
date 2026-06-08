import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type {
  Activity,
  AuthTokens,
  DashboardSummary,
  LoginRequest,
  Paginated,
  Session,
  User,
  UserListParams,
} from '@/types/api'
import { authStorage } from '@/lib/auth-storage'
import * as mock from '@/lib/mocks/handlers'

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

// ── Real API skeletons ───────────────────────────────────────────────────────

const realAuth = {
  login: (payload: LoginRequest) => http.post<Session>('/auth/login', payload).then((r) => r.data),
  logout: () => http.post('/auth/logout').then(() => undefined as void),
  me: () => http.get<User>('/auth/me').then((r) => r.data),
  refresh: (refreshToken: string) =>
    http.post<AuthTokens>('/auth/refresh', { refreshToken }).then((r) => r.data),
}

const realDashboard = {
  summary: () => http.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
}

const realUsers = {
  list: (params: UserListParams) =>
    http.get<Paginated<User>>('/users', { params }).then((r) => r.data),
  detail: (id: string) => http.get<User>(`/users/${id}`).then((r) => r.data),
  activities: (id: string) => http.get<Activity[]>(`/users/${id}/activities`).then((r) => r.data),
  update: (id: string, patch: Partial<User>) =>
    http.patch<User>(`/users/${id}`, patch).then((r) => r.data),
  remove: (id: string) => http.delete(`/users/${id}`).then(() => undefined as void),
  bulkRemove: (ids: string[]) =>
    http.post('/users/bulk-remove', { ids }).then(() => undefined as void),
  bulkDeactivate: (ids: string[]) =>
    http.post('/users/bulk-deactivate', { ids }).then(() => undefined as void),
}

// ── Public API — mock veya gerçek imzaya transparan ─────────────────────────

export const api = {
  auth: USE_MOCKS
    ? {
        login: mock.authLogin,
        logout: mock.authLogout,
        me: mock.authMe,
        refresh: mock.authRefresh,
      }
    : realAuth,

  dashboard: USE_MOCKS ? { summary: mock.mockDashboardSummary } : realDashboard,

  users: USE_MOCKS
    ? {
        list: mock.mockUsersList,
        detail: mock.mockUsersDetail,
        activities: mock.mockUsersActivities,
        update: mock.mockUsersUpdate,
        remove: mock.mockUsersRemove,
        bulkRemove: mock.mockUsersBulkRemove,
        bulkDeactivate: mock.mockUsersBulkDeactivate,
      }
    : realUsers,
}
