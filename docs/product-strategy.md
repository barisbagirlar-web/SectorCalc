# SectorCalc Product Strategy

> Companion docs: [manifesto.md](./manifesto.md) · [roadmap.md](./roadmap.md) · [multilingual-seo-acquisition-funnel.md](./multilingual-seo-acquisition-funnel.md) · [production-reality.md](./production-reality.md)

---

## Market position

SectorCalc occupies the gap between **amateur calculator sites** and **enterprise ERP/MES stacks**.

| Segment | SectorCalc position |
|---------|---------------------|
| Google calculators | Professional, verified, sector-specific |
| Excel / defter / WhatsApp | Standardized, archivable, decision-grade |
| SAP / Siemens / Oracle | Accessible price, days not years to value |
| Generic SaaS quoting | Loss detection + validation, not just forms |

**Category name:** Industrial Micro-SaaS App Store — curated sector decision tools, not a formula wiki.

**Domain:** SectorCalc.com (global, 6 locales: EN root, `/tr`, `/ar`, `/de`, `/fr`, `/es`).

---

## Personas (summary)

| # | Persona | Job to be done | Primary product layer |
|---|---------|----------------|----------------------|
| 1 | Saha operatörü / usta | Hızlı, mobil, güvenilir sonuç | Free tools + Smart Form simple mode |
| 2 | KOBİ yöneticisi | Kayıp tespiti, güvenli fiyat | Premium analyzers + PDF |
| 3 | Danışman / mali müşavir | Rapor + metodoloji + white-label | Pro / Business |
| 4 | Bireysel kullanıcı | Ücretsiz pratik hesap | Free traffic tools |
| 5 | Öğrenci / akademisyen | Açıklanabilir hesap + kaynak | Free + case studies (P7) |

