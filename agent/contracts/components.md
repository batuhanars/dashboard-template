# Contract: Reusable Component'lar (prop/emit imzaları)

**Bağlayıcı.** Aşağıdaki shared component'ların ve composable'ların public arayüzü sabittir. İç implementasyon serbest, imza değil. Hepsi `src/components/shared/` (component) veya `src/composables/` (composable) altında.

## DataTable — `components/shared/DataTable.vue`

`@tanstack/vue-table` üzerine shadcn-vue Table primitive'leriyle headless wrapper. Generic.

```ts
// Props
defineProps<{
  columns: ColumnDef<TData, TValue>[]   // @tanstack/vue-table ColumnDef
  data: TData[]
  loading?: boolean
  pageCount?: number                     // server/mock-side pagination için
  enableRowSelection?: boolean
}>()

// Emits
defineEmits<{
  'update:pagination': [{ pageIndex: number; pageSize: number }]
  'update:sorting': [SortingState]
  'update:globalFilter': [string]
  'rowSelectionChange': [selectedRows: TData[]]
}>()
```

**Sözleşme:** Sorting, pagination, global filter **server-side/manual** modda çalışır (mock `users.list` parametre alır). Yani DataTable state değiştiğinde emit eder, veriyi kendisi filtrelemez; parent vue-query ile yeniden çeker. Row selection bulk action'ları besler.

## ConfirmDialog + useConfirm

shadcn-vue `AlertDialog` temelli, imperatif kullanım için composable.

```ts
// composables/useConfirm.ts
interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
}
function useConfirm(): {
  confirm: (options: ConfirmOptions) => Promise<boolean>   // true = onaylandı
}
```

- `components/shared/ConfirmDialog.vue` App seviyesinde bir kez mount edilir (provider deseni veya global state).
- `confirm(...)` bir Promise döner; kullanıcı onaylarsa `true`, iptal/kapatırsa `false`.
- Danger Zone, bulk delete gibi yerlerde kullanılır.

## StatCard — `components/shared/StatCard.vue`

Dashboard KPI kartı (shadcn `Card` + Lucide ikon).

```ts
defineProps<{
  label: string            // i18n ile çözülmüş metin (parent çözer)
  value: string            // formatlanmış değer (parent formatlar — Intl)
  deltaPct?: number        // pozitifse yeşil ↑, negatifse kırmızı ↓ rozet
  icon?: Component         // lucide component
}>()
```

## ChartCard — `components/shared/ChartCard.vue`

vue-chartjs sarmalı (Line/Bar). shadcn `Card` içinde başlık + grafik.

```ts
defineProps<{
  title: string
  type: 'line' | 'bar' | 'doughnut'
  // chart.js data/options — tip için chart.js tiplerini import et
  data: ChartData
  options?: ChartOptions
}>()
```

**Sözleşme:** Chart.js gerekli controller/element'leri **bir kez** register edilir (`lib/` içinde bir `chart-register.ts` veya ChartCard içinde modül-seviye). Dark mode'da grid/label renkleri theme'e uymalı (`[Serbest]` reaktif options).

## FormField — `components/shared/FormField.vue`

VeeValidate + shadcn input için ince sarmalı. Label + input + hata mesajı düzenini standartlaştırır.

```ts
defineProps<{
  name: string             // VeeValidate field adı
  label?: string
  type?: string            // 'text' | 'email' | 'password' | ...
  placeholder?: string
}>()
```

**Sözleşme:** Form schema'ları **her zaman** `toTypedSchema(zodSchema)` ile VeeValidate'e geçer (PROJECT.md gotcha 3). FormField, `useField(name)` ile değer + hata mesajını bağlar.

## useTheme — `composables/useTheme.ts`

`useUiStore` üstüne ince sarmalı (opsiyonel ama önerilir). `<html>` class senkronizasyonu **tek noktada** burada veya store watch'ında olur (ikisinde birden değil).

```ts
function useTheme(): { theme: Ref<Theme>; isDark: Ref<boolean>; toggle: () => void }
```

## useLocale — `composables/useLocale.ts`

`useUiStore.locale` ile vue-i18n `locale`'ini senkron tutar.

```ts
function useLocale(): { locale: Ref<Locale>; setLocale: (l: Locale) => void; available: Locale[] }
```

## Serbestlik

- `[Serbest]` İç markup, slot tasarımı, ek opsiyonel prop'lar. Yukarıdaki **zorunlu prop/emit adları** sabit.
- `[Serbest]` ConfirmDialog'un provider mı yoksa pinia/global state mi ile kurulacağı — Promise tabanlı `confirm()` API'si sabit kaldığı sürece.
