# SectorCalc Manifesto-Aligned Product Roadmap

> **Document type:** Product direction and phase plan — not a live deploy log.  
> For current HEAD, smoke results, and production baseline, see [production-reality.md](./production-reality.md).  
> For vision and positioning, see [manifesto.md](./manifesto.md) and [product-strategy.md](./product-strategy.md).

---

## Güncel durum (2026-06-11)

| Phase | Durum | Not |
|-------|--------|-----|
| **P0** Final Hard Stabilization | **DONE** | Premium route collision, revert baseline, smoke lock |
| **P1** Grouped Catalog Search | **DONE** | 6 locale catalog + homepage search |
| **P2.0** Smart Form Pilot (3 tool) | **DONE** | CNC, welding, HVAC dynamic form |
| **P2.1** Public Preview + Auth Gate Fix | **DONE** | Hard gate kaldırıldı; Pro-only aksiyonlar kilitli |
| **P2.2** Smart Form Layout Stabilization | **DONE** | Desktop 2-col, mobile 375px, decision output panel |
| **P2.3** Smart Form Full Premium Rollout | **DONE** | 27/27 premium analyzer Smart Form + runtime compatibility |
| **P2.4** Full Calculation Form Repair Sweep | **DONE** | PROMPT-P2.4-001 + AUDITFIX-P2.4-001 — inventory, repair, smoke PASS (`cc4153d`) |
| **P3** Feedback / Formula Objection System | **COMPLETE** | `40bd28b` — post-P2.4 revalidation PASS |
| **P4** Trust Trace / Validation Stamp / Public Verify | **COMPLETE** | FIX-P4-001 — build + smoke gates closed |
| **P5** Metric / Imperial / Regional Unit Engine | **COMPLETE** | `2182af1` — display-only unit engine, no formula/runtime change, smoke PASS |
| **P6** Regional Benchmark Engine | **COMPLETE** | `d17bbd0` — indicative reference bands, decision support only, smoke PASS |
| **P7** Case Study Proof Layer | **COMPLETE** | `49f0613` — representative examples (no fake clients), smoke PASS |
| **P8** PWA / Field Mode | **COMPLETE** | `15e7fb7` — installable PWA, offline shell, field mode, smoke PASS |

**Current active phase:** **P9 — Packaging** *(next to schedule)*

### Phase gate (EN)

P5–P8 are complete and verified in production (deploy revision `ssrsectorcalcbf412-00284-ppt`, Cloud Run min-instances=1). All build gates, regression smokes, and new phase smokes (regional-units, regional-benchmarks, case-study-proof, pwa-field-mode) pass on `https://sectorcalc.com` across EN root + /tr /ar /de /fr /es. No formula/runtime change, no `/en` prefix. **Next phase:** P9 Packaging.

### Faz kapısı (TR)

P5–P8 tamamlandı ve production'da doğrulandı (deploy revision `ssrsectorcalcbf412-00284-ppt`, Cloud Run min-instances=1). Tüm build kapıları, regresyon smoke'ları ve yeni faz smoke'ları (regional-units, regional-benchmarks, case-study-proof, pwa-field-mode) `https://sectorcalc.com` üzerinde 6 locale (EN root + /tr /ar /de /fr /es) için geçti. Formula/runtime değişmedi, `/en` prefix yok. **Sıradaki:** P9 Packaging.

---

## Phase overview

```
P0 Stabilization ──► P1 Catalog ──► P2 Smart Form (pilot → layout → 27/27 → P2.4 all forms)
                                              │
    P3 Feedback ◄── P4 Trust Trace ◄── P5 Units ◄── P6 Benchmark
         │                  │              │            │
    P7 Case Study ◄── P8 PWA ◄── P9 Packaging ◄── P10 AI Assistant
                                              │
                                    P11 Autonomous Release Gate
```

**Active now:** P9 (Packaging). **Closed:** P0–P8 (through PWA / Field Mode).

---

## P2 — Smart Form Full Premium Rollout *(DONE)*

**Goal:** 27/27 premium analyzer Smart Form kapsamında; formula logic değişmeden.

### Deliverables

