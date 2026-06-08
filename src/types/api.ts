import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])
export type UserRole = z.infer<typeof userRoleSchema>

export const userStatusSchema = z.enum(['active', 'inactive', 'pending'])
export type UserStatus = z.infer<typeof userStatusSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  status: userStatusSchema,
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string(),
  lastActiveAt: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type AuthTokens = z.infer<typeof authTokensSchema>

export const sessionSchema = z.object({
  tokens: authTokensSchema,
  user: userSchema,
})
export type Session = z.infer<typeof sessionSchema>

export const transactionStatusSchema = z.enum(['completed', 'pending', 'failed'])

export const transactionSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: transactionStatusSchema,
  createdAt: z.string(),
})
export type Transaction = z.infer<typeof transactionSchema>

export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['login', 'update', 'create', 'delete', 'comment']),
  description: z.string(),
  createdAt: z.string(),
})
export type Activity = z.infer<typeof activitySchema>

export const kpiMetricSchema = z.object({
  key: z.enum(['revenue', 'users', 'orders', 'conversion']),
  value: z.number(),
  deltaPct: z.number(),
})
export type KpiMetric = z.infer<typeof kpiMetricSchema>

export const timeSeriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
})
export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>

export const dashboardSummarySchema = z.object({
  metrics: z.array(kpiMetricSchema),
  revenueSeries: z.array(timeSeriesPointSchema),
  recentTransactions: z.array(transactionSchema),
})
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>

export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  })
}
export type Paginated<T> = { data: T[]; total: number; page: number; pageSize: number }

export interface UserListParams {
  page: number
  pageSize: number
  search?: string
  role?: UserRole
  status?: UserStatus
  sortBy?: keyof User
  sortDir?: 'asc' | 'desc'
}
