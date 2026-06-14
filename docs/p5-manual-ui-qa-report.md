# P5 Manual UI QA Report

## Summary

* Status: `MANUAL_QA_REQUIRED`
* Deploy executed: no
* Base URL: not set
* Local smoke: skipped — set SECTORCALC_QA_BASE_URL for fetch smoke
* Revenue boundary: payment=22 formulaGate=22 freePayment=0
* Blockers: none

## Gate References

* assert:revenue-gate: PASS
* P4 deploy guard: GO
* S6 readiness: DEPLOY_READY_BUT_NOT_DEPLOYED

## Critical Route Checklist

| Route | Desktop | Mobile | Console | Network | Notes |
| --- | --- | --- | --- | --- | --- |
| `/tr` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/free-tools` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/premium-tools` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/tools/free/machine-time-calculator` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/tools/free/project-cost-calculator` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/tools/free/cleaning-cost-calculator` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/tools/premium-schema/cnc-oee-loss` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/pricing` | ☐ | ☐ | ☐ | ☐ | |
| `/tr/account` | ☐ | ☐ | ☐ | ☐ | |
| `/en` | ☐ | ☐ | ☐ | ☐ | |
| `/en/free-tools` | ☐ | ☐ | ☐ | ☐ | |
| `/en/premium-tools` | ☐ | ☐ | ☐ | ☐ | |
| `/en/tools/free/machine-time-calculator` | ☐ | ☐ | ☐ | ☐ | |
| `/en/tools/premium-schema/cnc-oee-loss` | ☐ | ☐ | ☐ | ☐ | |

## Revenue/Lock Checklist

| Check | Expected | Result |
| --- | --- | --- |
| paymentEligible count | 22 | 22 |
| formulaGateEligible count | 22 | 22 |
| freePaymentEligible | 0 | 0 |
| feed-efficiency-analyzer | blocked | blocked |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | locked | locked |

## Problem Slug Fetch Scan

* not run — no SECTORCALC_QA_BASE_URL

## Manual Browser QA

Desktop:

* `/tr`
* `/tr/free-tools`
* `/tr/premium-tools`
* `/tr/tools/free/machine-time-calculator`
* `/tr/tools/free/project-cost-calculator`
* `/tr/tools/free/cleaning-cost-calculator`
* `/tr/tools/premium-schema/cnc-oee-loss`
* `/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi`
* `/tr/pricing`
* `/tr/account`

Mobile:

* Same route set
* Check overflow
* Check header
* Check cards
* Check form fields
* Check CTA buttons

Console:

* No red runtime errors

Network:

* No 404
* No 500
* No failed critical JS/CSS

## Deploy Decision

* Manual UI QA: PENDING
* Deploy approval: NO until user explicitly approves

## Blockers

* none

_Generated at 2026-06-14T00:01:04.742Z_

