# Çok Dilli SEO ve Kitle Kazanım Hunisi

> **Document type:** Growth and acquisition strategy — not a live SEO index report.  
> Companion: [product-strategy.md](./product-strategy.md) · [manifesto.md](./manifesto.md) · [roadmap.md](./roadmap.md)  
> Operations: [search-console-indexnow-runbook.md](./search-console-indexnow-runbook.md) · [gsc-campaign-url-list.md](./gsc-campaign-url-list.md)

---

## Özet

SectorCalc’ın müşteri kazanım motoru yalnızca reklam veya doğrudan marka bilinirliği üzerine kurulmaz. **Ana büyüme kanalı, çok dilli ve arama niyeti odaklı SEO mimarisidir.**

SEO yalnızca içerik üretimi değildir. SEO, **Free Tier → Pro Tier → doğrulanmış rapor ekonomisi**ne giden ana müşteri kazanım sistemidir.

---

## Locale kapsamı

Her SEO yüzeyi **6 locale** için ayrı çalışır:

| Locale | URL yapısı |
|--------|------------|
| English (default) | `/` (EN root — `/en` prefix yok) |
| Turkish | `/tr` |
| Arabic | `/ar` |
| German | `/de` |
| French | `/fr` |
| Spanish | `/es` |

Hub sayfalar statik/ISR cache policy ile hızlı açılır. Smoke gate: `smoke:locale-routes` (42 route).

---

## Arama niyeti hedefleri

Her hesaplama aracu için kullanıcıların Google’da **doğal olarak aradığı sorular** hedeflenir.

### Örnek sorgu kümeleri (TR / EN karışık örnekler)

| Sektör / konu | Örnek arama niyeti |
|---------------|-------------------|
| CNC | “CNC saatlik maliyet nasıl hesaplanır?” / “CNC hourly rate calculator” |
| Kaynak | “Kaynak teklif maliyeti nasıl bulunur?” / “welding bid cost” |
| OEE | “OEE nasıl hesaplanır?” / “OEE calculator formula” |
| CBAM | “CBAM maliyeti nasıl hesaplanır?” / “CBAM exposure check” |
| Enerji | “Kompresör hava kaçağı maliyeti nasıl bulunur?” |
| İK / maliyet | “İşveren toplam işçilik maliyeti nasıl hesaplanır?” |
| Finans | “Break-even point nasıl hesaplanır?” |
| Sheet metal | “Sheet metal quote nasıl hesaplanır?” |
| HVAC | “HVAC project margin nasıl bulunur?” |

### Uzun kuyruk şablonları (locale-native)

Her dilde aşağıdaki kalıplara uygun, **hızlı açılan, statik, SEO uyumlu** sayfalar üretilir:

- “X nasıl hesaplanır?” / “How to calculate X”
- “Y maliyeti nasıl bulunur?” / “How to find Y cost”
- “Z neden önemlidir?” / “Why Z matters for pricing”
- “X hesaplama formülü nedir?” / “X calculation formula explained”

**Kural:** Sayfa ilk paragrafta net cevabı verir; kullanıcıyı ilgili **ücretsiz hesaplama aracına** yönlendirir.

---

## Dönüşüm hunisi (7 adım)

```
Google arama niyeti
    ↓
SEO / authority sayfası (ilk paragraf = net cevap)
    ↓
Ücretsiz hesaplama aracı (Free Tier)
    ↓
İlk değer + risk sinyali (verdict / safe price sızdırılmaz)
    ↓
Premium Smart Form önerisi (public preview)
    ↓
Pro — Trust Trace, Validation Stamp, PDF/Excel, QR/hash, /verify
    ↓
Business / Enterprise — white-label, ekip, API, kurumsal doğrulama
```

| Adım | Kullanıcı deneyimi | Ürün katmanı |
|------|-------------------|--------------|
| 1 | Google’dan ilgili hesaplama sorusuyla gelir | SEO entry |
| 2 | Sayfa ilk paragrafta net cevabı verir | Authority / FAQ / cluster page |
| 3 | Ücretsiz hesaplama aracına yönlendirilir | Free tool |
| 4 | Ücretsiz araç ilk değeri gösterir | Free result (browser-first) |
| 5 | Daha güvenilir, belgeli sonuç için Premium Smart Form önerilir | Premium analyzer (public preview) |
| 6 | Pro: Trust Trace, Validation Stamp, PDF, QR/hash, `/verify` | Pro subscription |
| 7 | Business / Enterprise: white-label, ekip, API, kurumsal doğrulama | B2B packaging |

