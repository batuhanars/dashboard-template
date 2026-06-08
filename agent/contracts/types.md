# Contract: Domain Tipleri (Zod-first)

**Bağlayıcı.** Tüm tip adları ve alan adları burada sabittir. Mock data, API katmanı, store'lar, component'lar bu tiplere uyar.

## Prensip

Zod schema **tek doğruluk kaynağıdır**. TypeScript tipleri `z.infer` ile türetilir. Schema'lar `src/types/api.ts` içinde tanımlanır; hem form validation'da hem (ileride) API response validation'da kullanılabilir.

```ts
import { z } from 'zod'

export const userSchema = z.object({ /* ... */ })
export type User = z.infer<typeof userSchema>
```

## Enum'lar

```ts
export const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])
export type UserRole = z.infer<typeof userRoleSchema>

export const userStatusSchema = z.enum(['active', 'inactive', 'pending'])
export type UserStatus = z.infer<typeof userStatusSchema>
```

## User

```ts
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  status: userStatusSchema,
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string(),       // ISO 8601
  lastActiveAt: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>
```

## Transaction (Dashboard "son işlemler" + örnek e-ticaret domaini)

```ts
export const transactionStatusSchema = z.enum(['completed', 'pending', 'failed'])

export const transactionSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  amount: z.number(),          // kuruş değil, ana birim (formatlamada Intl ile)
  currency: z.string(),        // 'USD' | 'EUR' | 'TRY' (string olarak tut)
  status: transactionStatusSchema,
  createdAt: z.string(),
})
export type Transaction = z.infer<typeof transactionSchema>
```

## Activity log entry (UserDetail → Activity tab)

```ts
export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['login', 'update', 'create', 'delete', 'comment']),
  description: z.string(),
  createdAt: z.string(),
})
export type Activity = z.infer<typeof activitySchema>
```

## Dashboard KPI metrikleri

```ts
export const kpiMetricSchema = z.object({
  key: z.enum(['revenue', 'users', 'orders', 'conversion']),
  value: z.number(),
  // önceki döneme göre yüzde değişim; pozitif/negatif trend rozeti için
  deltaPct: z.number(),
})
export type KpiMetric = z.infer<typeof kpiMetricSchema>

// Line chart: son 30 gün
export const timeSeriesPointSchema = z.object({
  date: z.string(),            // ISO date (gün)
  value: z.number(),
})
export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>

export const dashboardSummarySchema = z.object({
  metrics: z.array(kpiMetricSchema),
  revenueSeries: z.array(timeSeriesPointSchema),
  recentTransactions: z.array(transactionSchema),
})
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
```

## Auth tipleri

```ts
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

// Login response: token + kullanıcı
export const sessionSchema = z.object({
  tokens: authTokensSchema,
  user: userSchema,
})
export type Session = z.infer<typeof sessionSchema>
```

## Pagination / liste cevabı

Liste endpoint'leri her zaman bu zarf ile döner (mock dahil):

```ts
export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  })
}
export type Paginated<T> = { data: T[]; total: number; page: number; pageSize: number }
```

## Liste sorgu parametreleri (UsersList için)

```ts
export interface UserListParams {
  page: number
  pageSize: number
  search?: string
  role?: UserRole
  status?: UserStatus
  sortBy?: keyof User
  sortDir?: 'asc' | 'desc'
}
```

## Serbestlik

- `[Serbest]` Yukarıdaki tiplere yeni **opsiyonel** alan eklenebilir (örn. User'a `phone?`). Mevcut alanları **silme/yeniden adlandırma**.
- `[Serbest]` Mock data hacmi (kaç user, kaç transaction) Sonnet'in takdirinde — ama "vitrin" hissi için UsersList ≥ 40 satır, dashboard serisi tam 30 gün olsun.
