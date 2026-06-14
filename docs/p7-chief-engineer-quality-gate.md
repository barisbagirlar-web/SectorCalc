# P7 Chief Engineer Quality Gate

Generated: 2026-06-14T02:32:43.142Z

## Domain Prompt Packs

- Enabled: **yes**
- Pack count: 11
- Self-tests: **PASS**
- Wiring domain match: COSTING_MARGIN_AND_PRICING
- Message layout: Chief Engineer system + domain system + tool user

## Domain Prompt Dispatcher

- Enabled: **yes**
- Self-tests: **PASS**

## DeepSeek System Prompt

- Enforced on every API call: **yes**
- Prompt length: 3899 chars
- Wiring verification: **PASS**

## Response Gate

- Required top-level fields: 21
- Reject gate self-tests: **PASS**

## Reject Rules

- status !== PASS
- overallDecision !== APPROVED
- canGenerateCalculator !== true
- riskClass not LOW_GENERAL_CALC or MEDIUM_BUSINESS_CALC
- inputs.length < 3
- outputs.length < 2
- formulaMethod.references.length < 1
- formulaMethod.formulaSteps.length < 4
- oracleCases.length < 3
- assumptionsEn.length < 3
- assumptionsTr.length < 3
- limitationsEn/Tr.length < 1
- recommendedActionsEn/Tr.length < 1
- safeExportBaseName starts with digit
- generic input key
- mixed language label
- input unit missing
- validation boundary missing
- expected output not finite
- findings contain critical or major

## Scan Summary

- Total tools: 474
- DeepSeek attempted: 366
- Patch eligible (gate passed): 170
- Gate rejected: 190
- API errors: 6

## Risk Class Distribution

- LOW_GENERAL_CALC: 375
- MEDIUM_BUSINESS_CALC: 53
- HIGH_ENGINEERING_SAFETY: 27
- HIGH_FINANCE_LEGAL_TAX: 14
- HIGH_REGULATORY: 4
- BLOCKED_UNKNOWN: 1

## Domain Distribution

- COSTING_MARGIN_AND_PRICING: 58
- GENERAL_INDUSTRIAL_COST_ANALYTICS: 239
- MANUFACTURING_AND_MACHINING: 21
- FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK: 49
- FOOD_AGRI_AND_PROCESS: 12
- LOGISTICS_AND_TRANSPORT: 19
- MAINTENANCE_AND_DOWNTIME: 9
- INVENTORY_AND_STOCK: 5
- LEAN_WASTE_AND_OEE: 21
- ENERGY_AND_UTILITIES: 25
- CONSTRUCTION_AND_FIELD_SERVICE: 16
