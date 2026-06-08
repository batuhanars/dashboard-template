# M3 — Layout

**Status:** TODO
**Önkoşul:** M2.
**İlgili contract'lar:** `stores.md` (sidebarCollapsed, theme, locale), CONVENTIONS.md (App* prefix). Görsel: Snow UI Kit.

## Hedef

İki layout (Auth + Dashboard) ve dashboard kabuğu: sidebar (collapse), header (user menu, theme/locale switch, bildirim), breadcrumb. Showcase sayfaları bu kabuğa oturacak.

## Adımlar

- [ ] **1. Layout sistemi:** `src/layouts/AuthLayout.vue` (ortalanmış, sade — login için) + `src/layouts/DashboardLayout.vue` (sidebar + header + `<RouterView />`). Router meta `layout` alanına göre veya nested route ile seçilir (`[Serbest]` ama tutarlı ol).
- [ ] **2. AppSidebar:** `src/components/layout/AppSidebar.vue` — nav öğeleri (Dashboard, Users, Settings — Lucide ikonlar), aktif route vurgusu, collapse toggle (`uiStore.sidebarCollapsed`). Collapsed durumda sadece ikonlar. Snow UI sidebar referans.
- [ ] **3. AppHeader:** `src/components/layout/AppHeader.vue` — sol: sidebar toggle + breadcrumb; sağ: theme switch, locale switch (TR/EN), bildirim ikonu (Sheet/Popover ile panel), user menu (DropdownMenu: profil, settings, logout).
- [ ] **4. AppBreadcrumb:** `src/components/layout/AppBreadcrumb.vue` — route `meta.titleKey` zincirinden i18n ile üretilir.
- [ ] **5. Theme/Locale switch UI:** Header'daki toggle'lar `useTheme`/`useLocale` (veya store) ile bağlanır. Mevcut M1 mantığını kullan, yeniden yazma.
- [ ] **6. Responsive:** Sidebar mobilde drawer/sheet olarak açılır (masaüstünde sabit). `@vueuse/core` `useMediaQuery` kullanılabilir.
- [ ] **7. Route iskeleti:** Dashboard/Users/Settings için placeholder view'lar + route tanımları (içerik M6'da). Hepsi `requiresAuth: true` + uygun `titleKey`.

## shadcn-vue eklenecek

`npx shadcn-vue@latest add dropdown-menu sheet popover avatar separator tooltip breadcrumb` (ihtiyaca göre).

## Kabul kriterleri

- Login sonrası DashboardLayout görünüyor: sidebar + header + içerik alanı.
- Sidebar collapse çalışıyor, durum kalıcı (localStorage).
- Header'dan theme + locale değişiyor; user menu'den logout çalışıyor.
- Breadcrumb aktif route'u i18n ile gösteriyor.
- Mobilde sidebar drawer olarak davranıyor.
- LoginView AuthLayout kullanıyor (sidebar'sız).
- `npm run build` geçiyor.

## Doğrulama

```
npm run build
npm run dev   # masaüstü + dar viewport'ta layout, collapse, menüler
```
