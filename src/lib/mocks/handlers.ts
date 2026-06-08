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
import { delay } from './delay'
import { demoUser, seedUsers } from './data/users'
import { dashboardSummaryData } from './data/dashboard'
import { activityPool } from './data/activities'

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'demo123'

// ── Auth ────────────────────────────────────────────────────────────────────

export async function authLogin(payload: LoginRequest): Promise<Session> {
  await delay()
  if (payload.email !== DEMO_EMAIL || payload.password !== DEMO_PASSWORD) {
    throw new Error('Geçersiz e-posta veya şifre')
  }
  const tokens: AuthTokens = {
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  }
  return { tokens, user: demoUser }
}

export async function authLogout(): Promise<void> {
  await delay(200)
}

export async function authMe(): Promise<User> {
  await delay()
  return demoUser
}

export async function authRefresh(refreshToken: string): Promise<AuthTokens> {
  await delay()
  if (!refreshToken.startsWith('mock-refresh-')) {
    throw new Error('Geçersiz yenileme tokeni')
  }
  return {
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  }
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export async function mockDashboardSummary(): Promise<DashboardSummary> {
  await delay()
  return dashboardSummaryData
}

// ── Users — mutable in-memory state ─────────────────────────────────────────

let usersDb: User[] = [demoUser, ...seedUsers]

export async function mockUsersList(params: UserListParams): Promise<Paginated<User>> {
  await delay()

  let result = [...usersDb]

  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }

  if (params.role) result = result.filter((u) => u.role === params.role)
  if (params.status) result = result.filter((u) => u.status === params.status)

  if (params.sortBy) {
    const dir = params.sortDir === 'desc' ? -1 : 1
    const key = params.sortBy
    result.sort((a, b) => {
      const av = a[key] ?? ''
      const bv = b[key] ?? ''
      if (av < bv) return -dir
      if (av > bv) return dir
      return 0
    })
  }

  const total = result.length
  const start = (params.page - 1) * params.pageSize
  const data = result.slice(start, start + params.pageSize)

  return { data, total, page: params.page, pageSize: params.pageSize }
}

export async function mockUsersDetail(id: string): Promise<User> {
  await delay()
  const user = usersDb.find((u) => u.id === id)
  if (!user) throw new Error(`Kullanıcı bulunamadı: ${id}`)
  return { ...user }
}

export async function mockUsersActivities(_id: string): Promise<Activity[]> {
  await delay()
  return activityPool
}

export async function mockUsersUpdate(id: string, patch: Partial<User>): Promise<User> {
  await delay()
  const idx = usersDb.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error(`Kullanıcı bulunamadı: ${id}`)
  usersDb[idx] = { ...usersDb[idx], ...patch }
  return { ...usersDb[idx] }
}

export async function mockUsersRemove(id: string): Promise<void> {
  await delay(300)
  usersDb = usersDb.filter((u) => u.id !== id)
}

export async function mockUsersBulkRemove(ids: string[]): Promise<void> {
  await delay(400)
  usersDb = usersDb.filter((u) => !ids.includes(u.id))
}

export async function mockUsersBulkDeactivate(ids: string[]): Promise<void> {
  await delay(400)
  usersDb = usersDb.map((u) => (ids.includes(u.id) ? { ...u, status: 'inactive' } : u))
}
