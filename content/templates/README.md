# Calculator tool templates

Use these when adding a new SectorCalc calculator. Do not invent a third form layout.

| Template | Kind | Value+unit wrap |
|----------|------|-----------------|
| `tool-pro-lit.html` | Lit / sidebar (`--kind lit`) | `.sc-input-wrap` |
| `tool-pro-engine.html` | Engine / panels (`--kind engine`) | `.uwrap` |

## Scaffold

```bash
npm run new:tool -- --id SC-030 --slug gear --title "Gear Ratio" --kind lit
npm run build
```

## Locked assets

- `public/sc-form-fields.css` — readability rules (also pulled into `sc-theme.css`)
- `scripts/verify-form-fields.mjs` — build gate
- `.cursor/rules/calc-form-fields.mdc` — agent rule

Digits in inputs must never clip. Never set `min-width:0` on value inputs beside units.
