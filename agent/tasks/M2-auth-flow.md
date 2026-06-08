# M2 — Auth Flow

**Status:** TODO
**Önkoşul:** M1.
**İlgili contract'lar:** `auth.md`, `stores.md` (useAuthStore), `types.md` (auth tipleri), `mock-layer.md` (api.auth + demo creds).

## Hedef

Login/logout, token storage, refresh interceptor ve route guard'ları kur. Mock auth ile demo creds çalışsın. Bu milestone sonunda korumalı bir route'a girmek login'e zorlasın, login sonrası geri dönsün.

## Adımlar

- [ ] **1. Tipler:** `src/types/api.ts` içine `auth.md`/`types.md`'deki Zod schema'ları + infer'lar (login, tokens, session, user — user types contract'tan). Önce `userSchema` gelsin (auth ona bağlı).
- [ ] **2. auth-storage:** `src/lib/auth-storage.ts` — `authStorage` objesi (`auth.md` imzası). Sabit key'ler: `dashboard-access-token`, `dashboard-refresh-token`.
- [ ] **3. api iskeleti + interceptor:** `src/lib/api.ts` — axios instance, request interceptor (Bearer), response interceptor (single-flight refresh, `onAuthFailure` callback). `api.auth.*` yüzeyi.
- [ ] **4. Mock auth:** `src/lib/mocks/` — `handlers.ts` içinde `auth.login/logout/me/refresh`, demo creds (`demo@example.com`/`demo123`), fake JWT'ler, `delay()`. `data/users.ts` içinde en az demo user.
- [ ] **5. api switch:** `VITE_USE_MOCKS` ile mock vs real seçimi (`mock-layer.md` deseni). `.env.example` oluştur.
- [ ] **6. auth store:** `src/stores/auth.ts` — `login/logout/fetchCurrentUser`, `isAuthenticated`. Token'ı store'da tutma; auth-storage + interceptor yönetir.
- [ ] **7. Route guard'ları:** `src/router/guards.ts` + `src/types/router.d.ts` (RouteMeta augment). `beforeEach`: `requiresAuth` + redirect query mantığı (`auth.md`). `onAuthFailure` guard/login redirect'e bağlanır.
- [ ] **8. Bootstrap:** `main.ts`/App.vue — açılışta token varsa `fetchCurrentUser()`; ilk guard kararı buna göre (`isReady` flag deseni).
- [ ] **9. Minimal LoginView (geçici):** Sadece akışı test etmek için sade form (tam tasarım M6'da). Email+password, submit → `authStore.login`, hata → `toast`. M6'da Snow UI ile yeniden ele alınacak.

## Kabul kriterleri

- `demo@example.com` / `demo123` ile login başarılı, korumalı sayfaya yönleniyor.
- Yanlış creds → toast hata, login'de kalıyor.
- Korumalı route'a (örn. `/`) login olmadan gidince `/login?redirect=/`'a düşüyor; login sonrası `redirect` hedefine dönüyor.
- Logout → token temizleniyor, `/login`'e düşüyor.
- Sayfa yenilenince (token localStorage'da) oturum korunuyor (`fetchCurrentUser`).
- `npm run build` geçiyor.

## Doğrulama

```
npm run build
npm run dev   # login/logout/refresh/guard akışını elle test et
```
