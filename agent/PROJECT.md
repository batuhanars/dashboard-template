# Dashboard Template — Proje Tanımı

## Amaç

GitHub'da "Use this template" ile çoğaltılacak bir **vitrin admin panel template'i**. Backend bağımsız (mock data ile çalışır), dark mode + TR/EN baştan kurulu. Yeni müşteri projesi geldiğinde clone → customize akışı için tasarlandı.

**Kalite çıtası (vitrin hedefi):** Showcase sayfaları (Dashboard, UsersList, UserDetail, Settings, Login) gerçek bir admin paneli kalitesinde görünmeli ve davranmalı — yarı-bitik wireframe gibi durmamalı. Müşteriye demo gösterilecek.

## Görsel referans

**Snow Dashboard UI Kit** (ByeWind, Figma Community). Sidebar + KPI kartları + data table + chart'lar bu kit'in görsel diline uygun olmalı. Snow UI yalnızca **görsel referanstır**; mimari değişmez. Sayfa uygularken Figma MCP `get_design_context` ile node bazlı referans alınabilir.

## Hedef kullanım

CMS panelleri, küçük-orta e-ticaret admin'leri, analytics dashboard'ları, müşteri-spesifik internal tool'lar.

**Hedef değil:** Public marketing siteleri (SSR yok), native mobil, mikro-frontend.

## Stack (sabit — değiştirme)

| Katman | Paket |
|---|---|
| Core | Vue 3 (`<script setup lang="ts">`), TypeScript, Vite |
| Routing | Vue Router |
| State | Pinia (setup-store stili) |
| HTTP | Axios |
| Server state | @tanstack/vue-query |
| UI | Tailwind v4 + shadcn-vue (new-york, zinc) + lucide-vue-next + vue-sonner |
| Form | VeeValidate + @vee-validate/zod + Zod |
| Tables | @tanstack/vue-table (headless) |
| Charts | Chart.js + vue-chartjs |
| Utility | @vueuse/core, dayjs |
| i18n | vue-i18n (TR/EN) |
| DX | unplugin-auto-import, unplugin-vue-components |

Tüm paketler **kurulu**. Yeni paket ekleme ihtiyacı doğarsa önce PM'e sor.

## Milestone haritası

| ID | Ad | Durum |
|---|---|---|
| M0 | Init (Vite/TS/Tailwind/shadcn) | ✅ DONE |
| M1 | Foundation (Pinia, Router, Axios skeleton, dark mode + i18n) | ⏳ TODO |
| M2 | Auth Flow (login/logout, guards, refresh interceptor, mock auth) | ⏳ TODO |
| M3 | Layout (AuthLayout + DashboardLayout, sidebar, header, breadcrumb) | ⏳ TODO |
| M4 | Mock Layer (lib/mocks, VITE_USE_MOCKS switch, vue-query entegrasyonu) | ⏳ TODO |
| M5 | Reusable Components (DataTable, ConfirmDialog, FormField, StatCard) | ⏳ TODO |
| M6 | Showcase Sayfaları (Dashboard, UsersList, UserDetail, Settings, Login) | ⏳ TODO |
| M7 | Polish & Template (README, "Use this template" testi, demo) | ⏳ TODO |

## Hedef klasör yapısı (referans — önden oluşturma)

```
src/
├── assets/main.css            # (mevcut: style.css — Tailwind + theme CSS vars)
├── components/
│   ├── ui/                    # shadcn-vue primitives (shadcn-vue add ile gelir)
│   ├── layout/                # AppSidebar, AppHeader, AppBreadcrumb
│   └── shared/                # DataTable, ConfirmDialog, StatCard, ChartCard
├── composables/               # useAuth, useConfirm, useTheme, useLocale
├── layouts/                   # AuthLayout, DashboardLayout
├── lib/
│   ├── api.ts                 # Axios instance + mock switch
│   ├── auth-storage.ts        # Token storage abstraction
│   ├── mocks/                 # Mock data + handlers
│   ├── query-client.ts        # vue-query QueryClient config
│   └── utils.ts               # cn() (mevcut), formatters
├── locales/                   # tr.json, en.json
├── router/                    # index.ts, guards.ts
├── stores/                    # auth.ts, ui.ts
├── types/                     # api.ts (Zod'dan infer), router.d.ts
└── views/
    ├── auth/                  # LoginView, ForgotPasswordView
    ├── dashboard/
    │   ├── DashboardView.vue
    │   └── components/        # ekran-spesifik: DashboardKpiCards, DashboardRevenueChart, ...
    ├── users/
    │   ├── UsersListView.vue
    │   ├── UserDetailView.vue
    │   └── components/        # ekran-spesifik: UsersFilterBar, UserProfileForm, ...
    └── settings/
        ├── SettingsView.vue
        └── components/        # ekran-spesifik: SettingsAppearance, SettingsDangerZone, ...
```

**Ayrım (DİSİPLİN):** `views/` state yönetmez, sadece compose eder (~50-100 satır); state Pinia store/composable'a taşınır. Ekran-spesifik alt component'lar o view'ın `components/` alt klasöründe; birden fazla view'da kullanılanlar `components/shared/`'da. `lib/` component'lardan bağımsız helper'ları toplar. Detay → CONVENTIONS.md "Component organizasyonu".

## Definition of Done (template seviyesi)

- [ ] `VITE_USE_MOCKS=true` ile `npm run dev` açıldığında tüm showcase sayfaları mock data ile çalışıyor.
- [ ] `npm run build` type error olmadan geçiyor.
- [ ] Dark mode toggle çalışıyor, ilk render'da flicker yok.
- [ ] TR/EN dil değişimi tüm görünür metinleri çeviriyor (hard-coded string yok).
- [ ] Auth akışı: login → korumalı sayfa → logout → redirect çalışıyor (mock).
- [ ] `.env.example` mevcut; `README.md` "Use this template" sonrası kurulumu anlatıyor.
- [ ] Showcase sayfaları Snow UI kalitesinde, demo'ya hazır.

## Kritik gotcha'lar (vault'tan — Sonnet için gömülü)

Bunlar daha önce yaşanmış tuzaklar; ilgili contract/görev içinde tekrar hatırlatılır.

1. **shadcn-vue + auto-import çakışması:** `components.json` resolver'ı ile uyumlu kal; `src/components/ui`'daki primitive'leri manuel import etme (auto-resolve var). Duplicate kayıt riski.
2. **vue-query mock dedupe:** Mock'lar `setTimeout` delay'i kullandığında default staleTime agresif. `query-client.ts`'te `staleTime: 30_000` set et.
3. **VeeValidate + Zod:** Zod schema'yı VeeValidate'e **her zaman** `toTypedSchema()` ile geçir; doğrudan geçirmek tip kaybı yaratır.
4. **Dark mode flicker:** Theme'i Pinia'dan okumak ilk render'a yetişmez. `index.html` head'inde inline `<script>` ile localStorage'dan theme okunup `<html>`'e `dark` class basılmalı (Pinia hydrate olmadan önce).
5. **vue-i18n + auto-import:** `useI18n` auto-import resolver'a eklendi (vite.config.ts). Template'te `$t` zaten çalışır.
6. **VITE_ prefix:** Prefix'siz env değişkenleri runtime'da görünmez.
