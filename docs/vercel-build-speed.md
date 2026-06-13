# Vercel Build Speed Optimization

**V1 audit date:** 2026-06-14  
**V2 implementation date:** 2026-06-14 — preview static-params limiting (production unchanged)

**Scope:** Preview deploy acceleration + safer Ignored Build Step. No deploy from this phase.

---

## V2 — Preview static params limiting (implemented)

### Goal

Reduce Vercel **preview** build time by limiting heavy `generateStaticParams` output to a representative route subset. **Production** and normal local `npm run build` keep full static generation.

### Helper

`src/lib/build/preview-static-params.ts`

```ts
shouldUsePreviewStaticParams()
limitStaticParamsForPreview(params, { family, slugKey, localeKey, ... })
```

**Preview mode is ON when:**

- `VERCEL_ENV=preview`, or
- `SECTORCALC_FAST_PREVIEW_STATIC=1`

**Preview mode is OFF (full params) when:**

- `SECTORCALC_FORCE_FULL_STATIC=1` (rollback override)
- Local default build (no preview env)
- `VERCEL_ENV=production`

### Wrapped route families

| Route | Family |
|---|---|
| `/[locale]/tools/free/[slug]` | `free-tools` |
| `/[locale]/tools/premium/[slug]` | `premium-tools` |
| `/[locale]/tools/premium-schema/[slug]` | `premium-schema` |
| `/[locale]/tools/premium-schema/[slug]/print` | `premium-schema-print` |
| `/[locale]/seo/[slug]` | `seo` |
| `/[locale]/industries/[slug]` | `industries` |
| `/[locale]/audit/[sectorKey]` | `audit` |
| `/[locale]/case-studies/[slug]` | `case-studies` |
| `/[locale]/guides/[slug]` | `guides` |

Representative slugs and default `tr`/`en` locale filtering live in the helper. Revenue-gate **problem slug** (`abonelik-yazilim-cloud-yillik-maliyet-hesabi`) is always kept for premium preview params.

### Env flags

| Variable | Effect |
|---|---|
| `SECTORCALC_FAST_PREVIEW_STATIC=1` | Force preview static-param limiting (local simulation) |
| `SECTORCALC_FORCE_FULL_STATIC=1` | Disable limiting — full params even on preview |
| `VERCEL_ENV=preview` | Auto-enable limiting on Vercel preview deploys |

### Local simulation

```bash
rm -rf .next
VERCEL_ENV=preview SECTORCALC_FAST_PREVIEW_STATIC=1 npm run build
```

Compare `Generating static pages (N/N)` vs a normal full build.

### Coverage report

```bash
npm run vercel:preview-static-report
```

Writes `scripts/.cache/vercel-preview-static-params-report.json` (gitignored cache).

### Rollback

1. Set `SECTORCALC_FORCE_FULL_STATIC=1` on the Vercel preview environment, **or**
2. Revert `limitStaticParamsForPreview` wrappers in route files.

### Risks

- Preview deploys may not pre-render every tool/SEO route at build time (expected).
- Production deploys are **not** affected when `VERCEL_ENV=production`.
- **Blocker:** If `next.config.*` uses `output: "export"`, do not apply this strategy — static export may require all params.

---

## V1 — Build speed audit (baseline)

---

## Executive summary

SectorCalc generates **4,466 static HTML pages** across **6 locales**. Local end-to-end build time is **~47 s** (prebuild ~4 s + Next.js ~43 s). On Vercel, the same workload typically runs **3–8 minutes** because of cold cache, network I/O, and sequential SSG worker limits.

The dominant cost is **static page generation (SSG)**, not compilation. Tool route families (`/tools/free`, `/tools/premium`, `/tools/premium-schema`) account for **~82%** of generated pages and carry the heaviest JS bundles (1.2–1.73 MB First Load JS per route family).

---

## Build pipeline today

| Phase | Script / step | Local time (approx.) | Notes |
|---|---|---|---|
| Prebuild | `lint:schemas` (vitest) | ~0.3 s | Runs before every build |
| Prebuild | `export:ai-index` | ~1.5 s | Regenerates 6 `public/ai-*` files (~5.5 MB) |
| Prebuild | `seo:authority-txt` | ~0.5 s | Writes `public/*-index.txt` |
| Prebuild | `seo:export-manifest` | ~0.5 s | Writes `scripts/.cache/indexable-urls.json` (gitignored) |
| Next compile | `next build` | ~6.7 s | Single compile pass |
| Next lint + tsc | inside `next build` | ~5–10 s | ESLint + typecheck gate |
| SSG | `Generating static pages` | **~25–30 s** | **4,466 pages** — main bottleneck |
| Postbuild | `ensure-500-export.mjs` | <1 s | Hosting fallback |

