# Kodlama Konvansiyonları

Kod yazarken bu kurallara sürekli uy. Bunlar tüm milestone'larda geçerlidir.

## Dil ve component stili

- Tüm component'lar `<script setup lang="ts">`. Options API yok.
- TypeScript zorunlu. `any` yalnızca son çare; tercih `unknown` + daralt.
- Props: `defineProps<T>()` jenerik tip ile. Emits: `defineEmits<T>()`.
- Reaktif state için `ref`/`computed`; obje grupları için gerekçesi varsa `reactive`.

## Dosya & klasör isimlendirme

- **Component dosyaları:** PascalCase — `AppSidebar.vue`, `DataTable.vue`, `StatCard.vue`.
- **Composable dosyaları:** camelCase, `use` prefix — `useAuth.ts`, `useConfirm.ts`.
- **Store dosyaları:** camelCase domain adı — `auth.ts`, `ui.ts`. Store fonksiyonu `useXStore` — `useAuthStore`, `useUiStore`.
- **Diğer lib/util:** camelCase — `api.ts`, `auth-storage.ts` (kebab kabul, mevcut vault yapısıyla uyumlu), `query-client.ts`.
- **View dosyaları:** PascalCase + `View` son eki — `DashboardView.vue`, `UsersListView.vue`.
- **Layout dosyaları:** PascalCase + `Layout` son eki — `DashboardLayout.vue`.

## Component prefix konvansiyonu

- `App*` — uygulama-seviyesi tekil layout parçaları: `AppSidebar`, `AppHeader`, `AppBreadcrumb`.
- `src/components/ui/*` — shadcn-vue primitive'leri (dokunma, `shadcn-vue add` ile gelir).
- `src/components/shared/*` — projeye özel reusable'lar: `DataTable`, `ConfirmDialog`, `StatCard`, `ChartCard`, `FormField`.

## Component organizasyonu (DİSİPLİN — bağlayıcı)

Vault kod disiplini standardı. İhlal etme.

- **Inline / monolitik component YOK.** Bir view'a ait alt parçalar o view'ın `components/` alt klasörüne ayrı dosya olarak çıkar:
  ```
  views/dashboard/
  ├── DashboardView.vue          # sadece compose eder, state yönetmez
  └── components/
      ├── DashboardKpiCards.vue
      ├── DashboardRevenueChart.vue
      └── DashboardRecentTransactions.vue
  ```
- **View sadece compose eder** — render mantığı alt component'lara dağıtılır, view ~50-100 satırda kalır. State view'da değil; Pinia store veya composable'da.
- **Promosyon (Rule of Three):** Component bir view'a özgü başlar → ikinci view'da da lazım olunca `components/shared/`'a taşı, ismini view-bağımsız yap, konfigürasyonu prop'a çevir. **İkinci tekrarda uyar, üçüncüde extract et** — premature abstraction yapma.
- **Shared vs view-specific:** Birden fazla view'da kullanılan (`DataTable`, `StatCard`, `ConfirmDialog`) → `components/shared/`. Tek view'a özgü → `views/<x>/components/`.

### Dağılma sinyalleri (refactor tetikleyicileri)

- Dosya 300+ satır → split düşün.
- `<script setup>` 80+ satır → composable'a böl.
- Component 5+ child barındırıyor → ayrı dosyalara ayır.
- Fonksiyon 30+ satır → küçük fonksiyonlara böl.
- Aynı kod 3. kez yazılıyor → utility'e çıkar. Aynı string/magic number tekrarlıyor → named constant.

### İnline kalabilir (over-abstraction tuzağı)

- 3-5 satırlık, tek yerde kullanılan, isim vermek istemediğin template parçası inline kalır. Sezgi: *"bu component'a isim vermek istiyor muyum?"* — Hayırsa inline bırak.

### DRY enforcement

Tekrar gördüğümde **söyleyeceğim**: *"bu zaten X dosyasında tanımlı"*. Bir refactor yaptığımda **nedenini** belirteceğim (*"DRY ihlali — ortak util'e taşıdım"*).

