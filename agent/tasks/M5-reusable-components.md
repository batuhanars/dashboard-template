# M5 — Reusable Components

**Status:** TODO
**Önkoşul:** M3, M4.
**İlgili contract'lar:** `components.md` (imzalar bağlayıcı), CONVENTIONS.md.

## Hedef

Showcase sayfalarının üstüne kurulacağı paylaşılan component'ları üret: DataTable, ConfirmDialog (+useConfirm), StatCard, ChartCard, FormField. İmzalar `components.md`'de sabit.

## Adımlar

- [ ] **1. DataTable:** `components/shared/DataTable.vue` — `@tanstack/vue-table` + shadcn Table. **Manual** sorting/pagination/global filter (server-side mod), emit'ler `components.md`'deki gibi. Row selection → seçili satırları emit. Loading skeleton.
- [ ] **2. ConfirmDialog + useConfirm:** `components/shared/ConfirmDialog.vue` (shadcn AlertDialog) + `composables/useConfirm.ts`. Promise tabanlı `confirm(options) => Promise<boolean>`. App seviyesinde tek mount.
- [ ] **3. StatCard:** `components/shared/StatCard.vue` — label/value/deltaPct/icon. deltaPct işaretine göre yeşil↑/kırmızı↓ rozet. shadcn Card.
- [ ] **4. ChartCard:** `components/shared/ChartCard.vue` — vue-chartjs Line/Bar/Doughnut. Chart.js register **tek noktada** (`lib/chart-register.ts` veya modül-seviye). Dark mode'da grid/label renkleri theme'e reaktif.
- [ ] **5. FormField:** `components/shared/FormField.vue` — VeeValidate `useField` + shadcn Input + label + hata mesajı. Schema'lar `toTypedSchema` ile (gotcha 3).
- [ ] **6. Formatters:** `lib/utils.ts`'e (veya `lib/format.ts`) `Intl` tabanlı `formatCurrency`, `formatNumber`, `formatDate` (dayjs) helper'ları. StatCard/DataTable/Dashboard bunları kullanır.

## shadcn-vue eklenecek

`npx shadcn-vue@latest add table card alert-dialog input label badge skeleton select checkbox` (ihtiyaca göre).

## Kabul kriterleri

- DataTable bir mock listede sort/paginate/search/row-select ediyor; state'i parent'a emit ediyor.
- `useConfirm().confirm(...)` Promise dönüyor; onay/iptal doğru boolean veriyor.
- StatCard pozitif/negatif delta'yı doğru renkliyor.
- ChartCard line+bar render ediyor; dark mode'da okunaklı.
- FormField bir Zod schema ile inline validation gösteriyor.
- `npm run build` geçiyor.

## Doğrulama

```
npm run build
npm run dev   # her component'ı bir sandbox/showcase view'da gözle test et
```