**`package.json` hooks:**

```json
"prebuild": "npm run lint:schemas && npm run export:ai-index && npm run seo:authority-txt && npm run seo:export-manifest",
"build": "next build",
"postbuild": "node scripts/ensure-500-export.mjs"
```

There is **no `vercel.json`** in the repo. Vercel uses default Next.js detection with `build` = `npm run build` (which triggers `prebuild`).

---

## Static page count

**Authoritative:** Next.js build output reports `Generating static pages (4466/4466)`.

| Route family | Slugs (en) | × locales (6) | Static paths | First Load JS (route) |
|---|---:|---:|---:|---|
| `/[locale]/tools/free/[slug]` | 245 | 6 | **1,470** | 1.2 MB |
| `/[locale]/tools/premium/[slug]` | 139 | 6 | **834** | 1.73 MB |
| `/[locale]/tools/premium-schema/[slug]` | 81 | 6 | **486** | 1.6 MB |
| `/[locale]/tools/premium-schema/[slug]/print` | 81 | 6 | **486** | 860 kB |
| `/[locale]/seo/[slug]` | 58 | 6 | **348** | 352 kB |
| `/[locale]/tools/[tier]/[slug]` (legacy) | 7 | 6 | 42 | 399 kB |
| `/[locale]/industries/[slug]` | 27 | 6 | 162 | — |
| `/[locale]/premium-tools/[categorySlug]` | 20 | 6 | 120 | — |
| `/[locale]/guides/[slug]` | 8 | 6 | 48 | — |
| `/[locale]/audit/[sectorKey]` | 27 | 6 | 162 | force-dynamic* |
| `/[locale]/case-studies/[slug]` | 14 | 6 | 84 | locale in GSP |
| Marketing / account / static `[locale]/*` | ~35 | 6 | ~210 | 351 kB avg |
| Admin + API routes | — | — | 12 dynamic (ƒ) | — |

\* `audit/[sectorKey]` sets `dynamic = "force-dynamic"` but still exports `generateStaticParams` — params are precomputed yet rendered dynamically. Worth revisiting in a later phase.

**Locale multiplier:** All `[locale]` nested routes inherit 6 locales (`en`, `tr`, `de`, `fr`, `es`, `ar`) from `src/i18n/routing-config.ts`.

---

## Heavy route families (ranked)

1. **Free tools** — 1,470 paths, largest count, heavy calculator imports per page.
2. **Premium revenue tools** — 834 paths, heaviest bundle (1.73 MB).
3. **Premium schema calculators** — 486 + 486 print = 972 paths; print runs schema engine at build time.
4. **Programmatic SEO hubs** — 348 paths; `revalidate = 3600` (ISR metadata, still fully pre-rendered).
5. **Industries + audit sectors** — 324 combined paths.

SSG time scales roughly linearly with page count × per-page data/compute. Premium-schema print pages call `runPremiumSchemaEngine` during static generation — CPU-heavy.

---

## `generateStaticParams` inventory

| File | Params source | Locale handling |
|---|---|---|
| `src/app/[locale]/layout.tsx` | `routing.locales` | 6 locale roots |
| `src/app/[locale]/tools/free/[slug]/page.tsx` | `listAllFreeToolSlugs()` | ×6 via layout |
| `src/app/[locale]/tools/premium/[slug]/page.tsx` | `listAllPremiumToolRouteSlugs()` | ×6 |
| `src/app/[locale]/tools/premium-schema/[slug]/page.tsx` | `listPremiumSchemaSlugs()` | ×6 |
| `src/app/[locale]/tools/premium-schema/[slug]/print/page.tsx` | `listPremiumSchemaSlugs()` | ×6 |
| `src/app/[locale]/seo/[slug]/page.tsx` | programmatic + premium SEO slugs | ×6 |
| `src/app/[locale]/guides/[slug]/page.tsx` | `listAuthorityGuideSlugs()` | ×6 |
| `src/app/[locale]/industries/[slug]/page.tsx` | `industryRegistry` | ×6 |
| `src/app/[locale]/premium-tools/[categorySlug]/page.tsx` | `listPremiumCatalogCategorySlugs()` | ×6 |
| `src/app/[locale]/tools/[tier]/[slug]/page.tsx` | 7 hardcoded legacy slugs | ×6 |
| `src/app/[locale]/case-studies/[slug]/page.tsx` | `locales × listCaseStudySlugs()` | explicit in GSP |
| `src/app/[locale]/audit/[sectorKey]/page.tsx` | `locales × listSectorRegistryKeys()` | explicit in GSP |

All tool routes use `dynamic = "force-static"` and `dynamicParams = false`.

---

## Root causes of slow builds

### 1. SSG volume (primary)

