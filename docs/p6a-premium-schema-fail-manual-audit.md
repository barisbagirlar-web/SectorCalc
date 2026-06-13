# P6A — Premium Schema FAIL Manual Formula Alignment Audit

Generated: 2026-06-13T22:29:03.221Z

## Summary

- Candidates: 12
- HIGH_RISK manual only: 3
- MEDIUM risk alignment: 4
- LOW risk estimator alignment: 5
- Can auto-patch safely: 0
- Manual review required: 12
- Structural schema/contract mismatch: 8
- P6A apply mode: audit only

## Candidate table

| Slug | Risk | Verdict | Schema | Validation | Contract | Auto patch |
|------|------|---------|--------|------------|----------|------------|
| cleaning-cost-estimator | LOW_RISK_ESTIMATOR_ALIGNMENT | WARN | no | no | yes | no |
| cnc-minimum-safe-quote-analyzer | LOW_RISK_ESTIMATOR_ALIGNMENT | WARN | no | no | no | no |
| machine-hour-estimator | LOW_RISK_ESTIMATOR_ALIGNMENT | WARN | no | no | no | no |
| project-cost-estimator | LOW_RISK_ESTIMATOR_ALIGNMENT | WARN | no | no | no | no |
| return-rate-profit-erosion-tool | LOW_RISK_ESTIMATOR_ALIGNMENT | WARN | yes | no | yes | no |
| pressure-vessel-wall-thickness-calculator | HIGH_RISK_MANUAL_ONLY | FAIL | yes | no | yes | no |
| welded-bolted-connection-calculator | HIGH_RISK_MANUAL_ONLY | FAIL | yes | no | yes | no |
| profit-margin-calculator | MEDIUM_RISK_ALIGNMENT | FAIL | yes | no | yes | no |
| doviz-pozisyonu-kur-farki-riski-hesabi | HIGH_RISK_MANUAL_ONLY | FAIL | yes | no | yes | no |
| heat-loss-calculator | MEDIUM_RISK_ALIGNMENT | FAIL | yes | no | yes | no |
| material-waste-calculator | MEDIUM_RISK_ALIGNMENT | FAIL | yes | no | yes | no |
| scrap-rate-calculator | MEDIUM_RISK_ALIGNMENT | FAIL | yes | no | yes | no |

## HIGH_RISK manual only (P6C)

- **pressure-vessel-wall-thickness-calculator**: Engineering manual review only — no automated formula patch in P6A/P6B.
  - mismatches: [{"kind":"contract_not_in_schema","fields":["processMinutes","waitMinutes","transportMinutes"]}]
- **welded-bolted-connection-calculator**: Engineering manual review only — no automated formula patch in P6A/P6B.
  - mismatches: [{"kind":"contract_not_in_schema","fields":["t1","t2","t3","t4","assemblyLimit"]}]
- **doviz-pozisyonu-kur-farki-riski-hesabi**: Engineering manual review only — no automated formula patch in P6A/P6B.
  - mismatches: [{"kind":"schema_not_in_contract","fields":["plannedDistanceKm","actualDistanceKm","fuelCostPerKm","idleHours","hourlyCost"]},{"kind":"contract_not_in_schema","fields":["foreignExposure","fxMovePercent","faceValue","discountRate"]}]

## LOW_RISK safe alignment candidates

- cleaning-cost-estimator: autoPatch=false (missing_schema_or_contract) — P6B contract/schema reconcile plan
- cnc-minimum-safe-quote-analyzer: autoPatch=false (missing_schema_or_contract) — P6B contract/schema reconcile plan
- machine-hour-estimator: autoPatch=false (missing_schema_or_contract) — P6B contract/schema reconcile plan
- project-cost-estimator: autoPatch=false (missing_schema_or_contract) — P6B contract/schema reconcile plan
- return-rate-profit-erosion-tool: autoPatch=false (formula_semantics_mismatch_not_field_rename) — P6B contract/schema reconcile plan

