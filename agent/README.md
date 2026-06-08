# Agent Handoff — Dashboard Template

Bu klasör, **geliştirmeyi yürütecek geliştirici-agent (Sonnet)** için hazırlanmış kendi içinde yeterli (self-contained) bir spesifikasyon paketidir. Vault'a veya harici nota ihtiyaç yoktur; gereken her karar burada gömülüdür.

## Roller

- **Proje Yöneticisi (Opus):** Bu klasörü üretti. Planı, contract'ları ve görevleri tanımlar. Milestone sınırlarında inceleme yapar.
- **Geliştirici (Sonnet):** `tasks/` altındaki görevleri sırayla yürütür, `contracts/` kurallarına harfiyen uyar.

## Dosya hiyerarşisi ve okuma sırası

1. **`PROJECT.md`** — Her oturumun başında oku. Projenin amacı, mevcut durum, stack, Definition of Done.
2. **`CONVENTIONS.md`** — Her zaman geçerli referans. Naming, auto-import kuralları, i18n key formatı, kod stili. Kod yazarken sürekli başvur.
3. **`contracts/`** — İlgili görev hangi contract'a dokunuyorsa onu oku. Bunlar **bağlayıcıdır** — tip isimleri, store şekilleri, prop/emit imzaları burada sabittir. Bir contract'tan sapman gerekiyorsa ÖNCE PM'e sor, kendi başına değiştirme.
4. **`tasks/Mx-*.md`** — Sıralı milestone görevleri. Aynı anda yalnızca bir milestone üzerinde çalış.

## Yürütme protokolü

1. Sıradaki `tasks/Mx-*.md` dosyasını aç. Üstündeki `Status` alanını `IN_PROGRESS` yap.
2. Görevdeki alt adımları sırayla tamamla. Her adımın işaret ettiği contract'ı uygula.
3. Milestone bitince **doğrulama kapısını** geç:
   - `npm run build` — type-check + build hatasız geçmeli (`vue-tsc -b && vite build`).
   - Görev dosyasındaki "Kabul Kriterleri"nin tamamı sağlanmalı.
   - UI değişikliği varsa `npm run dev` ile gözle doğrula (dark mode flicker dahil).
4. Görevin `Status`'ünü `DONE` yap, tamamlanan alt adımları işaretle.
5. **Milestone sınırında DUR** ve PM/kullanıcıya kısa özet ver. Bir sonraki milestone'a geçmeden onay bekle.

## Kapsam sınırları (önemli)

- **Klasör yapısını topluca önden oluşturma.** Her dosya/dizin ilgili görevde ihtiyaç duyulduğunda oluşturulur. Boş iskelet dizinler açma.
- **Contract dışına çıkma.** Tip adı, env değişkeni adı, store action adı gibi şeyler contract'larda sabit. Latitude (serbestlik) tanınan yerler contract'larda açıkça `[Serbest]` ile işaretli.
- **Mock-first.** Her şey `VITE_USE_MOCKS=true` ile çalışmalı; gerçek backend yok.

## Mevcut durum (PM tarafından doğrulandı)

- **M0 — Init: TAMAMLANDI.** Vite + TS + Tailwind v4 + shadcn-vue (new-york / zinc / inter / lucide) kurulu. Path alias `@/` (vite + her iki tsconfig). `unplugin-auto-import` + `unplugin-vue-components` yapılandırıldı. Prettier + tailwind plugin ayarlı. `src/lib/utils.ts` (`cn`) hazır.
- **Sıradaki: M1 — Foundation.**