4,466 pages × (metadata + RSC payload + HTML) dominates wall time. Free + premium + schema families alone = **3,780 pages (85%)**.

### 2. Prebuild regeneration chain

Every build runs four scripts even when source unchanged:

- `export:ai-index` — TypeScript compile + write **~5.5 MB** to `public/ai-*`
- `seo:export-manifest` — walks full indexable URL manifest (2,647 URLs)
- `lint:schemas` — vitest smoke

These add ~4 s locally but also **touch tracked files** (`public/ai-*`), which can invalidate Vercel's build cache when committed or when output timestamps change.

### 3. Cache-breaking files

| Path | Tracked in git | Size | Regenerated | Cache impact |
|---|---|---:|---|---|
| `public/ai-tool-index.json` | yes | 2.3 MB | every prebuild | High — large blob diff |
| `public/ai-embedding-source.jsonl` | yes | 2.5 MB | every prebuild | High |
| `public/ai-tool-routes.json` | yes | 393 KB | every prebuild | Medium |
| `public/ai-tool-index.txt` | yes | 210 KB | every prebuild | Medium |
| `public/ai-categories.json` | yes | 31 KB | every prebuild | Low |
| `scripts/.cache/indexable-urls.json` | gitignored | 221 KB | every prebuild | Low (not in deploy artifact) |
| `next-env.d.ts` | yes | tiny | Next auto-touch | Low but noisy in git status |
| `package-lock.json` | yes | — | dependency changes | Full cache bust |

**Current git noise:** `public/ai-*` and `next-env.d.ts` show as modified after every local build — evidence that prebuild output is not byte-stable across runs (likely `generatedAt` timestamps or tool-count drift).

### 4. Lint + typecheck inside `next build`

Next.js 15 runs ESLint and TypeScript during production build. Correct for safety; adds ~5–10 s. Cannot remove without `eslint.ignoreDuringBuilds` / `typescript.ignoreBuildErrors` (not recommended for production).

### 5. Heavy per-page imports

Premium tool and schema pages import calculator engines, semantic contracts, and i18n resolution at build time. Bundle sizes (1.6–1.73 MB) indicate large module graphs parsed per route worker.

---

## Preview vs production static route strategy

### Production (must not regress)

- Keep full SSG for all indexable tool, SEO, and guide routes.
- Keep `dynamicParams = false` on revenue/tool routes (404 for unknown slugs — SEO + safety).
- Keep `prebuild` export chain OR replace with CI-generated artifacts checked in deliberately (not skipped silently).
- **`VERCEL_ENV=production` → always build** (enforced in `scripts/vercel/ignore-build.mjs`).
- **`VERCEL_ENV=production` → full `generateStaticParams`** (preview limiting disabled).

### Preview (V2 — implemented)

| Option | Speed gain | Risk | Status |
|---|---|---|---|
| **Ignored Build Step** for docs-only commits | Skip entire build (~3–8 min) | Low if production guard present | **V1** |
| **Env-gated `generateStaticParams` subset** (`VERCEL_ENV=preview`) | Large (SSG ∝ pages) | Medium — preview URLs missing for uncapped slugs | **V2** |
| Preview: `dynamicParams = true` on free tools only | Large | Low for preview; must not ship to prod | Deferred |
| Split prebuild: skip `export:ai-index` when inputs unchanged | ~1–2 s + cache stability | Low if hash check on source registries | V3 |
| Move `public/ai-*` to gitignore + CI publish step | Better cache hit rate | Medium — deploy must guarantee files exist | V3 |
| ISR / `revalidate` for low-traffic schema print routes | Moderate | Medium — changes freshness guarantees | V3 |

**V2 preview pattern (implemented in `src/lib/build/preview-static-params.ts`):**

```ts
const params = listAllFreeToolSlugs().map((slug) => ({ slug }));
return limitStaticParamsForPreview(params, {
  family: "free-tools",
  slugKey: "slug",
});
```

Document preview deploy purpose: UI/UX review and marketing copy — not full catalog QA (use production build or `npm run build` locally for that).

---

## Ignored Build Step

### Vercel semantics (critical)

| Exit code | Vercel action |
|---|---|
| **0** | **Skip** the build (deployment uses previous production artifact for that branch context) |
| **1** | **Run** the build |

### Script

`scripts/vercel/ignore-build.mjs`

**Logic:**

1. `VERCEL_ENV=production` → **exit 1** (always build production).
2. Diff `VERCEL_GIT_PREVIOUS_SHA` → `VERCEL_GIT_COMMIT_SHA`; if diff unavailable → **exit 1**.
3. If diff empty → exit 0 (nothing changed).
4. If any changed file matches `src/**`, `app/**`, `package.json`, `package-lock.json`, `next.config.*`, `tsconfig.*`, `messages/**`, `scripts/**`, or `public/**` → **exit 1** (build).
5. If **all** changed files are `docs/**`, `README*`, or `*.md` → **exit 0** (skip).
6. Unclassified paths → **exit 1** (fail open).