Detay: [manifesto.md §4](./manifesto.md#4-hizmet-edilen-5-persona).

---

## Pain map (strategic)

Saha acıları dört boyutta gruplanır — her premium tool en az bir boyuta bağlanır:

1. **Parasal** — marj sızıntısı, yanlış fiyat  
2. **Malzeme** — fire, iade, israf  
3. **Zaman** — setup, rework, rota  
4. **Enerji / karbon** — utility, CBAM  

Tam liste: [manifesto.md Appendix A](./manifesto.md#appendix-a--operational-pain-map).

**Product rule:** Free tool = risk sinyali + hızlı check. Paid analyzer = verdict + safe price band + suggested action + (Pro) PDF/Trust Trace.

---

## Competitive replacement table

| Incumbent | Weakness | SectorCalc replacement |
|-----------|----------|------------------------|
| Excel | Error-prone, no governance | Contract + oracle + Smart Form |
| Usta defteri | Kaybolur, ölçeklenmez | Saved reports + verify (P4) |
| WhatsApp teklif | İnkâr edilebilir | Timestamped decision report |
| Danışmanlık | Pahalı | Self-serve premium analyzer |
| ERP | Kurulum + lisans | Browser-first, sector pack |
| Calculator sites | Reklam, doğrulama yok | Dual-intelligence loop |

---

## Product layers

```
Layer 1 ─ Free calculation discovery (SEO, trust, 100 tools)
    │
Layer 2 ─ Premium Smart Form analyzers (27 sector decision tools)
    │
Layer 3 ─ Approved Reports (PDF, methodology, verdict)
    │
Layer 4 ─ Trust Trace / Public Verify (/verify, QR, hash)
    │
Layer 5 ─ Business / Enterprise (white-label, API, audit trail)
```

### Layer 1 — Free

- 3–5 input, browser-first, privacy note  
- Risk signal without full paid verdict leakage  
- Funnel to related premium tool  

### Layer 2 — Premium Smart Form

- Scenario selector, simple/advanced  
- Requirement engine (Mind 2) + validation (Mind 1)  
- Public preview; Pro locks PDF / trust trace / save  

### Layer 3 — Approved Reports

- Verdict, metric, risk drivers, suggested action  
- Legal disclaimer  
- Subscribed PDF export  

### Layer 4 — Trust Trace / Verify

- Report ID, hash, formula version  
- Third-party verification at `/verify`  
- Monetization lever for Pro+  

### Layer 5 — Business / Enterprise

- White-label PDF, team seats  
- API + custom benchmark + enterprise audit trail  

---

## Revenue logic

| Motion | Role |
|--------|------|
| **Free** | Traffic, SEO, trust, visible risk |
| **Pro** | Premium analyzers, PDF, Trust Trace |
| **Business** | Reports, white-label, team |
| **Enterprise** | Verification API, custom benchmark, audit |

**Principles:**

- PDF is export of paid result — not the main product  
- Main product = **decision verdict + loss visibility**  
- Stripe + subscription guard already in production — packaging evolution P9  

**Primary acquisition channel:** Multilingual, intent-driven SEO — not ads or brand alone. Free tools capture search intent; premium Smart Form and Pro Trust Trace monetize verified decisions. Full funnel: [multilingual-seo-acquisition-funnel.md](./multilingual-seo-acquisition-funnel.md).

---

## UX principle

| Surface | Kullanıcı görür | Sistem yapar |
|---------|-----------------|--------------|
| Smart Form | Basit alanlar, senaryo, help | Requirement engine, compatibility |
| Sonuç | Büyük rakam, verdict, aksiyon | Deterministic calc + validation |
| Rapor | Metodoloji özeti, disclaimer | Oracle audit, trust trace (Pro) |

**Kural:** Kullanıcı karmaşık validasyon matrisini görmez; raporda metodoloji ve doğrulama izi olur.

**Mobile:** 44px targets, tek kolon, yatay scroll yok, 3s readable result (P8 PWA hedefi).

---

## Current strategic focus (Q2 2026)

1. **Close P2.4** — Full Calculation Form Repair Sweep with full closure evidence: complete inventory, form repair coverage, mobile/locale/RTL QA, and smoke:all-calculation-forms PASS  
2. **Revalidate live P3** — Feedback / Formula Objection deployed under commit `40bd28b` is live in production. Requires post-P2.4 revalidation on all repaired form surfaces before P4 can start.
3. **Maintain P2.3 baseline** — 27/27 premium Smart Form smoke must stay PASS while P2.4 runs  
4. **Defer P10 AI** until deterministic loop + Trust Trace foundation solid  

### Phase gate (EN)

P2.3 closed only the premium Smart Form rollout scope. It does not certify that every calculation-related form in the product is visually repaired, mobile-safe, locale-safe, and layout-stable. Therefore P2.4 — Full Calculation Form Repair Sweep is now the active phase. P3 Feedback / Formula Objection was deployed early (commit `40bd28b`) and is live in production. However, because P2.4 form repair evidence was missing at P3 deployment time, P3 is classified as **EARLY IMPLEMENTED / RISK-GATED** and must be revalidated after P2.4 closure evidence is produced, especially on repaired free, legacy, premium, mobile, locale, and RTL form surfaces.

### Faz kapısı (TR)

P2.3 yalnızca premium Smart Form kapsamını kapatır. Bu kapanış, sitedeki tüm hesaplama formlarının düzeldiği anlamına gelmez. Free tool formları, legacy calculator formları, eski hesaplama componentleri ve locale/mobile kaynaklı form kırıkları P2.4 kapsamında ayrıca taranıp kapatılacaktır. P3 Feedback / Formula Objection sistemi daha önceden deploy edilmiş (40bd28b commit) ve canlıda çalışmaktadır. Ancak P3 deploy edildiği sırada P2.4 form onarımı kanıtı eksik olduğu için P3, **EARLY IMPLEMENTED / RISK-GATED** olarak sınıflandırılmıştır ve P2.4 kapanış kanıtı üretildikten sonra, özellikle onarılmış free, legacy, premium, mobil, locale ve RTL form yüzeyleri üzerinde yeniden doğrulanacaktır.

> **P3 note (EN):** P3 Feedback / Formula Objection is live and deployed under commit `40bd28b`. It passed initial smoke testing but is classified as EARLY IMPLEMENTED / RISK-GATED because P2.4 form repair evidence was missing at deployment time. P3 must be revalidated after P2.4 closes, especially across all repaired calculation form surfaces.
>
> **P3 notu (TR):** P3 Feedback / Formula Objection canlıda, 40bd28b commit'i ile deploy edilmiştir. İlk smoke testini geçmiştir ancak P3 deploy edilirken P2.4 form repair kanıtı eksik olduğu için EARLY IMPLEMENTED / RISK-GATED olarak sınıflandırılmıştır. P2.4 kapandıktan sonra P3, özellikle onarılmış tüm hesaplama form yüzeyleri üzerinde yeniden doğrulanacaktır.

---

## Success metrics (product)

| Metric | Signal |
|--------|--------|
| Premium route smoke 27/27 | Availability |
| Smart form smoke 27/27 | Premium Smart Form surface complete (P2.3 — not all forms) |
| All calculation forms smoke | P2.4 closure gate — pending |
| Locale smoke 42/42 | Global readiness |
| Formula + dual-intelligence audit PASS | Engineering trust |
| Conversion: preview → calculate → Pro | Revenue learning |

---

*Last updated: 2026-06-10*