**Amaç trafik değil, doğru huni:** Her SEO sayfası ilgili free veya premium tool’a **tek net CTA** ile bağlanır.

---

## Free vs Premium SEO sınırı

| Free SEO sayfası / tool | Premium SEO / analyzer |
|-------------------------|------------------------|
| Risk sinyali, hızlı check | Verdict, safe price band, suggested action |
| 3–5 input, browser-first | Smart Form, scenario, validation |
| Indexlenebilir, geniş trafik | Teaser + public preview; Pro kilidi PDF/trust trace |
| Related premium CTA | Doğrudan `/tools/premium/[slug]` |

**Yasak:** Free sayfada safe price, full verdict veya PDF sızıntısı. Premium sayfada hard “sign in required” gate (public preview korunur).

---

## Teknik SEO ilkeleri

- **Index:** Çalışan sayfalar only; canonical + sitemap  
- **Hız:** Hub `force-static` + revalidate; LCP hedefi düşük  
- **Locale:** `hreflang` / locale routing (`as-needed` EN root)  
- **Structured intent:** Title, description, OG — Server Component / `generateMetadata`  
- **Authority:** `llms.txt`, indexable manifest, IndexNow (ops runbook)  
- **Measurement:** UTM + revenue events; GSC inspection matrix  

Detay: [seo-public-file-checklist.md](./seo-public-file-checklist.md), [week-2-seo-scale-up-rules.md](./week-2-seo-scale-up-rules.md).

---

## İçerik ↔ tool eşlemesi (örnek)

| SEO cluster | Free tool (discovery) | Premium analyzer (conversion) |
|-------------|----------------------|------------------------------|
| CNC maliyet / saat | `machine-time-calculator`, `cnc-cycle-time-calculator` | `cnc-quote-risk-analyzer` |
| Kaynak maliyet | `welding-cost-estimator` | `welding-bid-risk-analyzer` |
| OEE | `oee-calculator` | Sector-specific premium (cluster genişlemesi) |
| CBAM | `cbam-exposure-quick-check` | `cbam-compliance-verdict` |
| Kompresör enerji | `compressor-energy-cost-calculator` | `energy-efficiency-report` |
| İşçilik maliyeti | `salary-cost-calculator`, `hourly-rate-calculator` | Sector premium tools |
| Break-even | `break-even-calculator` | `profit-margin-calculator` / sector packs |
| Sheet metal | `sheet-metal-weight-calculator`, `laser-cutting-time-check` | `sheet-metal-quote-risk-tool` |
| HVAC margin | `hvac-tonnage-rule-check` | `hvac-project-margin-guard` |

Tam katalog: `npm run audit:revenue-tools` · 17-sector registry.

---

## Başarı metrikleri (SEO → revenue)

| Metrik | Anlam |
|--------|--------|
| Indexed Tier-1 URLs | Discovery çalışıyor |
| Locale hub 200 (42/42) | Global SEO surface sağlam |
| Free tool → premium CTA click | Huni adım 3→5 |
| `premium_analyzer_viewed` | Premium landing |
| Public preview → calculate | Smart Form engagement |
| Preview → Pro checkout | Revenue conversion |

Haftalık review: [conversion-review-playbook.md](./conversion-review-playbook.md).

---

## Roadmap bağlantısı

| Faz | SEO hunisi etkisi |
|-----|-------------------|
| P1 Catalog search | Discovery içinde arama |
| P2 Smart Form 27/27 | Premium landing tutarlılığı |
| P4 Trust Trace / `/verify` | Pro değer önerisi + paylaşılabilir rapor |
| P7 Case studies | Authority + long-tail proof |
| P11 Release gate | SEO surface kırılmadan deploy |

---

*Last updated: 2026-06-10*