Logs: `ignore-build: skip` or `ignore-build: build required`.

**Note:** `public/ai-*` changes alone still trigger a build (generated blobs must not skip production deploys).

### Vercel dashboard setup (manual)

Project Settings → Git → **Ignored Build Step**:

```
node scripts/vercel/ignore-build.mjs
```

Optional npm alias: `npm run vercel:ignore-build`

### What this does NOT skip

- Production deploys (hard guard).
- Any commit touching application source, config, or non-ai public assets.
- First deploy / missing SHAs (defaults to build).

---

## `public/ai-*` generated file strategy

### Current state

Six files (~5.5 MB total) regenerated by `scripts/export-ai-index.mjs` → `scripts/run-export-ai-index.ts` on every prebuild. All are **tracked in git**.

Files: `ai-tool-index.json`, `ai-tool-index.txt`, `ai-categories.json`, `ai-tool-routes.json`, `ai-search-manifest.json`, `ai-embedding-source.jsonl`, plus `llms.txt`.

### Problems

1. **Build cache invalidation** — any byte change in 2.5 MB JSONL forces re-upload to Vercel.
2. **Git noise** — developers see `public/ai-*` modified after every build.
3. **Redundant work** — export runs even when tool registries unchanged.

### Recommended strategy (phased)

| Phase | Action |
|---|---|
| **V1 (now)** | Document; do **not** commit auto-regenerated `public/ai-*` from local builds. |
| **V2** | Add content-hash guard in `export-ai-index.mjs`: skip write when registry inputs unchanged. |
| **V3** | Gitignore `public/ai-*`; generate in CI prebuild with stable sorting; assert files exist before `next build`. |
| **V3 alt** | Serve AI index from a Cloud Function / edge route (out of scope for V1). |

**Rule for this repo:** `public/ai-*` changes from build should not be staged unless an intentional catalog export was run (`npm run export:ai-index` as a dedicated commit).

---

## `next.config.ts` observations

- `optimizePackageImports` for `lucide-react`, `@heroicons/react` — good, keep.
- `staticGenerationRetryCount: 3` — adds retry overhead on flaky pages; acceptable for reliability.
- No `output: "standalone"` — default Next output; fine for Vercel.
- **No config change recommended in V1.**

---

## Risk matrix

| Change | Build impact | Prod risk | SEO risk | Reversible | Phase |
|---|---|---|---|---|---|
| Ignored Build Step (docs-only skip) | High skip rate for doc PRs | None if prod guard | None | Yes | V1 |
| Preview GSP cap | Large preview speedup | High if leaked to prod | High if leaked | Yes | V2 |
| Gitignore `public/ai-*` | Better cache hits | Medium if deploy misses export | Low | Yes | V3 |
| Skip prebuild when hash unchanged | ~4 s + cache stability | Low | None | Yes | V2 |
| `eslint.ignoreDuringBuilds` | ~5 s | Medium (quality gate loss) | None | Yes | Not recommended |
| Remove print route SSG | ~486 pages | Medium (PDF/print URLs) | Medium | Partial | V3 |
| Reduce locales in preview | ~6× speedup | None in preview | None in preview | Yes | V2 |

---

## Measurement checklist (next deploy)

After enabling Ignored Build Step on Vercel:

1. Note build duration for a **full** production deploy (baseline).
2. Push a **docs-only** commit → expect build skipped (exit 0).
3. Push a **src/** change → expect full build (exit 1).
4. Compare Vercel "Build Cache" hit/miss in deployment logs.

Local re-measure:

```bash
time npm run prebuild
time npm run build
# Look for: Generating static pages (N/N)
```

---

## Files touched

**V2:**

- `src/lib/build/preview-static-params.ts` — preview limiting helper
- `src/app/[locale]/tools/**`, `seo`, `industries`, `audit`, `case-studies`, `guides` — `generateStaticParams` wrappers
- `scripts/vercel/preview-static-params-report.mjs` — coverage report
- `scripts/vercel/ignore-build.mjs` — stricter docs-only skip + `public/**` always builds
- `docs/vercel-build-speed.md` — V2 notes
- `package.json` — `vercel:preview-static-report` script

**V1 audit:**

- `docs/vercel-build-speed.md` (baseline audit sections)
- `scripts/vercel/ignore-build.mjs` (Ignored Build Step gate)
- `package.json` — `vercel:ignore-build` script alias

**Not changed:** `next.config.ts` (`output: "export"` not present), formula logic, `public/ai-*` tracking policy (documented only).
