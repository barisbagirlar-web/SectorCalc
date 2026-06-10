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

1. **Complete P2.3** — 27/27 Smart Form + smoke gate + production verify  
2. **Stabilize revenue path** — public preview → Pro conversion without hard gate  
3. **Defer P10 AI** until deterministic loop + Trust Trace foundation solid  

---

## Success metrics (product)

| Metric | Signal |
|--------|--------|
| Premium route smoke 27/27 | Availability |
| Smart form smoke 27/27 | Product surface complete |
| Locale smoke 42/42 | Global readiness |
| Formula + dual-intelligence audit PASS | Engineering trust |
| Conversion: preview → calculate → Pro | Revenue learning |

---

*Last updated: 2026-06-10*
