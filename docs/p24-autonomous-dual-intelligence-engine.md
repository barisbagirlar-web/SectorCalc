# P2.4 / P38 Autonomous Dual-Intelligence Calculation Repair & Reality Test Engine

## Overview

SectorCalc'in tüm calculation tool'larını otomatik tarayan, test eden, repair eden ve raporlayan otonom test sistemi.

## Architecture

### 13-Gate Test Pipeline

1. **Technical Build Gate** - `npm run build` başarılı mı?
2. **Type Safety Gate** - `npx tsc --noEmit` TypeScript hataları var mı?
3. **Formula Contract Gate** - Her tool'un geçerli FormulaContract'ı var mı?
4. **Unit Consistency Gate** - Birimler tutarlı mı? (m/ft, kg/lb, $/€)
5. **Boundary Test Gate** - Boundary conditions test edilmiş mi?
6. **Scenario Test Gate** - Gerçek dünya senaryoları test edilmiş mi?
7. **Oracle Test Gate** - Sonuçlar oracle/reference ile karşılaştırılmış mı?
8. **Global Sanity Gate** ⭐ - Sonuç global mantığa uygun mu?
9. **Sector Reality Gate** ⭐ - Sonuç sektörel gerçekliğe uygun mu?
10. **Premium/Free Split Gate** - Premium/free ayrımı doğru mu?
11. **Locale Gate** - Tüm diller için mesajlar var mı?
12. **Mobile UX Gate** - Mobil layout overflow yok mu?
13. **Smoke Gate** - Smoke testleri geçiyor mu?

### Test Sonuçları

Her tool için 4 sonuçtan biri:

- **PASS** ✅ - Deploy candidate, tüm testler geçti
- **WARN** ⚠️ - Deploy candidate, ama uyarılar var
- **FAIL** ❌ - Deploy blocked, kritik hatalar var
- **QUARANTINE** 🚫 - Safe mode, yanlış sonuç gösterme riski

### Auto-Repair Capabilities

Sistem otomatik düzeltebilir (kullanıcı onayı gerekmez):

✅ **Auto-repair yapılabilir:**
- Missing required input
- Wrong input type
- Missing validation
- Unit mismatch
- FormulaContract dependency mismatch
- Result schema mismatch
- Missing locale key
- Mobile layout overflow
- RTL layout issue
- Long label overflow
- Missing test fixture
- Weak global sanity rule
- Weak sector reality rule

❌ **Auto-repair yapılamaz:**
- Route/slug change
- Stripe/Auth/Firestore secret
- Firebase/Cloudflare config
- Heavy dependency
- FormulaContract dışı hesaplama

## Global Sanity Rules

`src/lib/formula-governance/gates/global-sanity-gate.ts`

Tüm hesaplamalara uygulanan evrensel mantık kuralları:

1. **No Negative Costs** - Maliyet, fiyat negatif olamaz
2. **Percentage Range** - Yüzdeler 0-100% arasında (veya kontrollü)
3. **OEE Max 100%** - OEE %100'ü geçemez (fiziksel impossibility)
4. **No Negative Carbon** - Karbon emisyonu negatif olamaz
5. **No Negative Break-Even** - Başabaş noktası negatif olamaz
6. **No Negative Time** - Süre değerleri negatif olamaz
7. **No Negative Distance** - Mesafe negatif olamaz
8. **No Negative Energy** - Enerji tüketimi negatif olamaz
9. **Employer Cost ≥ Net Salary** - İşveren maliyeti net maaştan düşük olamaz
10. **No Negative Material** - Malzeme ağırlık/hacim negatif olamaz

## Sector Reality Rules

`src/lib/formula-governance/gates/sector-reality-gate.ts`

Sektöre özel gerçeklik kontrolleri:

### CNC / Manufacturing
- Machine rate: $50-$300/hr (realistic range)
- Scrap rate: 0%-15% typical
- Setup time: 5min-4hrs typical

### Logistics / Transport
- Vehicle speed: 0-120 km/h typical
- Fuel consumption: 5-50 L/100km typical

### Restaurant / Food
- Food cost percentage: 20%-40% typical
- Food waste: 0%-15% typical

### Energy / Electricity
- Power factor: 0-1 (by definition)
- kWh cost: $0.05-$0.50 typical

### Labor / HR
- Hourly rate: $10-$150 typical
- Min wage compliance

### Construction
- Area: >0, reasonable size checks

## Usage

### Run Full Engine

```bash
npm run audit:p24-autonomous-engine
```

Bu komut:
1. Tüm tool'ları bulur (free, premium, revenue)
2. Her tool için 13 gate'i çalıştırır
3. Auto-repair dener (gerekirse)
4. PASS/WARN/FAIL/QUARANTINE raporu üretir
5. `docs/p24-engine-report-{runId}.json` dosyasına kaydeder

### Exit Codes

- `0` - All PASS or WARN (deployment ready)
- `1` - Any FAIL (deployment blocked)

### Report Format

