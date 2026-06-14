# P6B/P6C DeepSeek Full Formula Factory Report

## Summary

* Phase: P6C Batch 2 (post Batch 1 commit `615e30c`)
* Total tools: 474
* Fully working before batch: 71
* Fully working after batch: 72
* Auto patch ready remaining: 0
* Patched in P6C batch: 1
* Manual expert required: 46
* Blocked safety: 1
* Revenue boundary: PASS
* Deploy executed: no

## P6C Batch 2 Patched Tools

| Slug | Input | Formula | Validation | Oracle | Renderer | Result |
|------|-------|---------|------------|--------|----------|--------|
| welding-bid-risk-analyzer | PASS | PASS | PASS | PASS | PASS | PASS |

## Identifier-Unsafe Manual Queue

| Slug | Reason | Strategy |
|------|--------|----------|
| 3d-print-job-margin-tool | Slug starts with digit; `toPascalCase` yields invalid TS identifier (`3dPrintJobMarginTool`) | Manual expert patch with safe export alias (e.g. `ThreeDPrintJobMarginTool`) or slug rename in schema registry |

## Formula-Source Quarantine (active-route, schema-backed)

| Slug | Reason |
|------|--------|
| energy-efficiency-report | formulaSourceAudit: QUARANTINE |
| renovation-budget-optimizer | formulaSourceAudit: QUARANTINE |
| trip-budget-optimizer | formulaSourceAudit: QUARANTINE |

## Manual Expert Queue

| Slug | Reason |
|------|--------|
| 7-israf-muda-avcisi-parasal-karsilik-calculator | HIGH_ENGINEERING_SAFETY |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | HIGH_FINANCE_LEGAL_TAX |
| ai-uyum-ve-etik-denetim-maliyet-eu-ai-act-calculator | HIGH_ENGINEERING_SAFETY |
| annual-leave-severance-notice-calculator | HIGH_ENGINEERING_SAFETY |
| auto-repair-comeback-cost | HIGH_ENGINEERING_SAFETY |
| auto-repair-parts-labor-quote-calculator | HIGH_ENGINEERING_SAFETY |
| basincli-kap-cidar-kalinligi-hesabi | HIGH_ENGINEERING_SAFETY |
| bolt-tightening-torque-calculator | HIGH_ENGINEERING_SAFETY |
| break-even-safety-margin-calculator | HIGH_ENGINEERING_SAFETY |
| carbon-footprint-compliance-risk | HIGH_REGULATORY |
| cbam-compliance-verdict | HIGH_REGULATORY |
| cbam-exposure-quick-check | HIGH_REGULATORY |
| cbam-karbon-sinir-vergisi-ve-ihracat-maliyet-etkisi-calculator | HIGH_FINANCE_LEGAL_TAX |
| cbam-unit-product-carbon-footprint-calculator | HIGH_REGULATORY |
| civata-sikma-torku-hesaplama | HIGH_ENGINEERING_SAFETY |
| doviz-pozisyonu-kur-farki-riski-hesabi | HIGH_FINANCE_LEGAL_TAX |
| electrical-labor-estimator | HIGH_ENGINEERING_SAFETY |
| electrical-panel-rework-cost | HIGH_ENGINEERING_SAFETY |
| faiz-kredi-yapisi-ve-ulke-risk-primi-calculator | HIGH_FINANCE_LEGAL_TAX |
| feed-efficiency-analyzer | BLOCKED_UNKNOWN |
| fire-system-flow-hydrant-calculator | HIGH_ENGINEERING_SAFETY |
| fx-hedging-stratejisi-forward-option-natural-maliyet-fayda-calculator | HIGH_FINANCE_LEGAL_TAX |
| gelir-vergisi-dilimleri-hesaplama | HIGH_FINANCE_LEGAL_TAX |
| hidrolik-pompa-gucu-hesaplama | HIGH_ENGINEERING_SAFETY |
| hidrolik-silindir-itme-kuvveti-hesabi | HIGH_ENGINEERING_SAFETY |
| hidrolik-sistem-isinma-ve-sogutma-enerji-kayip-calculator | HIGH_ENGINEERING_SAFETY |
| hydraulic-pneumatic-cylinder-force-calculator | HIGH_ENGINEERING_SAFETY |
| ic-verim-orani-irr-hesaplama | HIGH_ENGINEERING_SAFETY |
| investment-payback-npv-calculator | HIGH_ENGINEERING_SAFETY |
| is-sagligi-ve-guvenligi-ceza-hesaplama | HIGH_ENGINEERING_SAFETY |
| istinat-duvari-yaklasik-beton-hesabi | HIGH_ENGINEERING_SAFETY |
| kaynakli-baglanti-kose-kut-mukavemet-hesabi | HIGH_ENGINEERING_SAFETY |
| kdv-tevkifati-hesaplama | HIGH_FINANCE_LEGAL_TAX |
| kredi-erken-kapama-cezasi-hesaplama | HIGH_FINANCE_LEGAL_TAX |
| leasing-kiralama-maliyet-karsilastirma | HIGH_FINANCE_LEGAL_TAX |
| leasing-vs-satin-alma-finansal-karsilastirma-calculator | HIGH_FINANCE_LEGAL_TAX |
| legal-interest-fee-calculator-pro | HIGH_FINANCE_LEGAL_TAX |
| mtv-motorlu-tasitlar-vergisi-hesaplama | HIGH_FINANCE_LEGAL_TAX |
| pnomatik-silindir-kuvvet-hesabi | HIGH_ENGINEERING_SAFETY |
| pressure-vessel-wall-thickness-calculator | HIGH_ENGINEERING_SAFETY |
| siber-guvenlik-yatirimi-ve-breach-risk-maliyet-calculator | HIGH_ENGINEERING_SAFETY |
| stopaj-hesaplama-kira-serbest-meslek | HIGH_FINANCE_LEGAL_TAX |
| transfer-pricing-ve-sinir-otesi-vergi-optimizasyon-calculator | HIGH_FINANCE_LEGAL_TAX |
| welded-bolted-connection-calculator | HIGH_ENGINEERING_SAFETY |
| yangin-merdiveni-kacis-yolu-genisligi-hesabi | HIGH_ENGINEERING_SAFETY |
| yangin-tupu-dolap-debisi-hesaplama | HIGH_ENGINEERING_SAFETY |

## Blocked Safety Queue

| Slug | Reason |
|------|--------|
| feed-efficiency-analyzer | BLOCKED_UNKNOWN |

## Revenue Boundary

| Check | Expected | Actual |
| paymentEligible | 22 | 22 |
| formulaGateEligible | 22 | 22 |
| freePaymentEligible | 0 | 0 |
| feed-efficiency-analyzer | blocked | blocked |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | locked | locked |
