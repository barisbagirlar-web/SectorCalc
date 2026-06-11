# Release Gate Report

- Result: **PASS**
- Start: 2026-06-11T03:34:45.409Z
- End: 2026-06-11T03:38:40.179Z
- Duration: 234.8s
- Commit: 764b92b
- Branch: main
- Node: v22.22.2
- Base URL: http://localhost:3320

## Steps

| Step | Critical | Status | Duration |
| --- | --- | --- | --- |
| lint | yes | PASS | 1.5s |
| typescript | yes | PASS | 1.6s |
| check:secrets | yes | PASS | 0.2s |
| assert:route-cache-policy | yes | PASS | 0.1s |
| build | yes | PASS | 24.2s |
| test:formulas | yes | PASS | 5.3s |
| audit:dual-intelligence-runtime-coverage | yes | PASS | 1.0s |
| smoke:premium-routes | yes | PASS | 0.3s |
| smoke:premium-smart-forms | yes | PASS | 0.2s |
| smoke:locale-routes | yes | PASS | 0.5s |
| smoke:browser-routes-probe | yes | PASS | 23.6s |
| smoke:browser-routes | yes | PASS | 140.6s |
| smoke:all-calculation-forms | yes | PASS | 0.9s |
| smoke:browser-calculation-forms | no | FAIL | 31.2s |
| smoke:feedback-ui | yes | PASS | 0.2s |
| smoke:approved-reports | no | PASS | 0.2s |
| smoke:verify-report | no | PASS | 0.2s |
| smoke:regional-units | yes | PASS | 0.2s |
| smoke:regional-benchmarks | yes | PASS | 0.2s |
| smoke:case-study-proof | yes | PASS | 0.4s |
| smoke:pwa-field-mode | no | FAIL | 0.2s |
| smoke:business-packaging | yes | PASS | 0.2s |
| smoke:premium-seo-landings | yes | PASS | 0.4s |
| smoke:ai-assistant | yes | PASS | 0.2s |
| anti-regression: manifest /en | yes | PASS | - |

## Warnings (non-critical)

- smoke:browser-calculation-forms
- smoke:pwa-field-mode

## Next action

- Gate PASS. Deploy is permitted. After hosting deploy, apply Cloud Run minInstances and run production smoke.
