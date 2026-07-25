# SectorCalc Calculation Sheet Theme v2.0

## Calculator-only engineering drawing theme

**Rule:** This package applies only to calculator pages. `index.html`, `sc-hero-cell.js`, and `sc-hero-engine.js` must not be modified.

---

## File layout

```
sectorcalc-calc-sheet-theme/
├── calculation-sheet.css      # Isolated CSS — calculator pages only (cs- prefix)
├── sc008-calc-sheet.html      # SC-008 reference template (NOT a live drop-in)
└── README.md                  # This file
```

---

## Deploy steps (branch → review → live)

### 1. Create branch

```bash
git checkout main
git pull origin main
git checkout -b feat/calc-sheet-sc008-isolated
```

### 2. Copy files

```bash
mkdir -p public/css
cp calculation-sheet.css public/css/

# Do NOT overwrite live sc008-pro.html with the mock template.
# Keep the reference under content/templates/ and migrate classes minimally.
```

### 3. Guards (required)

```bash
npm run build

git diff --name-only | grep "index.html" && echo "FAIL: index.html changed" || echo "OK: index.html untouched"
git diff --name-only | grep "sc-hero-cell.js" && echo "FAIL: sc-hero-cell.js changed" || echo "OK: sc-hero-cell.js untouched"
git diff --name-only | grep "sc-hero-engine.js" && echo "FAIL: sc-hero-engine.js changed" || echo "OK: sc-hero-engine.js untouched"
```

### 4. Commit and PR (no Firebase deploy until approval)

```bash
git add public/css/calculation-sheet.css sc008-pro.html scripts/inject-calc-sheet.mjs scripts/verify-seo.mjs
git commit -m "feat(calc): isolated calculation-sheet theme for SC-008"
git push origin HEAD
# Open PR → review → merge only after approval
```

---

## Migrating an existing calculator

Keep the live ~72KB `sc008-pro.html` structure. Change classes only:

| Previous | New | Notes |
|----------|-----|--------|
| `.theme-calc-sheet` | `.calc-sheet` (+ optional `.has-grid`) | Body wrapper |
| — | link `/css/calculation-sheet.css` | Isolated stylesheet |
| Existing engine IDs | unchanged | Forms, results, charts |

**Critical:** Do not rename live element `id`s used by the engine.

Minimal migration:

```html
<link rel="stylesheet" href="/css/calculation-sheet.css?v=1">
<body class="calc-sheet has-grid" ...>
```

---

## Guard checklist (every PR)

- [ ] `index.html` not in the diff
- [ ] `sc-hero-cell.js` not in the diff
- [ ] `sc-hero-engine.js` not in the diff
- [ ] Calculator page loads
- [ ] Inputs calculate; audit trail visible
- [ ] Nav links work (Home, Tools)
- [ ] Mobile layout OK
- [ ] No Firebase deploy until review approval

---

## Hard rules

1. `index.html` never changes in this package.
2. Hero JS never changes.
3. CSS uses `cs-` / `.calc-sheet` isolation.
4. Calculator engine JS is not replaced by the reference HTML mock.
5. No Firebase deploy until review OK and guards PASS.

## Follow-ups (separate PRs)

- Other calculators (SC-020, SC-010, SC-001, …) using the same CSS
- `tools.html` drawing-index theme
- `pricing.html` BOM theme
