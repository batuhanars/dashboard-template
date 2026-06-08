# Contract: Pinia Store'lar

**Bağlayıcı.** Store id'leri, state alanları, action adları sabittir. Setup-store stili (bkz. CONVENTIONS.md).

## useUiStore — `src/stores/ui.ts`

Tema, dil ve sidebar durumunu yönetir. Persist edilen alanlar `@vueuse/core` `useStorage` ile localStorage'a bağlanır.

```ts
export type Theme = 'light' | 'dark'
export type Locale = 'tr' | 'en'

export const useUiStore = defineStore('ui', () => {
  // localStorage key'leri SABİT — index.html inline script ile aynı olmalı (theme)
  const theme = useStorage<Theme>('dashboard-theme', 'light')
  const locale = useStorage<Locale>('dashboard-locale', 'tr')
  const sidebarCollapsed = useStorage<boolean>('dashboard-sidebar-collapsed', false)

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(value: Theme): void
  function toggleTheme(): void           // light <-> dark
  function setLocale(value: Locale): void
  function toggleSidebar(): void
  function setSidebarCollapsed(value: boolean): void

  return { theme, locale, sidebarCollapsed, isDark,
           setTheme, toggleTheme, setLocale, toggleSidebar, setSidebarCollapsed }
})
```

**Davranış sözleşmesi:**
- `setTheme`/`toggleTheme` çağrıldığında `<html>` elementine `dark` class'ı eklenir/çıkarılır. Bunu store içinde bir `watch(theme, ...)` ile yap (veya `useTheme` composable'ında — bkz. components contract). Tek noktada olsun, iki yerde değil.
- `setLocale` çağrıldığında vue-i18n `locale` global'i de güncellenir (senkron tutulur).
- **localStorage key adları** (`dashboard-theme` vb.) `index.html` içindeki anti-flicker inline script ile **birebir aynı** olmalı (PROJECT.md gotcha 4).

## useAuthStore — `src/stores/auth.ts`

Oturum durumunu yönetir. Token saklama işini doğrudan yapmaz → `lib/auth-storage.ts`'e delege eder (bkz. auth contract).

```ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  // Mock veya gerçek API'den session alır, token'ları auth-storage'a yazar,
  // user'ı set eder. Hatada throw eder (component toast gösterir).
  async function login(payload: LoginRequest): Promise<void>

  // Token'ları temizler, user'ı null yapar. (Router redirect'i çağıran yerde.)
  async function logout(): Promise<void>

  // Uygulama açılışında token varsa current user'ı yükler (bootstrap).
  async function fetchCurrentUser(): Promise<void>

  return { user, isAuthenticated, login, logout, fetchCurrentUser }
})
```

**Davranış sözleşmesi:**
- `login` → `api` üzerinden session al → `authStorage.setTokens(tokens)` → `user.value = session.user`.
- `logout` → `authStorage.clear()` → `user.value = null`. API logout endpoint'i mock'ta no-op.
- `fetchCurrentUser` → token yoksa erken döner; varsa `/me` benzeri çağrı (mock'ta saklanan user'ı döner). 401 olursa sessizce logout state'ine düşer.
- Token'ın kendisi store'da **tutulmaz** (auth-storage + interceptor yönetir). Store sadece `user`'ı tutar.

## storeToRefs kullanımı

Component'larda reaktif state çıkarırken `storeToRefs` kullan; action'ları doğrudan store'dan al:

```ts
const ui = useUiStore()
const { theme, isDark } = storeToRefs(ui)
// ui.toggleTheme  (action'lar storeToRefs'ten DEĞİL)
```

## Serbestlik

- `[Serbest]` İç yardımcı computed/fonksiyon eklenebilir.
- `[Serbest]` `theme`'e ileride `'system'` eklenebilir — ama M1 kapsamında sadece `light|dark`. Eklenecekse PM'e sor.
