# Dashboard Template

Vitrin kalitesinde, "Use this template" ile çoğaltılmaya hazır Vue 3 admin panel şablonu. Mock data ile sıfır backend bağımlılığı, dark mode ve TR/EN i18n baştan kurulu.

## Özellikler

- **Mock API** — `VITE_USE_MOCKS=true` ile hiçbir backend olmadan tam çalışan demo
- **Dark mode** — ilk render'da flicker yok (inline script, localStorage tabanlı)
- **TR/EN i18n** — `vue-i18n` ile her metin çevrilebilir, hard-coded string yok
- **Auth akışı** — login → korumalı sayfa → logout → redirect (mock dahil)
- **Showcase sayfaları** — Dashboard KPI + Chart, Users CRUD + Bulk actions, Settings, User Detail
- **Type-safe** — TypeScript strict, Zod şemaları, VeeValidate form validasyonu

## Stack

| Katman       | Paket                                                      |
| ------------ | ---------------------------------------------------------- |
| Core         | Vue 3, TypeScript, Vite 8                                  |
| Routing      | Vue Router 5                                               |
| State        | Pinia 3 (setup-store)                                      |
| Server state | @tanstack/vue-query v5                                     |
| UI           | Tailwind v4 + shadcn-vue (new-york/zinc) + lucide-vue-next |
| Form         | VeeValidate 4 + Zod                                        |
| Tablolar     | @tanstack/vue-table                                        |
| Grafikler    | Chart.js + vue-chartjs                                     |
| Utility      | @vueuse/core, dayjs, axios                                 |
| i18n         | vue-i18n v11                                               |

## Gereksinimler

- Node.js **20+**
- npm **10+**

## Hızlı Başlangıç

### 1. Template'i kullanın

GitHub'da **"Use this template"** butonuna tıklayın ve yeni repo'nuzu oluşturun. Ardından:

```bash
git clone https://github.com/<kullanici>/<proje>.git
cd <proje>
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını açın ve değerleri düzenleyin (ayrıntılar için aşağıya bakın).

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

`http://localhost:5173` adresine gidin. Giriş ekranında demo hesap bilgileri görüntülenir.

**Demo hesap:** `demo@example.com` / `demo1234`

## Ortam Değişkenleri

| Değişken            | Açıklama                                               | Varsayılan  |
| ------------------- | ------------------------------------------------------ | ----------- |
| `VITE_USE_MOCKS`    | `true` → mock handler'lar aktif; `false` → gerçek API  | `true`      |
| `VITE_API_BASE_URL` | Gerçek API'nin base URL'i (mock kapalıyken kullanılır) | _(boş)_     |
| `VITE_APP_NAME`     | Sidebar başlığı ve sekme adı                           | `Dashboard` |

> **Not:** Tüm değişkenler `VITE_` öneki taşımalıdır; aksi hâlde Vite bunları runtime'da gizler.

## Mock → Gerçek API Geçişi

Şablon, her API çağrısını tek bir yerden yönlendirir: `src/lib/api.ts`.

```ts
// src/lib/api.ts
export const api = {
  auth:      USE_MOCKS ? { login: mock.authLogin, ... }      : realAuth,
  dashboard: USE_MOCKS ? { summary: mock.mockDashboardSummary } : realDashboard,
  users:     USE_MOCKS ? { list: mock.mockUsersList, ... }    : realUsers,
}
```

Gerçek API'ye geçmek için:

1. `.env` dosyasında `VITE_USE_MOCKS=false` ve `VITE_API_BASE_URL=https://api.example.com` yapın.
2. `src/lib/api.ts` içindeki `realAuth`, `realDashboard`, `realUsers` nesnelerini doldurun — iskelet fonksiyonlar zaten mevcut.
3. Mock handler'lar (`src/lib/mocks/handlers.ts`) geliştirme için kalabilir; production build'e dahil olmaz.

## Klasör Yapısı

```
src/
├── assets/                    # Yalnızca gerçekten kullanılan statik dosyalar
├── components/
│   ├── ui/                    # shadcn-vue primitifleri (otomatik çözümlenir)
│   ├── layout/                # AppSidebar · AppHeader · AppBreadcrumb
│   └── shared/                # DataTable · ConfirmDialog · StatCard · ChartCard · FormField
├── composables/               # useAuth · useConfirm · useTheme · useLocale
├── layouts/                   # AuthLayout · DashboardLayout
├── lib/
│   ├── api.ts                 # Mock/gerçek API switch
│   ├── auth-storage.ts        # Token storage soyutlaması
│   ├── format.ts              # Tarih · para birimi · sayı formatlayıcılar
│   ├── chart-register.ts      # Chart.js singleton kayıt
│   ├── mocks/                 # handlers.ts + data/ (seed verisi)
│   └── query-client.ts        # @tanstack/vue-query QueryClient yapılandırması
├── locales/                   # tr.json · en.json
├── router/                    # index.ts · guards.ts
├── stores/                    # auth.ts · ui.ts
├── types/                     # api.ts (Zod'dan infer) · router.d.ts
└── views/
    ├── auth/                  # LoginView · ForgotPasswordView
    ├── dashboard/             # DashboardView
    ├── users/                 # UsersListView · UserDetailView
    └── settings/              # SettingsView
```

## Özelleştirme

### Renk paleti

Tailwind v4 CSS değişkenlerini `src/assets/main.css` içinde bulacaksınız. `--primary`, `--background`, `--foreground` vb. değerleri değiştirerek marka renginizi uygulayın.

### Yeni dil eklemek

1. `src/locales/` altında `<kod>.json` oluşturun (örn. `de.json`).
2. `src/stores/ui.ts` içindeki `Locale` tipine yeni kodu ekleyin.
3. `src/composables/useLocale.ts` içindeki `available` dizisine ekleyin.
4. `src/main.ts`'de `createI18n` çağrısına mesajları dahil edin.

### Yeni sayfa eklemek

1. `src/views/<alan>/MyView.vue` oluşturun.
2. `src/router/index.ts`'e route ekleyin (`meta: { requiresAuth: true, titleKey: 'nav.myPage' }`).
3. `src/locales/tr.json` ve `en.json`'a `nav.myPage` anahtarını ekleyin.
4. `src/components/layout/AppSidebar.vue` içindeki `navItems` dizisine menü girişini ekleyin.

## Komutlar

```bash
npm run dev       # Geliştirme sunucusu (hot-reload)
npm run build     # TypeScript kontrolü + production build
npm run preview   # Production build'i yerel olarak önizle
```

## Deploy

Uygulama tamamen istemci taraflı bir SPA'dır.

### Apache / Plesk

`public/.htaccess` dosyası tüm rotaları `index.html`'e yönlendirir — ek yapılandırma gerekmez.

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Vercel / Netlify

`vercel.json` veya `netlify.toml` ile SPA fallback yapılandırın ya da platforma ait sıfır-config seçeneğini kullanın.

## Lisans

MIT
