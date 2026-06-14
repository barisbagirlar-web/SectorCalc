# P7 Chief Engineer Quality Gate

Generated: 2026-06-14T01:12:01.604Z

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
- DeepSeek attempted: 3
- Patch eligible (gate passed): 0
- Gate rejected: 0
- API errors: 3

## Risk Class Distribution

- LOW_GENERAL_CALC: 375
- MEDIUM_BUSINESS_CALC: 53
- HIGH_ENGINEERING_SAFETY: 27
- HIGH_FINANCE_LEGAL_TAX: 14
- HIGH_REGULATORY: 4
- BLOCKED_UNKNOWN: 1
