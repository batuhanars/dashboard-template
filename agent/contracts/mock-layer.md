# Contract: Mock Layer & API Katmanı

**Bağlayıcı.** Env değişken adları, `api` arayüzü ve switch davranışı sabittir. Template'in "backend bağımsız çalışır" vaadi buna dayanır.

## Env değişkenleri (`.env.example`)

```
VITE_USE_MOCKS=true
VITE_API_BASE_URL=
VITE_APP_NAME=Dashboard
```

- `VITE_USE_MOCKS` — `'true'` (default) ise mock katmanı, değilse gerçek API. Build-time okunur.
- `VITE_API_BASE_URL` — backend gelince doldurulur.
- `VITE_APP_NAME` — login ekranı / başlığa basılır.
- `VITE_` prefix'i zorunlu (PROJECT.md gotcha 6).

## `src/lib/api.ts` — tek giriş noktası

Tüm veri erişimi buradan geçer. vue-query `queryFn`'leri ve store'lar **doğrudan axios çağırmaz**, bu modülün fonksiyonlarını çağırır. Mock olup olmadığı çağırana **transparan**.

```ts
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// axios instance (interceptor'lar auth contract'ında eklenir)
export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

// Domain bazlı API yüzeyi — mock veya gerçek implementasyona delege eder.
export const api = {
  auth: {
    login(payload: LoginRequest): Promise<Session>,
    logout(): Promise<void>,
    me(): Promise<User>,
    refresh(refreshToken: string): Promise<AuthTokens>,
  },
  dashboard: {
    summary(): Promise<DashboardSummary>,
  },
  users: {
    list(params: UserListParams): Promise<Paginated<User>>,
    detail(id: string): Promise<User>,
    activities(id: string): Promise<Activity[]>,
    update(id: string, patch: Partial<User>): Promise<User>,
    remove(id: string): Promise<void>,
    bulkRemove(ids: string[]): Promise<void>,
    bulkDeactivate(ids: string[]): Promise<void>,
  },
}
```

**Switch deseni:** `api` objesi, `USE_MOCKS` true ise `lib/mocks/handlers`'tan, false ise gerçek `http` çağrılarından beslenir. İki implementasyon da **aynı imzayı** döndürür. Önerilen yapı: her domain için `realX` ve `mockX` implementasyonu, `api` bunlardan birini seçer.

## `src/lib/mocks/` yapısı

```
lib/mocks/
├── data/            # statik seed data (users.ts, transactions.ts, dashboard.ts, activities.ts)
├── handlers.ts      # api imzasını karşılayan mock fonksiyonlar (filtre/sort/paginate dahil)
└── delay.ts         # delay(ms) — Promise<void> setTimeout sarmalı
```

- **Delay simülasyonu:** Her mock çağrısı `await delay(300..600)` ile gerçek ağ hissi verir (`[Serbest]` aralık).
- **Filtre/sort/paginate mock'ta yapılır:** `users.list(params)` arama, rol/durum filtresi, sıralama ve sayfalamayı bellekte uygular ki UsersList gerçek gibi davransın.
- Mock data, types contract'ındaki Zod schema'larına **uymalı** (gerekirse `schema.parse(seed)` ile dev'de doğrula).

## Demo kimlik bilgileri (mock auth)

- E-posta: `demo@example.com`
- Şifre: `demo123`
- Eşleşirse `mock.auth.login` fake bir `Session` döner (sahte JWT string'leri). Eşleşmezse reject (`Invalid credentials`).
- Detaylı refresh/interceptor davranışı → auth contract.

## `src/lib/query-client.ts`

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // gotcha 2: mock delay + agresif refetch sorununu önler
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

`main.ts`'te `VueQueryPlugin` bu client ile register edilir.

## Serbestlik

- `[Serbest]` Switch'i sınıf/factory ya da basit if-export ile kurmak Sonnet'in takdirinde — **imza** sabit kaldığı sürece.
- `[Serbest]` MSW gibi bir kütüphane KULLANILMAZ; saf TS handler yeterli (yeni bağımlılık ekleme).
