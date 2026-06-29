# P5B — DeepSeek Full Tool Scan + Premium Readiness

Generated: 2026-06-13T22:32:43.405Z

## Summary

- Total tools: 479
- Active routes: 328
- Category-only: 151
- PASS / WARN / FAIL / QUARANTINE: 33/219/76/151
- paymentEligible: 22
- formulaGateEligible: 22
- free paymentEligible: 0
- DeepSeek status: ok

## Premium transition map

| Segment | Count |
|---------|-------|
| premium_ready | 22 |
| near_premium | 5 |
| premium_schema_fail_manual | 12 |
| free_active_missing_backing | 136 |
| category_only_quarantine | 151 |
| guide_oracle_missing | 473 |
| payment_locked_safe | 457 |
| deepseek_auto_repair_candidate | 190 |

## Priority batches

### P6: Premium-schema FAIL + formula contract alignment
- Tools: 12
- Goal: Formula contract + validation alignment — manual review required

### P7: Quarantine / category-only (151)
- Tools: 151
- Goal: Decide route wiring vs category stub retention

### P8: Guide spec + oracle gaps
- Tools: 322
- Goal: Premium UX + reliable test surface

### P9: Payment / Billing
- Tools: 0
- Goal: Separate safe phase — not touched in P5B
- Status: deferred (P5B does not touch payment)

### P10: i18n / mobile / RTL / long label cleanup
- Tools: 0
- Goal: Locale and mobile label quality

## First 25 priority tools

- **textile-fabric-waste-risk** (guide_oracle_missing) — auto_repair
- **cleaning-cost-estimator** (premium_schema_fail_manual) — manual_review
- **cnc-minimum-safe-quote-analyzer** (premium_schema_fail_manual) — manual_review
- **cnc-takim-yolu-bos-kesim-suresi-calculator** (category_only_quarantine) — route_wiring
- **cobot-vs-manuel-iscilik-karsilastirma-calculator** (category_only_quarantine) — route_wiring
- **cok-ulke-veri-gizlilik-uyum-ve-ceza-riski-calculator** (category_only_quarantine) — route_wiring
- **cpk-ppk-hata-maliyeti-ppm-calculator** (category_only_quarantine) — route_wiring
- **degisim-changeover-matrisi-ve-sekans-optimizasyon-calculator** (category_only_quarantine) — route_wiring
- **depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator** (category_only_quarantine) — route_wiring
- **dijital-ikiz-vs-fiziksel-deneme-maliyet-calculator** (category_only_quarantine) — route_wiring
- **dikim-hatti-dengeleme-ve-operasyon-suresi-calculator** (category_only_quarantine) — route_wiring
- **dokum-yolluk-cikici-verim-ve-ergitme-enerji-kayip-calculator** (category_only_quarantine) — route_wiring
- **dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator** (category_only_quarantine) — route_wiring
- **dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator** (category_only_quarantine) — route_wiring
- **egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator** (category_only_quarantine) — route_wiring
- **msa-gage-r-r-yanlis-karar-maliyet-calculator** (category_only_quarantine) — route_wiring
- **mtbf-mttr-ve-kullanilabilirlik-finansal-calculator** (category_only_quarantine) — route_wiring
- **mtm-metot-zaman-olcumu-ve-ergonomi-sure-calculator** (category_only_quarantine) — route_wiring
- **musteri-kaybi-churn-ve-kaybedilen-gelir-calculator** (category_only_quarantine) — route_wiring
- **musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator** (category_only_quarantine) — route_wiring
- **proje-nakit-akisi-ve-ilerleme-hakedis-optimizasyon-calculator** (category_only_quarantine) — route_wiring
- **proses-emniyet-ventili-ve-tahliye-kapasite-calculator** (category_only_quarantine) — route_wiring
- **raf-omru-ve-fire-optimizasyon-calculator** (category_only_quarantine) — route_wiring
- **reaktor-kazan-parti-verimi-ve-isi-dengesi-calculator** (category_only_quarantine) — route_wiring
- **recete-maliyeti-ve-alternatif-hammadde-etki-calculator** (category_only_quarantine) — route_wiring

## First 10 low-risk auto repair candidates

- agriculture-irrigation-yield-loss: guide_hide
- auto-shop-margin-leak-detector: guide_hide
- crop-yield-loss-analyzer: guide_hide
- dairy-profit-detector: guide_hide
- hvac-project-margin-guard: guide_hide
- landscaping-contract-profit-tool: guide_hide
- meal-planning-verdict: guide_hide
- menu-profit-leak-detector: guide_hide
- millwork-bid-risk-analyzer: guide_hide
- painting-job-profit-verdict: guide_hide

## First 10 manual review candidates

- cleaning-cost-estimator (high): manual_review
- cnc-minimum-safe-quote-analyzer (high): manual_review
- machine-hour-estimator (high): manual_review
- project-cost-estimator (high): manual_review
- return-rate-profit-erosion-tool (high): manual_review
- 3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator (high): route_wiring
- 3b-baski-parti-optimizasyonu-ve-yuvalama-calculator (high): route_wiring
- 3b-baski-vs-talasli-imalat-basabas-noktasi-calculator (high): route_wiring
- 5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator (high): route_wiring
- agv-amr-otonom-tasima-geri-donus-calculator (high): route_wiring

## Quarantine summary

- Category-only quarantine: 151
- Recover-now (quarantine report): 0

## Payment safety

- paymentEligible (control plane): 22
- formulaGateEligible: 22
- free paymentEligible: 0

## Problem slug safety

- Slug: abonelik-yazilim-cloud-yillik-maliyet-hesabi
- paymentEligible: false (must stay false)
- formulaGateEligible: false (must stay false)

## P6 recommendation (premium-schema FAIL)

- cleaning-cost-estimator
- cnc-minimum-safe-quote-analyzer
- machine-hour-estimator
- project-cost-estimator
- return-rate-profit-erosion-tool
- pressure-vessel-wall-thickness-calculator
- welded-bolted-connection-calculator
- profit-margin-calculator
- doviz-pozisyonu-kur-farki-riski-hesabi
- heat-loss-calculator
- material-waste-calculator
- scrap-rate-calculator