- [x] Merkezi registry: `premium-smart-form-definitions.ts`  
- [x] Runtime compatibility layer: `runtime-compatibility.ts`  
- [x] 27 tool × 2 scenario, simple/advanced, contract-aligned input keys  
- [x] 6 locale `smartForm.*` message coverage  
- [x] `npm run smoke:premium-smart-forms` gate  
- [x] Production deploy + post-deploy smoke PASS (verify via `production-reality.md`)  

### Exit criteria

- [x] 27/27 premium route public preview + Smart Form marker  
- [x] Sign-in required **hard gate yok**  
- [x] Runtime compatibility audit PASS  
- [x] Build + formula + dual-intelligence + locale + browser smoke PASS  

---

## P2.4 — Full Calculation Form Repair Sweep *(DONE)*

**Prompt IDs:** PROMPT-P2.4-001 · AUDITFIX-P2.4-001

**Goal:** Premium Smart Form dışındaki tüm hesaplama form yüzeylerini envantere almak, sınıflandırmak, layout/mobile/locale kırıklarını düzeltmek; formula logic değiştirmeden.

### Scope status

| Scope                       | Status | Closure Evidence                     |
| --------------------------- | ------ | ------------------------------------ |
| Premium Smart Forms         | DONE   | 27/27 premium smart forms smoke PASS |
| Free Tool Forms             | DONE   | 115 routes + `sc-form-shell` repair |
| Legacy Calculator Forms     | DONE   | 7 tier routes + ToolForm repair      |
| Calculation Result Panels   | DONE   | `sc-form-result-layout` applied      |
| Mobile 375px Forms          | DONE   | Browser calc smoke 375px PASS        |
| Locale Long Labels          | DONE   | TR/DE/FR/ES smoke samples PASS       |
| RTL Arabic Forms            | DONE   | CSS RTL rules + `/ar` smoke PASS     |
| All Calculation Forms Smoke | DONE   | `smoke:all-calculation-forms` PASS   |

### Closure evidence

- Inventory: [form-surface-inventory.md](./form-surface-inventory.md) — 32 surfaces, 13 calculation groups repaired  
- Shared CSS: `src/styles/design-craft.css` (`.sc-form-*`)  
- Smoke: 155 routes checked per `smoke:all-calculation-forms` run  
- Regressions: premium smart forms 27/27, locale 42/42, browser 25/25 unchanged  

---

## P3 — Feedback / Formula Objection System *(COMPLETE)*

**Goal:** Kullanıcı geri bildirimi ve formül itirazı admin queue'ya düşer.

**Status:** Deployed `40bd28b`; post-P2.4 revalidation PASS via `smoke:feedback-ui` on repaired forms (2026-06-10).

| Work Item | Status |
|-----------|--------|
| Feedback UI | ✅ Complete |
| Formula objection | ✅ Complete |
| Wrong result report | ✅ Complete |
| Missing input suggestion | ✅ Complete |
| Improvement request | ✅ Complete |
| Feedback admin queue | ✅ Complete |
| Firestore toolFeedback collection | ✅ Complete |
| 6 locale feedback UI | ✅ Complete |
| Feedback smoke | ✅ PASS |
| Post-P2.4 revalidation | ✅ PASS |

**Commit:** `40bd28b` — ToolFeedbackPanel, admin queue `/account/feedback`, `toolFeedback` Firestore collection, 6 locale i18n coverage.

---

## P4 — Trust Trace / Validation Stamp / Public Verify *(COMPLETE)*

**Prompt IDs:** PROMPT-P4-001 · PROMPT-P4-002

**Status:** COMPLETE — tsc clean, 43 unit tests PASS, Firestore rules updated, smoke script ready.

**Goal:** Premium rapor üçüncü tarafça doğrulanabilir.

