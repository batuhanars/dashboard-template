# M7 — Polish & Template

**Status:** TODO
**Önkoşul:** M6.
**İlgili contract'lar:** PROJECT.md (Definition of Done).

## Hedef

Template'i "Use this template" akışına hazır hale getir: temizlik, README, env örnekleri, son kalite geçişi. Bu milestone bitince template GitHub'a push'a ve demo'ya hazır.

## Adımlar

- [ ] **1. Scaffold temizliği:** Kullanılmayan scaffold artıkları (`src/assets/hero.png`, `vue.svg`, `vite.svg` kullanılmıyorsa) sil. Ölü kod, geçici smoke view'lar, M4'teki test view'ı kaldır.
- [ ] **2. README.md (kök):** "Use this template" sonrası kurulum: gereksinimler, `npm install`, env kurulumu, `npm run dev/build/preview`, mock→gerçek API geçişi (`VITE_USE_MOCKS=false` + `VITE_API_BASE_URL`), klasör yapısı özeti, customization rehberi (showcase sayfalarını domain'e uyarlama).
- [ ] **3. .env.example doğrula:** `VITE_USE_MOCKS`, `VITE_API_BASE_URL`, `VITE_APP_NAME` mevcut ve açıklamalı.
- [ ] **4. SPA fallback:** `public/.htaccess` (Plesk/Apache deploy senaryosu için SPA fallback). `vite.config.ts` `base` yolu not edilir (gerekirse müşteri projesinde ayarlanır).
- [ ] **5. Lint/format geçişi:** `npx prettier --write .` ile tüm dosyalar formatlanır. (ESLint config kurulduysa `lint` de çalıştırılır.)
- [ ] **6. Son DoD kontrolü:** PROJECT.md'deki Definition of Done listesinin tamamı işaretlenir; her madde elle doğrulanır.
- [ ] **7. "Use this template" simülasyonu:** Projeyi temiz bir kopyaya clone'layıp (veya zihinsel olarak) 1-2 saatte demo'ya hazır olma hedefini doğrula; takılınan yer varsa README'ye not düş.
- [ ] **8. Demo verisi gözden geçir:** Mock data müşteriye gösterilecek kalitede mi (gerçekçi isimler, tutarlı tarihler, mantıklı KPI'lar).

## Kabul kriterleri

- PROJECT.md Definition of Done'ın tamamı sağlanıyor.
- `npm run build` temiz; `npm run preview` ile prod çıktısı çalışıyor.
- README clone sonrası kurulumu eksiksiz anlatıyor.
- Scaffold artığı / ölü kod kalmadı.
- Dark mode, TR/EN, auth, tüm showcase sayfaları sorunsuz.

## Doğrulama

```
npm run build
npm run preview   # prod build'i son kez gez
```

## Sonrası (PM/kullanıcı)

- GitHub'a push + repository ayarlarından **Template repository** işaretle.
- Vault'taki master dosyaya geriye dönük değerlendirme yaz (süre, hangi paket değer kattı, vb.).
