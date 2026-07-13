# Premium-Schema UNRESOLVED_INPUT_MAP Remediation Matrix

Generated: 2026-07-14 (repo audit). Source: `lintAllPremiumSchemas` over `PREMIUM_CALCULATOR_SCHEMAS`.
Baseline test `schema-linter.test.ts` is RED on main because of these 15 schemas.

Status: all 15 schemas are in the legacy premium-schema batch and are NOT in the
active PRO allowlist (`src/sectorcalc/runtime/active-tool-allowlist.ts`, 20 live
pro-v531 tools). Latent defect, not a live production incident.

Defect class: formulaPipeline `inputMap` references keys that are neither schema
inputs nor prior pipeline outputs. If executed, `num(inputs, key)` resolves to
0/NaN — silently wrong results. Same hallucinated-binding class previously fixed
in pro-v2 (commit 71cd4ebe3).

DO NOT batch-rename mechanically. Several mappings cross UNIT BOUNDARIES
(decare vs hectare = 10x) and require a human-verified oracle case per tool
before the binding fix is golden-locked.

| Schema | Unresolved keys | Candidate mapping | Risk note |
|---|---|---|---|
| inventory-turnover-risk-analyzer | cogs; inventoryTurnover | annualCogs; pipeline out `inventoryTurnoverRatio` | Low — direct rename |
| irrigation-cost-check-analyzer | etc, effectiveRainfall, waterRequirement, totalHead, pumpEff, motorEff, elecRate, energyCost, maintCost | cropWaterNeed?, rainfall×?, `irrigationWaterReq`, MISSING(totalHead), irrigationEfficiency split?, electricityCost, `irrigationEnergyCost`, MISSING(maintCost) | HIGH — pipeline authored for a different input model (head/pump-eff based); needs formula redesign + oracle |
| office-supplies-cost-analyzer | annualUsage, annualDemand, orderQty, holdingCostPerUnit, stockoutUnits, lostMarginPerUnit, wasteUnits, totalOrdered, currentTotalCost, optimalTotalCost | monthlyConsumption×12 (derive), currentOrderQty, unitPrice×holdingRate (derive), … | HIGH — needs derived pipeline steps, not renames |
| overtime-hiring-breakeven-analyzer | annualOtHours | overtimeHoursPerMonth×12 (derive) | Med — add derivation step |
| pallet-rack-optimizer-analyzer | totalRackCost | costPerPosition × `rackCapacity` (derive) | Med |
| payment-terms-optimizer-analyzer | accountsReceivable, creditSales, discountEligibleSales, newDso, currentDso, avgDailySales | avgReceivables; annualRevenue?; …; `dso` vs currentTerms/proposedTerms deriveds | HIGH — DSO chain redesign |
| recipe-cost-check-analyzer | batchQty, theoreticalCostPerKg, actualCostPerKg | recipeQty?; `recipeTheoretical`/outputWeight; `recipeActual`/outputWeight | Med — derive per-kg steps |
| restaurant-menu-margin-leak-analyzer | totalSales, idealFoodCostPct, beginningInv, purchases, endingInv, expectedFoodCost, mealsServed, varianceCost, wasteKg, avgCostPerKg, theftQty, avgCostPerUnit | revenue; theoreticalFoodCost%?; MISSING(inventory triplet); … | HIGH — pipeline expects COGS-by-inventory model the schema never asks for; redesign |
| saas-shelfware-analyzer | totalContract | totalLicenses × licenseCostPerSeat (derive) | Low |
| seed-rate-analyzer | areaHa, seedRatePerHa, seedPricePerUnit, expectedGermination, actualGermination | fieldArea (DECARE→HA ÷10!), seedPerDecare (×10!), seedUnitCost, germinationRate, MISSING(actual) | HIGH — 10x unit conversion; oracle mandatory |
| supply-chain-disruption-analyzer | supplierSpend, disruptionProb, disruptionDays, dailyRevenue, impactPct | MISSING, disruptionProbability, recoveryDays, annualRevenue/365 (derive), revenueAtRisk% | Med-High |
| textile-waste-risk-analyzer | wasteKg, totalKg, preConsumerKg, materialCostPerKg, postConsumerWaste, recyclingRevenue, industryBenchmark | fabricWaste, fabricUsed, MISSING split, fabricUnitCost, MISSING, recycleRevenue, MISSING(benchmark const) | Med-High |
| total-employee-cost-analyzer | grossSalary, employerCosts, bonus, training, otherBenefits, annualWorkHours | avgGrossSalary, employerPayrollTax-derived, MISSING(bonus), trainingCostPerEmployee, benefitsCostPerEmployee, avgWorkHoursPerMonth×12 | Med |
| transfer-pricing-optimizer-analyzer | marketPrice, taxRateDiff, sellerProfit, buyerProfit | armLengthPrice, entityATaxRate−entityBTaxRate (derive), MISSING profit inputs | Med-High |

Remediation protocol per tool (Sentinel-compatible):
1. Write human-verified oracle case (inputs + expected outputs, ISO/standard ref where applicable).
2. Fix inputMap / add derivation pipeline steps to match declared schema inputs.
3. Golden-lock via compare-premium-schema-extended-oracle fixtures.
4. Re-run `schema-linter.test.ts` — schema must exit the failing set.
5. Only then consider activation.
