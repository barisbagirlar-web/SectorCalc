# P5 Form Presence Audit

## Summary

* Status: `MANUAL_BROWSER_REQUIRED`
* Deploy executed: no
* Routes checked: 5
* Form markers found: 5
* Missing form routes: none
* Blockers: none

## Route Results

| Route | Status | Form Marker | Input/Button | Notes |
| --- | --- | --- | --- | --- |
| `/tr/tools/free/machine-time-calculator` | 200 | form_tag, input_tag, button_tag, hesapla | yes | input/button present but calculator marker missing — verify client hydration |
| `/tr/tools/free/project-cost-calculator` | 200 | form_tag, input_tag, button_tag, hesapla | yes | — |
| `/tr/tools/free/cleaning-cost-calculator` | 200 | form_tag, input_tag, button_tag, hesapla | yes | — |
| `/tr/tools/premium-schema/cnc-oee-loss` | 200 | form_tag, input_tag, button_tag, hesapla | yes | — |
| `/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi` | 200 | form_tag, input_tag, button_tag, hesapla | yes | — |

## Manual Browser QA Required

* Desktop:
  * `/tr/tools/free/machine-time-calculator`
* Mobile:
  * Same route set — verify form fields + calculate CTA visible
* Console:
  * No red runtime errors on form routes
* Network:
  * No 404/500 on tool pages

_Generated at 2026-06-14T00:17:21.527Z_

