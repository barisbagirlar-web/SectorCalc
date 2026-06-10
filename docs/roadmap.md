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
| **P2.4** Full Calculation Form Repair Sweep | **DONE** | PROMPT-P2.4-001 + AUDITFIX-P2.4-001 — inventory, repair, smoke PASS |
| **P3** Feedback / Formula Objection System | **EARLY IMPLEMENTED / RISK-GATED** | `40bd28b` — ToolFeedbackPanel, admin queue, `toolFeedback` |
| **P4** Trust Trace / Validation Stamp / Public Verify | **WAITING UNTIL P2.4 PASS + P3 REVALIDATION** | P2.4 closes all calc forms; P3 live but requires post-repair revalidation |

**Current active phase:** **P2.4 — Full Calculation Form Repair Sweep** (P3 already deployed, P4 waiting)

### Phase gate (EN)

P2.4 full calculation form repair sweep closes the inventory, `.sc-form-*` standard, free/legacy wiring, and `smoke:all-calculation-forms` PASS. P3 feedback system was deployed in `40bd28b` and passed smoke testing — now classified as EARLY IMPLEMENTED / RISK-GATED, pending post-repair revalidation. **P4 waits until P2.4 closure is confirmed and P3 revalidation is complete.**

### Faz kapısı (TR)

P2.4 tüm hesaplama form yüzeylerini envantere aldı, `.sc-form-*` standardını uyguladı, free/legacy wiring'i kapattı ve `smoke:all-calculation-forms` PASS aldı. P3 feedback sistemi 40bd28b commit'i ile daha önceden deploy edilmiş ve smoke testini geçmiş — artık EARLY IMPLEMENTED / RISK-GATED olarak sınıflandırılmıştır, form onarımı sonrası yeniden doğrulanmaya beklenmektedir. **P4, P2.4 kapanış teyidi ve P3 yeniden doğrulanma tamamlandığında başlayacaktır.**

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

**Active now:** P4 (Trust Trace). **Closed:** P2.4 all calculation forms.

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

## P3 — Feedback / Formula Objection System *(EARLY IMPLEMENTED / RISK-GATED)*

**Goal:** Kullanıcı geri bildirimi ve formül itirazı admin queue'ya düşer. Sistem canlıda ancak P2.4 form onarımı kapandıktan sonra yeniden doğrulanmalıdır.

**Status:** Already merged and deployed under commit `40bd28b`. System passed initial smoke testing. However, because P2.4 full calculation form repair sweep evidence was missing at P3 deployment time, P3 is now classified as **EARLY IMPLEMENTED / RISK-GATED** and must be revalidated after P2.4 closes, especially across repaired free, legacy, premium, mobile, locale and RTL form surfaces.

| Work Item | Status |
|-----------|--------|
| Feedback UI | ✅ Implemented / revalidation required after P2.4 |
| Formula objection | ✅ Implemented / revalidation required after P2.4 |
| Wrong result report | ✅ Implemented / revalidation required after P2.4 |
| Missing input suggestion | ✅ Implemented / revalidation required after P2.4 |
| Improvement request | ✅ Implemented / revalidation required after P2.4 |
| Feedback admin queue | ✅ Implemented |
| Firestore toolFeedback collection | ✅ Implemented |
| 6 locale feedback UI | ✅ Implemented |
| Feedback smoke | ✅ PASS |
| P2.4 post-repair revalidation | 🔴 Required |

**Commit:** `40bd28b` — ToolFeedbackPanel, admin queue `/account/feedback`, `toolFeedback` Firestore collection, 6 locale i18n coverage.

**Historical note:** P3 was planned to start after P2.4 closure. However, P3 code was merged and deployed earlier than planned (commit `40bd28b`). Therefore, P3 must not be described as "not started" or "blocked" — it is live and passed smoke testing. Yet because P2.4 form repair evidence was missing at deployment time, P3 is risk-gated and requires full revalidation on the repaired calculation form surfaces after P2.4 closes.

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