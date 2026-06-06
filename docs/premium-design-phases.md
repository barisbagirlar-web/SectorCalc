# SectorCalc Premium Design — 5-Phase Implementation

## Goal
Transform SectorCalc from calculator-style MVP into a premium B2B margin decision platform.

## Design Standard
Stripe simplicity · Linear clarity · Vercel technical trust · Big Four report seriousness

## Hard Constraints (unchanged)
- 17 sectors / 34 tool routes preserved
- No `/admin/leads` refactor
- Firestore `nam5`, Functions `us-central1`
- No `src/app/api` for Stripe
- No fake trust badges or testimonials

## 20 Design Items — All Applied (phased)

| # | Item | Phase |
|---|------|-------|
| 1 | Visual hierarchy | 1–2 |
| 2 | Color discipline | 1 |
| 3 | Typography (Inter only) | 1 |
| 4 | CTA system (56px) | 1–2 |
| 5 | Card standard | 1 |
| 6 | Spacing system | 1–2 |
| 7 | Mobile UX | 2–5 |
| 8 | Form design | 3 |
| 9 | Loading states | 3 |
| 10 | Empty states | 4 |
| 11 | Tooltip / hints | 3–5 |
| 12 | Error handling | 3 |
| 13 | Success states | 3 |
| 14 | Navigation | 2 |
| 15 | Footer trust | 2 |
| 16 | Heroicons only | 1–5 |
| 17 | Micro-interactions | 5 |
| 18 | Accessibility | 1, 5 |
| 19 | Dark mode | 5 |
| 20 | Premium feel | 1–5 |

## Phase Checklist

### Phase 1 — Design System Foundation
- [x] `src/styles/design-system.css` tokens
- [x] Inter-only typography
- [x] `SurfaceCard`, `Button` cta size
- [x] `FieldHint` (Heroicons)
- [x] Tailwind `darkMode: class`

### Phase 2 — Homepage Premium Redesign
- [x] Funnel order: Hero → Pain → Free Check → Sample Report → Sectors → Free vs Pro → Pricing → Trust → CTA
- [x] Nav: Free Checks · Premium Verdicts · Industries · Pricing · Login + Run Free Check
- [x] Footer 4-column structure

### Phase 3 — Tool UX
- [x] FreeToolPage: loading, success, validation, hints
- [x] PremiumToolPage: verdict-first layout, loading, hints

### Phase 4 — Account / Reports
- [x] Reports empty state copy + CTA
- [x] Report list cards

### Phase 5 — Premium Polish
- [x] Dark mode toggle + palette
- [x] Card hover, reveal animations
- [ ] Final a11y audit pass (manual)

## Quality Gate (each phase)
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run audit:revenue-tools
```
