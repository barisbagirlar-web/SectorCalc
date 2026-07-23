# AGENTS.md — SECTORCAL

Read `DECISIONS.md` and `.cursorrules` before writing code.

## Node lock

- `.nvmrc` = `20.11.1` (exact). Run `nvm use` in this repo.
- `package.json` → `engines.node` = `>=20.0.0` (PHASE 3); local/CI use `.nvmrc`.
- `.npmrc` → `engine-strict=true`
- CI reads `.nvmrc` via `node-version-file`

## Hard rules

1. **UI** = Vanilla JS + Lit Web Components. Never React/Vue/Next/Angular.
2. **Money** = `src/money` + Decimal.js. Amounts in JSON are **strings**. Never `Number`.
3. **Payments** = Paddle (MoR). Never Stripe. **Paddle SDK install is a later phase.**
4. **Schemas** = `schemas/*.json` with `$schema` Draft **2020-12** only.
5. **Data** = JSON only. No protobuf / MessagePack / CBOR / custom binary.
6. **Theme / report contrast** = use `public/sc-theme.css` tokens + `src/lib/theme-palette.ts` for SVG/canvas/html2canvas. Never hardcode light-theme ink (`#1A1714`) into report graphics. New `*-pro` tools must follow the same pattern and re-render open reports on `sectorcalc-theme`.

## Commands

```bash
nvm use
npm run schema:validate
npm test
npm run check
npm run dev
```

## Default reply to "what if we used X?"

**No — locked by DECISIONS.md #N.** Implement with the approved stack.