```json
{
  "runId": "p24-1234567890",
  "timestamp": "2026-06-11T...",
  "summary": {
    "total": 131,
    "pass": 120,
    "warn": 8,
    "fail": 2,
    "quarantine": 1
  },
  "results": [
    {
      "toolSlug": "cnc-quote-risk-analyzer",
      "toolType": "premium",
      "overallStatus": "PASS",
      "gates": [
        {
          "gate": "technical-build",
          "status": "PASS",
          "message": "Build successful"
        },
        {
          "gate": "global-sanity",
          "status": "PASS",
          "message": "Global sanity checks passed"
        }
      ],
      "timestamp": "2026-06-11T..."
    }
  ]
}
```

## Integration with CI/CD

### Pre-Deploy Check

```bash
#!/bin/bash
# .github/workflows/deploy.yml

npm run lint
npx tsc --noEmit
npm run test:formulas
npm run audit:p24-autonomous-engine

if [ $? -eq 0 ]; then
  echo "✅ All gates passed - deploying"
  firebase deploy --only hosting
else
  echo "❌ Gates failed - deployment blocked"
  exit 1
fi
```

### Scheduled Audit

```bash
# Run daily at 3am
0 3 * * * cd /path/to/SectorCalc && npm run audit:p24-autonomous-engine
```

## Development Workflow

### Add New Tool

1. Create FormulaContract
2. Implement calculator
3. Add test fixtures
4. Run: `npm run audit:p24-autonomous-engine`
5. Fix any FAIL/QUARANTINE issues
6. Commit when PASS/WARN

### Modify Existing Tool

1. Make changes
2. Run: `npm run audit:p24-autonomous-engine`
3. Check if status changed
4. Auto-repair will fix safe issues
5. Manual fix for critical issues

### Add New Gate

1. Create gate logic in `src/lib/formula-governance/gates/`
2. Add to `GATES` array in main engine
3. Implement `runXxxGate()` function
4. Add auto-repair logic if applicable
5. Test with: `npm run audit:p24-autonomous-engine`

### Add New Sanity Rule

#### Global Rule

Edit `src/lib/formula-governance/gates/global-sanity-gate.ts`:

```typescript
{
  id: "my-new-rule",
  description: "Description of rule",
  check: (result) => {
    // Your logic
    if (someCondition) {
      return {
        passed: false,
        reason: "Why it failed",
        severity: "error", // or "warning"
      };
    }
    return { passed: true, severity: "info" };
  },
}
```

#### Sector Rule

Edit `src/lib/formula-governance/gates/sector-reality-gate.ts`:

```typescript
{
  id: "my-sector-rule",
  sectors: ["cnc", "manufacturing"], // Which sectors
  description: "Description",
  check: (result, toolSlug) => {
    // Your logic
  },
}
```

## Architecture Notes

### Why 13 Gates?

Comprehensive coverage:
- **Build/Type** (2) - Code compiles
- **Contract** (1) - Schema valid
- **Units/Boundary/Scenario/Oracle** (4) - Calculation correct
- **Sanity/Reality** (2) - Result makes sense
- **Split/Locale/Mobile** (3) - UX correct
- **Smoke** (1) - Integration works

### Why Auto-Repair?

- Saves developer time
- Enforces consistency
- Catches common errors early
- Safe changes don't need review

### Why QUARANTINE Status?

Some tools may have correct code but produce questionable results:
- Put in safe mode (show disclaimer)
- Don't block deployment (tool still accessible)
- Flag for manual review

## Roadmap

### Phase 1 (Current) ✅
- Master engine framework
- Global Sanity gate
- Sector Reality gate
- Basic auto-repair
- PASS/WARN/FAIL/QUARANTINE

### Phase 2 (Next)
- Full auto-repair implementation
- Locale gate enforcement
- Mobile UX gate automation
- Integration with existing test suites

### Phase 3 (Future)
- ML-based reality detection
- Auto-generate test fixtures
- Self-healing calculations
- Predictive quarantine

## Files

```
scripts/
  └─ p24-autonomous-dual-intelligence-engine.ts  (Master orchestrator)

src/lib/formula-governance/gates/
  ├─ global-sanity-gate.ts                       (10 global rules)
  └─ sector-reality-gate.ts                      (Sector-specific rules)

docs/
  └─ p24-engine-report-{runId}.json              (Generated reports)
```

## Testing

```bash
# Run full engine
npm run audit:p24-autonomous-engine

# Run existing tests (integrated by engine)
npm run test:formulas
npm run lint
npx tsc --noEmit

# Smoke tests
npm run smoke:all-calculation-forms
npm run smoke:locale-routes
npm run smoke:browser-routes
```

## Metrics

Engine tracks:
- Total tools tested
- PASS/WARN/FAIL/QUARANTINE counts
- Auto-repair success rate
- Gate-specific failure patterns
- Sector coverage

## Support

**Report false positives:**
- If a rule incorrectly fails a valid calculation
- Open issue with tool slug + gate name
- We'll adjust the rule

**Request new rules:**
- If you spot a common error pattern
- Propose rule in GitHub issue
- We'll add to appropriate gate

---

**Status:** ✅ ACTIVE  
**Version:** P2.4 / P38  
**Last Updated:** 2026-06-11