## Import kuralları (auto-import aktif — KRİTİK)

`vite.config.ts`'te şunlar **otomatik** import edilir; bunları **elle import etme**:

- `vue` API: `ref`, `computed`, `watch`, `onMounted`, `reactive`, `nextTick`, vb.
- `vue-router`: `useRoute`, `useRouter`, `RouterLink`, vb.
- `pinia`: `defineStore`, `storeToRefs`.
- `@vueuse/core`: `useStorage`, `useDark`, `useToggle`, vb.
- `vue-i18n`: `useI18n`.
- `src/composables/` ve `src/stores/` altındaki kendi composable/store'ların.
- `src/components/` altındaki component'lar (template'te etiket olarak doğrudan kullan, import etme).

**Elle import EDİLECEKLER:** Zod, axios, dayjs, chart.js, @tanstack/* , vee-validate, lucide ikonları, tip importları (`import type { ... }`).

> shadcn-vue primitive'leri `components.json` resolver'ı + `unplugin-vue-components` ile auto-resolve olur. Manuel import yazma → duplicate kayıt riski (PROJECT.md gotcha 1).

## Path alias

`@/` → `src/`. Göreli `../../` yerine `@/` kullan: `import { cn } from '@/lib/utils'`.

## i18n key konvansiyonu

- Format: `domain.action.label` — örn. `users.list.title`, `auth.login.submit`, `settings.appearance.theme`.
- `locales/tr.json` ve `locales/en.json` **birebir aynı key setine** sahip olmalı.
- Şablonda **hard-coded kullanıcı-görünür string yok** — hepsi `t('...')` veya `$t('...')`.
- Anahtarlar nested obje olarak organize edilir (flat dot-string değil): `{ "users": { "list": { "title": "..." } } }`.

## Pinia store stili (setup-store)

```ts
export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>('light')
  const isDark = computed(() => theme.value === 'dark')
  function toggleTheme() { /* ... */ }
  return { theme, isDark, toggleTheme }
})
```

Options API store yok. Persist gereken alanlar `@vueuse/core` `useStorage` ile localStorage'a bağlanır (detay stores contract'ında).

## vue-query konvansiyonu

- Query key'ler array ve hiyerarşik: `['users', 'list', filters]`, `['users', 'detail', id]`.
- `queryFn` her zaman `lib/api.ts` katmanını çağırır; doğrudan axios çağırmaz (mock transparency).
- Mutation sonrası ilgili key `queryClient.invalidateQueries` ile invalidate edilir.
- Global default `staleTime: 30_000` (query-client.ts).

## Form konvansiyonu

- Zod schema tanımla → `toTypedSchema(schema)` ile VeeValidate'e geçir (asla doğrudan Zod geçirme).
- Field-level validation VeeValidate ile; submit'te tüm schema validate.

## Stil / Tailwind

- Class birleştirme `cn()` (`@/lib/utils`) ile yapılır — koşullu class'lar için.
- Dark mode: `dark:` variant. Renkler shadcn CSS değişkenleri üzerinden (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, vb.) — ham `zinc-800` gibi değerleri tercih etme, theme token'larını kullan.
- Prettier + `prettier-plugin-tailwindcss` class sıralamasını otomatik yapar (`.prettierrc.json`).
- Kod stili: no semicolons, single quotes, 100 col, trailing comma all (Prettier ayarlı).

## Toast / bildirim

`vue-sonner` kullan. shadcn-vue'nun resmi entegrasyonu; `<Toaster />` App.vue'ye bir kez konur, `toast(...)` ile çağrılır.

## Genel

- `views/` yalnızca compose eder, ağır iş mantığı composable/store'a taşınır.
- Yorumlar çevredeki koda uygun yoğunlukta; gereksiz açıklama yok.
- Yeni bir pattern eklemeden önce contract'larda zaten tanımlı mı diye bak.
