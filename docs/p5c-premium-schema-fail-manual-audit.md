# P5C — Premium Schema FAIL Manual Audit (P6A alias)

Bu doküman P5C adını taşır; uygulama script’i **P6A** (`audit-p6a-premium-schema-fail-manual.mjs`) ile aynı kapsamdadır.

## Amaç

12 `premium_schema_fail_manual` tool için formula contract + validation alignment — **yalnızca manuel review**, otomatik formül patch yok.

## Risk sınıfları

| Sınıf | Slug’lar |
|-------|----------|
| HIGH_RISK_MANUAL_ONLY | `pressure-vessel-wall-thickness-calculator`, `welded-bolted-connection-calculator`, `doviz-pozisyonu-kur-farki-riski-hesabi` |
| MEDIUM_RISK_ALIGNMENT | `profit-margin-calculator`, `heat-loss-calculator`, `material-waste-calculator`, `scrap-rate-calculator` |
| LOW_RISK_ESTIMATOR_ALIGNMENT | `cleaning-cost-estimator`, `cnc-minimum-safe-quote-analyzer`, `machine-hour-estimator`, `project-cost-estimator`, `return-rate-profit-erosion-tool` |

## Sprint eşlemesi

- **S1**: Manifest’te `premiumSchemaFailManual: 12` sayımı
- **S2/S3**: LOW_RISK_ESTIMATOR_ALIGNMENT — scaffold-only (contract alignment, formül core yok)
- **Manual only**: HIGH_RISK — sprint batch’lerine alınmaz

## Komut

```bash
npm run audit:p6a-premium-schema-fail
```

Çıktı: `scripts/.cache/p6a-premium-schema-fail-manual-audit.json`
