# Contract: Auth — Token Storage, Refresh, Guards

**Bağlayıcı.** JWT + refresh akışı, storage soyutlaması ve route meta sabittir. Mock modunda da aynı akış simüle edilir.

## `src/lib/auth-storage.ts` — token soyutlaması

Token saklama tek noktadan yönetilir; store ve interceptor buraya bağlanır. localStorage temelli (rememberMe false ise sessionStorage `[Serbest]`).

```ts
export const authStorage = {
  getAccessToken(): string | null,
  getRefreshToken(): string | null,
  setTokens(tokens: AuthTokens): void,
  clear(): void,
}
```

localStorage key'leri: `dashboard-access-token`, `dashboard-refresh-token` (sabit).

## Axios interceptor'ları (`lib/api.ts` içinde kurulur)

**Request interceptor:** Access token varsa `Authorization: Bearer <token>` header'ı ekler.

**Response interceptor (refresh akışı):**
- 401 alınınca: refresh token ile `api.auth.refresh()` çağrılır → yeni token'lar `authStorage.setTokens` ile yazılır → orijinal istek retry edilir.
- **Eşzamanlı 401'ler:** Aynı anda birden çok istek 401 alırsa tek bir refresh çağrısı yapılır, diğerleri bu promise'i bekler (refresh queue / single-flight deseni). İki kez refresh atma.
- Refresh de başarısız olursa: `authStorage.clear()` + auth store logout state + login'e yönlendirme (bir event/callback ile; interceptor router'ı doğrudan import etmesin → döngüsel bağımlılık riski, `[Serbest]` çözüm: bir `onAuthFailure` callback'i register et).

## Mock auth davranışı (`VITE_USE_MOCKS=true`)

- `login`: demo creds eşleşirse `{ tokens: { accessToken: 'mock-access-...', refreshToken: 'mock-refresh-...' }, user }` döner.
- `refresh`: verilen refresh token `mock-refresh-` ile başlıyorsa yeni `mock-access-...` üretir; aksi halde reject (oturum düşer).
- `me`: geçerli mock access token varsa demo user'ı döner.
- Tüm akış `delay()` ile gecikme simüle eder.

## Route guard'ları (`src/router/guards.ts`)

Route meta tipi (`src/types/router.d.ts` ile augment edilir):

```ts
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean      // default davranış: tanımsızsa korumalı SAYILMAZ
    layout?: 'auth' | 'dashboard'
    titleKey?: string           // i18n key — breadcrumb/document.title için
  }
}
```

**Global `beforeEach` guard sözleşmesi:**
- `to.meta.requiresAuth === true` ve `!authStore.isAuthenticated` → `/login`'e yönlendir (query'de `redirect=<hedef>`).
- Zaten authenticated kullanıcı `/login`'e giderse → `/` (dashboard) redirect.
- Korumalı route'lara girişte gerekirse `fetchCurrentUser` ile bootstrap (token var ama user yüklenmemişse).

## App bootstrap (`main.ts` / App.vue)

- Uygulama açılışında token varsa `authStore.fetchCurrentUser()` çağrılır (await edilip ilk guard kararı ona göre verilir veya bir `isReady` flag'i ile yönetilir).

## Serbestlik

- `[Serbest]` Single-flight refresh implementasyonu (modül-seviye promise değişkeni vs.) Sonnet'in takdirinde.
- `[Serbest]` rememberMe için storage seçimi (local vs session).
- Token alan/anahtar adları ve route meta alanları **sabit** — değiştirme.
