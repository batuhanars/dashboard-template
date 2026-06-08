# M1 — Foundation

**Status:** DONE
**Önkoşul:** M0 (done).
**İlgili contract'lar:** `stores.md`, `mock-layer.md` (query-client), CONVENTIONS.md.

## Hedef

Uygulamanın iskelet altyapısını kur: Pinia + Vue Router + vue-query plugin'leri, UI store (tema + dil + sidebar), i18n (TR/EN), dark mode + anti-flicker. Bu milestone sonunda boş ama doğru kablolanmış bir uygulama açılmalı.

## Adımlar

- [ ] **1. main.ts kablolama:** `createApp` üzerine `createPinia()`, router (M1'de minimal), `VueQueryPlugin` (query-client ile), `createI18n` instance'ını register et. `vue-sonner` `<Toaster />` App.vue'ye eklenir.
- [ ] **2. query-client:** `src/lib/query-client.ts` — `mock-layer.md`'deki default'larla (`staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`).
- [ ] **3. i18n kurulumu:** `src/locales/tr.json` + `en.json` (aynı key seti). `src/lib/i18n.ts` veya inline `createI18n` (`legacy: false`, `locale` ui store/localStorage'dan). İlk key setine en az: `common.*` (save/cancel/delete/confirm), `nav.*`, `auth.*` taslağı koy; ileride genişler.
- [ ] **4. UI store:** `src/stores/ui.ts` — `stores.md`'deki imza. `useStorage` ile persist (`dashboard-theme`, `dashboard-locale`, `dashboard-sidebar-collapsed`).
- [ ] **5. Tema senkronu:** `theme` değişince `<html>`'e `dark` class ekle/çıkar (store watch veya `useTheme` composable — tek nokta). `setLocale` vue-i18n locale'ini de güncellesin.
- [ ] **6. Anti-flicker script:** `index.html` `<head>`'ine inline `<script>` — Pinia hydrate olmadan önce `localStorage['dashboard-theme']` okunup `<html>`'e `dark` class basılır (gotcha 4). localStorage key store ile aynı olmalı.
- [ ] **7. Minimal router:** `src/router/index.ts` — şimdilik bir placeholder `/` route'u (boş bir view veya "Foundation OK"). Guard'lar M2'de gelir. `createWebHistory`.
- [ ] **8. style.css gözden geçir:** shadcn'in eklediği CSS değişkenleri (light + `.dark`) yerinde mi doğrula; gerekiyorsa `assets/main.css`'e taşımak yerine mevcut `src/style.css`'i kullanmaya devam et (components.json `css: src/style.css` işaret ediyor — değiştirme).

## shadcn-vue eklenecek

- `npx shadcn-vue@latest add button sonner` (Toaster + ilk smoke testi için buton).

## Kabul kriterleri

- `npm run dev` açılıyor, konsol hatası yok.
- localStorage'da `dashboard-theme` `dark` iken sayfa **flicker'sız** koyu açılıyor.
- UI store'dan `toggleTheme()` çağrısı anında temayı değiştiriyor.
- `useI18n` ile `locale` değiştirince metin TR/EN arası geçiyor (smoke test bir metinle).
- `npm run build` type-check'ten geçiyor.

## Doğrulama

```
npm run build
npm run dev   # gözle: flicker yok, theme + locale toggle çalışıyor
```
