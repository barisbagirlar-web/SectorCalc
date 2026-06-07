# SectorCalc Locale Copy Style Guide

## Core rule
Do not translate words. Localize product intent.

Every locale must read like a product written for that market — not a translation of English.

## English
Tone:
- direct
- professional
- operational
- concise
- global B2B SaaS

Use:
- Calculate
- Measure
- Estimate
- View report
- Unlock decision report
- Hidden loss
- Threshold
- Exposure
- Export-ready report

Avoid:
- overly casual copy
- hype
- fake certainty
- marketing fluff

## Turkish
Tone:
- sahaya yakın
- net
- ciddi
- fazla kurumsal olmayan ama güven veren
- karar ve hesap odağı

Use:
- Hesapla
- Ölç
- Görünmeyen kayıp
- Karar raporu
- Eşik kontrolü
- Tahmini risk
- Raporu aç
- Hesaplama aracı

Avoid:
- birebir İngilizce çeviri
- "gizli kayıp teşhisi" gibi yapay kalıplar
- aşırı teknik bankacı/akademik dil
- "unlock" karşılığı olarak "kilidi aç" gibi yapay ifade

## German
Tone:
- precise
- technical
- structured
- trust-oriented

Use:
- Berechnen
- Messen
- Kostenrisiko
- Entscheidungsbericht
- Schwellenwert
- Verlusttreiber
- Bericht öffnen

Avoid:
- overly long button text
- English SaaS buzzwords
- casual startup tone

## French
Tone:
- professional
- clear
- formal but not bureaucratic
- decision-oriented

Use:
- Calculer
- Mesurer
- Rapport de décision
- Risque de perte
- Seuil critique
- Analyse premium

Avoid:
- literal English structure
- overly aggressive sales copy

## Spanish
Tone:
- practical
- clear
- business-friendly
- not overly formal

Use:
- Calcular
- Medir
- Informe de decisión
- Pérdida oculta
- Umbral
- Riesgo operativo

Avoid:
- machine-translated terms
- overly long legal wording

## Arabic
Tone:
- professional
- clear
- modern business Arabic
- concise

Use:
- احسب
- قِس
- تقرير القرار
- الخسائر غير المرئية
- حدود التنبيه
- المخاطر التشغيلية

Avoid:
- literal English sentence order
- long decorative Arabic
- broken RTL punctuation

---

## QA checklist (literal-translation smell)

Before shipping any locale copy change, verify:

- [ ] CTA reads like a native product button, not a dictionary entry
- [ ] No English sentence structure copied into TR/DE/FR/ES/AR
- [ ] Same glossary term used everywhere (see `src/lib/i18n/locale-glossary.ts`)
- [ ] Error messages are user-facing, not technical (`errors.*` keys)
- [ ] Legal note is serious and natural in that language
- [ ] Premium report section titles match glossary (`premiumReport.*`)
- [ ] SEO title/description written for that market, not copied from EN
- [ ] No `TODO`, `placeholder`, `Coming soon`, `undefined`, `null` in message values
- [ ] Arabic: RTL layout intact at 390px; numbers readable
- [ ] German: button/card text does not overflow at 390px

## New tool / schema checklist (required)

When adding a new calculator, premium schema, or public page:

1. Add or reuse glossary terms in `locale-glossary.ts`
2. Add CTA keys to `locale-cta.ts` if new actions are introduced
3. Fill all six `messages/*.json` files — no English fallback on public UI
4. Run `npm run test` — `locale-copy-quality.test.ts` must pass
5. Manual spot-check: `/`, `/tr`, `/de`, `/fr`, `/es`, `/ar` on the new route
6. Confirm SEO metadata uses localized `seo.*` patterns