| Work Item | Status | Evidence |
|-----------|--------|----------|
| Trust Trace library (`src/lib/trust-trace/`) | ✅ Complete | types, hash, report-id, snapshot, public-summary, service, export, index |
| Report ID + SHA-256 hash | ✅ Complete | `createReportId`, `createCalculationHash`, `verifyCalculationHash` |
| Approved Report Payload | ✅ Complete | `ApprovedReportPayload` type + `buildApprovedReportPayload` |
| Firestore Admin SDK write | ✅ Complete | `createApprovedReport` via `getAdminFirestore()` |
| POST `/api/reports/approved` | ✅ Complete | Validation, Admin SDK write, 201 response |
| GET `/api/verify-report` | ✅ Complete | Hash verify, status (verified/hash_mismatch/revoked/not_found) |
| `/[locale]/verify` page | ✅ Complete | `VerifyReportClient` + `VerifyStatusBadge`, SSR + client |
| UI components | ✅ Complete | `ValidationStamp`, `TrustTraceSummary`, `ApprovedReportActions`, `ApprovedReportPanel` |
| Export (HTML/CSV/Word) | ✅ Complete | `buildApprovedReportHtml`, `buildApprovedReportCsv`, `buildApprovedReportWordHtml` |
| Firestore rules | ✅ Complete | `approvedReports` collection — public read (public_verify), Admin SDK write only |
| 43 unit tests | ✅ PASS | hash, report-id, snapshot test suites |
| Smoke script | ✅ Ready | `scripts/smoke-approved-reports.mjs` — 9 test scenarios |
| Disclaimer / Legal | ✅ Complete | Disclaimer v1.0 on all exports and report pages |

---

## P5 — Metric / Imperial / Regional Unit Engine

- Locale default unit  
- User override  
- Canonical internal conversion  
- Display unit separation  
- Pilot foundation exists — production-wide rollout P5  

---

## P6 — Regional Benchmark Engine

- TÜİK / TSE / ISO / sektör odası / akademik kaynak yapısı  
- Tool bazlı benchmark  
- Ülke bazlı benchmark  
- Kaynakça zorunlu — kaynaksız "sektör ortalaması" yok  

---

## P7 — Case Study Proof Layer

- Sektör bazlı vaka analizleri  
- Metodoloji + input/result breakdown  
- Trust Trace bağlantısı  
- Tüm locale yayın  

*Current:* Representative drafts exist — 27/27 complete hedefi P7.*

---

## P8 — PWA / Saha Mode

- Offline shell  
- Basic offline calculations  
- Sync  
- Large buttons, high contrast  
- 3-second readable result target  

---

## P9 — Pricing / Business / Enterprise Packaging

| Tier | Monetization |
|------|----------------|
| Pro | Premium tools, PDF, Trust Trace |
| Business | White-label, team, logo |
| Enterprise | API, custom benchmark, audit trail |

Trust Trace ve verification ayrı monetization lever.

---

## P10 — AI Assistant

- **Free:** marketing assistant, tool routing, explanation  
- **Paid:** operational support, input prep, report commentary  
- **Boundary:** AI never calculates, never selects formula, never overrides oracle  

*Current:* Lib boundary only — not live product.*

---

## P11 — Autonomous Release Gate

Her production release öncesi zorunlu gate seti:

```bash
npm run lint
npx tsc --noEmit
npm run check:secrets
npm run assert:route-cache-policy
npm run build
npm run test:formulas
npm run audit:dual-intelligence-runtime-coverage
npm run smoke:premium-routes
npm run smoke:premium-smart-forms
npm run smoke:locale-routes
npm run smoke:browser-routes -- --probe
npm run smoke:browser-routes
```

Post-deploy: Cloud Run minInstances + production smoke tekrarı.  
Future: rollback / canary automation.

---

## Deprecated / superseded notes

Aşağıdaki eski ifadeler **artık geçerli değildir** — bu roadmap ile değiştirilmiştir:

- ~~"Smart Form global wrapper — NOT production-wide"~~ → P2.3 hedefi production-wide 27/27  
- ~~"P0 açık — Smart Form rollout bekliyor"~~ → P2.0–P2.3 DONE, **P2.4 ACTIVE**  
- ~~"P2.3 = all forms complete"~~ → P2.3 closes **premium Smart Form only**; P2.4 sweeps all calculation forms  
- ~~"P3 Feedback BLOCKED until P2.4 closure"~~ → P3 **EARLY IMPLEMENTED / RISK-GATED** under commit `40bd28b`; historical planning note superseded by early deployment  
- ~~"Universal Smart Form Architecture NOT LIVE"~~ → rollout fazında; live durum `production-reality.md` ile doğrulanır  

Operational freeze docs ([product-roadmap-freeze.md](./product-roadmap-freeze.md)) revenue measurement dönemi için geçerlidir; manifesto fazları ile çelişirse **manifesto-aligned roadmap** product direction için üstündür.

---

*Last updated: 2026-06-11*
