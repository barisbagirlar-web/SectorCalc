# SectorCalc SEO V3 — Faz 0 Baseline Raporu

Kaynak şartname: `SEO SARTNAMESI_V3_.txt`. Bu rapor Faz 0 gereği salt-okunur keşif sonucudur; runtime kodu değiştirmez.

## Framework ve mimari özeti

- Site: `https://sectorcalc.com`
- Site ID: `sectorcalc`
- Uygulama: Vite tabanlı statik build; vanilla JS + Lit bileşenleri.
- Hosting: Firebase Hosting.
- SEO SSOT: `seo/registry.mjs` + `seo/registry-data.mjs`.
- Registry mevcut baseline: 90 indexlenebilir URL; 25 yayınlanmış calculator.
- Render modeli: build-time statik HTML/SSG ağırlıklı. Hesaplama etkileşimi istemci tarafında çalışabilir; SEO başlıkları, açıklayıcı içerik ve crawlable yüzey build çıktısında üretilir.

## Route / sayfa envanteri

| Segment | Kaynak | Durum |
|---|---|---|
| Home / hub / pricing / site sayfaları | `seo/registry-data.mjs` | Registry SSOT içinde |
| Calculator sayfaları | `*-pro.html` kaynakları → pretty canonical `/calculator/...` | 25 published calculator |
| Diğer indexlenebilir içerikler | Registry kayıtları | Toplam indexlenebilir baseline 90 |
| Legacy calculator yolları | Registry `legacyPaths` | Canonical/redirect guardlarına bağlı |

Tam route listesi tek kaynak olarak `seo/registry-data.mjs` içinde tutulur; bu rapor ikinci bir route SSOT oluşturmaz.

## SEO dosya ve mekanizma keşfi

| Kontrol | Sonuç |
|---|---|
| robots.txt | MEVCUT; crawler policy ve release guardları ile korunuyor |
| sitemap.xml / sitemap üretimi | MEVCUT; `scripts/generate-sitemap.mjs` + sitemap integrity guard |
| SEO config | MEVCUT; `sites/sectorcalc/seo.config.json`, schema/defaults ve V6 governance |
| SEO registry | MEVCUT; `seo/registry.mjs` tek gerçek kaynak |
| Canonical üretimi | MEVCUT; registry canonicalPath ve SEO injection/verification zinciri |
| Structured data | MEVCUT; schema üretim/doğrulama scriptleri ve build guardları |
| Title/meta description | MEVCUT; registry + SEO injection zinciri |
| Internal link guard | MEVCUT; `verify:seo:links` ve ilgili build guardları |
| SEO preflight/conformance | MEVCUT; `seo:preflight`, `seo:conformance`, invariant registry |
| Cold-start / external-data güvenliği | MEVCUT; gerçek GSC/GA4 kanıtı yoksa fail-closed / low-confidence yaklaşımı |

## V3'e göre somut eksikler

- **EKSİK — Orta:** V3'ün isimlendirilmiş Faz 0–10 artefakt seti (`00_BASELINE_RAPORU.md`, faz raporları, final 360 raporu) tam değil.
- **EKSİK — Yüksek:** V3'ün tek-komut `npm run seo:full-audit` orkestrasyonu mevcut değil; kontroller çok sayıda ayrı komuta dağılmış.
- **EKSİK — Orta:** V3'ün `src/seo/types.ts` / page-state sözleşmesi isimleri mevcut SSOT ile birebir örtüşmüyor. Çözüm yeni paralel registry kurmak değil; V3 adapter katmanını mevcut `seo/registry.mjs` üzerine bağlamak olmalı.
- **EKSİK — Orta:** Faz 4 için ham HTML + hydration parity sonuçlarını tek raporda toplayan V3 uyum komutu eksik.
- **EKSİK — Orta:** Faz 5 için V3 biçiminde quality-contract/cannibalization/entity doğrulama birleşik raporu eksik; mevcut kalite alanları daha farklı modelde.
- **EKSİK — Orta:** Faz 8 log analizinde gerçek server/CDN log verisi repo içinde bulunmuyor. Kod iskeleti kurulabilir; gerçek crawl-waste/discovery-lag sonucu veri olmadan PASS sayılamaz.
- **EKSİK — Yüksek / dış veri:** Faz 9 GSC + GA4 + BigQuery gerçek bağlantısı bu repo oturumunda doğrulanmış değil. SQL ve sözleşmeler kurulabilir; gerçek gelir/incrementality sonucu uydurulamaz.
- **EKSİK — Orta:** Faz 10 birleşik forbidden-pattern + migration + final score raporu tek komutta yok.

## Güncel Google dokümantasyonuyla doğrulanan kurallar

- `noindex` etkili olacaksa URL robots.txt ile crawl'dan engellenmemelidir.
- Core Web Vitals iyi eşikleri LCP ≤2.5s, INP <200ms, CLS <0.1 ve değerlendirme 75. persentil yaklaşımıdır.
- Googlebot kimliği user-agent'a güvenilerek değil DNS/IP doğrulamasıyla teyit edilmelidir.
- Sitemap `lastmod` gerçek anlamlı değişimi temsil etmelidir.
- HowTo rich results artık Google Search'te desteklenen bir rich-result hedefi değildir.

## Şartname errata / uygulanabilirlik notu

V3 Faz 6, “Google Rich Results Test API” ile CI entegrasyonu istiyor. Güncel resmi Google Search dokümantasyonu Rich Results Test aracını sunuyor ancak genel amaçlı, belgelenmiş bir public Rich Results Test API sözleşmesi göstermiyor. Bu nedenle olmayan/özel endpoint uydurulmayacak. Faz 6'da lokal JSON-LD/schema parity + resmi test aracına manuel/staging doğrulama yolu uygulanacak; sahte API PASS raporu üretilmeyecek.

## Faz 0 kararı

Faz 0 keşif tamamlandı. Mevcut V6 altyapısı korunacak ve V3 gereklilikleri paralel SSOT oluşturmadan adapter/guard/rapor katmanı olarak uygulanacak. Kullanıcının bu turdaki “şartnameyi tam uygula” talimatı, Faz 1–10 için devam onayı olarak kabul edilmiştir.
