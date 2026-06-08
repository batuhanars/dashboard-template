# M6 — Showcase Sayfaları (Vitrin)

**Status:** TODO
**Önkoşul:** M5.
**İlgili contract'lar:** Tümü. Görsel referans: **Snow UI Kit** (Figma MCP `get_design_context` ile sayfa bazlı).

## Hedef

Vitrin sayfalarını gerçek bir admin paneli kalitesinde tamamla. Hepsi mock data ile çalışır. **Kalite çıtası yüksek** — müşteriye demo gösterilecek (PROJECT.md).

> Her sayfaya başlamadan önce, varsa Figma MCP ile Snow UI'daki karşılığının `get_design_context`'ini al; renk/spacing/layout referansını oradan eşle.

## Sayfa sırası ve içerik

- [ ] **1. DashboardView** (`views/dashboard/`) — Üstte 4 StatCard (revenue, users, orders, conversion + deltaPct). Altında ChartCard line (30 günlük revenue) + son 5 transaction listesi (mini tablo/list). vue-query `['dashboard','summary']`. Loading skeleton.
- [ ] **2. UsersListView** (`views/users/`) — DataTable: arama, kolon sıralama, sayfa başı seçimi, satır seçimi, bulk action ("Sil", "Pasifleştir" → useConfirm). Filtre: rol + durum (shadcn Select). vue-query `['users','list',params]`, params değişince refetch. Boş durum + loading.
- [ ] **3. UserDetailView** (`views/users/`) — Tab'lı (shadcn Tabs): **Profile** (VeeValidate+Zod düzenleme formu, FormField, kaydet→update mutation→invalidate→toast), **Activity** (activities feed), **Permissions** (rol/izin gösterimi). `['users','detail',id]`.
- [ ] **4. SettingsView** (`views/settings/`) — **Profile** (avatar + form), **Appearance** (theme + locale toggle — mevcut store/composable'ları kullan), **Notifications** (toggle'lar), **Danger Zone** (hesap sil → useConfirm destructive).
- [ ] **5. LoginView** (`views/auth/`) — M2'deki geçici formu Snow UI kalitesine çıkar: email + password + "Beni hatırla" + "Şifremi unuttum" linki. Mock: `demo@example.com` / `demo123`. AuthLayout.
- [ ] **6. ForgotPasswordView** (`views/auth/`) — Basit email formu + başarı mesajı (mock no-op).
- [ ] **7. i18n tamamlama:** Tüm yeni sayfa metinleri `tr.json`/`en.json`'a eklendi; **hard-coded string yok**.

## Kabul kriterleri

- 4 sayfa + login + forgot mock data ile çalışıyor; loading/empty/error durumları var.
- DashboardView KPI + chart + recent list gerçekçi görünüyor.
- UsersList: arama/filtre/sort/paginate/bulk action tam çalışıyor.
- UserDetail formu validate ediyor, kaydet sonrası liste/detay güncelleniyor.
- Settings'ten theme+locale değişiyor, danger zone confirm soruyor.
- Tüm metinler TR/EN; dark mode tüm sayfalarda düzgün.
- Snow UI ile görsel karşılaştırma yapıldı, "vitrin" kalitesinde.
- `npm run build` geçiyor.

## Doğrulama

```
npm run build
npm run dev   # her sayfayı TR+EN ve light+dark'ta gözle gez
```
