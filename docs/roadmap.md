# SectorCalc Manifesto-Aligned Product Roadmap

> **Document type:** Product direction and phase plan — not a live deploy log.  
> For current HEAD, smoke results, and production baseline, see [production-reality.md](./production-reality.md).  
> For vision and positioning, see [manifesto.md](./manifesto.md) and [product-strategy.md](./product-strategy.md).

---

## Güncel durum (2026-06-10)

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
| **P4** Trust Trace / Validation Stamp / Public Verify | **NEXT ACTIVE PHASE** | Unblocked after P2.4 closure |

**Current active phase:** **P4 — Trust Trace / Validation Stamp / Public Verify**

### Phase gate (EN)

P2.4 closed with full form-surface inventory, `.sc-form-*` standard, free/legacy wiring, mobile/locale/RTL QA, and `smoke:all-calculation-forms` PASS (155 routes). P3 feedback revalidated post-repair. **Next:** P4 Trust Trace / Validation Stamp / Public Verify.

### Faz kapısı (TR)

P2.4 tüm hesaplama form yüzeylerini envantere aldı, onarımı kapattı, smoke PASS aldı (`cc4153d`). P3 feedback post-repair doğrulandı. **Sıradaki:** P4 Trust Trace / Validation Stamp / Public Verify.

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

**Active now:** P2.4 (Full Calculation Form Repair Sweep). **Closed:** P2.3 (Premium Smart Form rollout).

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

## P4 — Trust Trace / Validation Stamp / Public Verify *(NEXT ACTIVE PHASE)*

**Status:** Unblocked — P2.4 PASS complete. Do not start until this phase is explicitly scheduled.

**Goal:** Premium rapor üçüncü tarafça doğrulanabilir.

| Bileşen | Açıklama |
|---------|----------|
| Report ID + hash | Tekil kimlik |
| QR code | Mobil verify |
| Formula version | Contract versiyonu |
| Input / result snapshot | Denetim |
| `/verify` backend lookup | Public doğrulama sayfası |
| Export | PDF / Excel / Word (Pro+) |
| Disclaimer / Usage Agreement | Hukuki çerçeve |

*Related live status:* Verify UI placeholder — full backend P4 scope.*

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

*Last updated: 2026-06-10*