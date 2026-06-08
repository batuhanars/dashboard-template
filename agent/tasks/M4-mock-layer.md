# M4 — Mock Layer (tamamlama)

**Status:** TODO
**Önkoşul:** M2 (auth mock'u zaten kurdu), M3.
**İlgili contract'lar:** `mock-layer.md`, `types.md`.

## Hedef

M2'de auth için başlatılan mock katmanını **tüm domain'lere** genişlet: dashboard summary, users (list/detail/activities/update/remove/bulk). vue-query entegrasyonunu mock üstünde doğrula. Bu milestone sonunda showcase sayfalarının ihtiyaç duyacağı tüm veri uçları mock'tan akar.

## Adımlar

- [ ] **1. Seed data:** `src/lib/mocks/data/` — `users.ts` (≥40 gerçekçi user; çeşitli rol/durum/tarih), `transactions.ts`, `dashboard.ts` (30 günlük revenue serisi + 4 KPI), `activities.ts`. Hepsi types contract Zod schema'larına uyar.
- [ ] **2. dashboard handler:** `api.dashboard.summary()` → `DashboardSummary` (metrics + revenueSeries + recentTransactions).
- [ ] **3. users handler'ları:** `list(params)` bellekte **arama + rol/durum filtresi + sıralama + sayfalama** uygular ve `Paginated<User>` döner. `detail`, `activities`, `update`, `remove`, `bulkRemove`, `bulkDeactivate`.
- [ ] **4. Mutation davranışı:** `update`/`remove`/bulk işlemleri mock state'i (modül-içi mutable array) gerçekten değiştirsin ki invalidate sonrası UI tutarlı görünsün.
- [ ] **5. Gerçek API iskeleti:** `real*` implementasyonları `http` ile aynı imzayı çağıracak şekilde **iskelet** olarak yazılır (gövde minimal; backend yok ama imza dursun). `api` switch ikisini de tanır.
- [ ] **6. vue-query smoke:** Bir test view'ında (veya geçici) `useQuery(['dashboard','summary'], () => api.dashboard.summary())` ile veri akışını doğrula; loading/error/success durumları çalışıyor.
- [ ] **7. Dev cache reset (opsiyonel):** `[Serbest]` `.env.local` ile mock flip edilince stale cache için dev-only `queryClient.clear()` switch'i (gotcha — mock-layer notu).

## Kabul kriterleri

- `api.dashboard.summary()` ve tüm `api.users.*` mock'tan tutarlı veri dönüyor.
- `users.list` arama/filtre/sort/paginate doğru sonuç veriyor (manuel parametre testi).
- update/remove sonrası `invalidateQueries` ile liste güncelleniyor.
- Zod `parse` ile seed data doğrulandı (dev'de hata yok).
- `npm run build` geçiyor.

## Doğrulama

```
npm run build
npm run dev   # smoke view'da veri akışı + bir mutation
```
