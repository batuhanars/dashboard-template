import type { AuthTokens, LoginRequest, Session, User } from '@/types/api'
import { delay } from './delay'
import { demoUser } from './data/users'

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'demo123'

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