## Missing files by candidate

- cleaning-cost-estimator: schema, validation, resultRenderer
- cnc-minimum-safe-quote-analyzer: schema, validation, formulaContract
- machine-hour-estimator: schema, validation, formulaContract, resultRenderer
- project-cost-estimator: schema, validation, formulaContract, resultRenderer
- return-rate-profit-erosion-tool: validation, resultRenderer
- pressure-vessel-wall-thickness-calculator: validation, calculatorModule, resultRenderer
- welded-bolted-connection-calculator: validation, calculatorModule, resultRenderer
- profit-margin-calculator: validation, calculatorModule, resultRenderer
- doviz-pozisyonu-kur-farki-riski-hesabi: validation, calculatorModule, resultRenderer
- heat-loss-calculator: validation, calculatorModule, resultRenderer
- material-waste-calculator: validation, calculatorModule, resultRenderer
- scrap-rate-calculator: validation, calculatorModule, resultRenderer

## Field mismatches

- **return-rate-profit-erosion-tool**
  - schema_not_in_contract: monthlyApiCalls, costPerThousandCalls, monthlyRevenue, computeCost, storageCost
  - contract_not_in_schema: productPrice, productCost, shippingCost, returnRate, paymentFeeRate, adCostPerSale, materialCost, laborHours, laborRate, consumablesCost
- **pressure-vessel-wall-thickness-calculator**
  - contract_not_in_schema: processMinutes, waitMinutes, transportMinutes
- **welded-bolted-connection-calculator**
  - contract_not_in_schema: t1, t2, t3, t4, assemblyLimit
- **profit-margin-calculator**
  - schema_not_in_contract: materialCost, laborCost, machineCost, energyCost, overheadCost, wasteRate, setupTimeCost, shippingCost, paymentTermCost, targetMarginRate
  - contract_not_in_schema: sellingPrice, cost, fixedCost, unitPrice, variableCost
- **doviz-pozisyonu-kur-farki-riski-hesabi**
  - schema_not_in_contract: plannedDistanceKm, actualDistanceKm, fuelCostPerKm, idleHours, hourlyCost
  - contract_not_in_schema: foreignExposure, fxMovePercent, faceValue, discountRate
- **heat-loss-calculator**
  - schema_not_in_contract: currentKwh, targetKwh, energyRate, peakKwh, peakRate, demandCharge
  - contract_not_in_schema: uValue, areaM2, tempDifferenceC, income, rent, food, transport, utilities, costPerM2, contingencyPercent
- **material-waste-calculator**
  - schema_not_in_contract: monthlyIngredientCost, wasteRate, targetWasteRate, monthlyRevenue, grossMargin
  - contract_not_in_schema: inputMaterialKg, goodOutputKg, value1, value2, value3, value4, value5, cows, litersPerCow, milkPrice
- **scrap-rate-calculator**
  - schema_not_in_contract: materialCost, scrapRate, targetScrapRate, reworkHours, laborRate, finishingCost
  - contract_not_in_schema: scrapUnits, totalUnits, areaHa, seedKgPerHa, lengthM, widthM, thicknessMm, densityKgM3

## P6B recommended first 5 patches

- cleaning-cost-estimator: schema_or_slug_alias — P6B contract/schema reconcile plan
- cnc-minimum-safe-quote-analyzer: contract_and_schema_plan — P6B contract/schema reconcile plan
- heat-loss-calculator: contract_schema_reconcile — P6B contract/schema reconcile plan
- machine-hour-estimator: contract_and_schema_plan — P6B contract/schema reconcile plan
- material-waste-calculator: contract_schema_reconcile — P6B contract/schema reconcile plan

## Payment / Formula Gate safety

- paymentEligible: 22
- formulaGateEligible: 22
- free paymentEligible: 0
- problem slug abonelik-yazilim-cloud-yillik-maliyet-hesabi: payment=false, formulaGate=false
