# Search Console & IndexNow Runbook

Step-by-step execution for first indexing after a production deploy.

---

## Step 1 — Deploy latest build

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
firebase deploy --only hosting --project sectorcalc-bf412
```

Prebuild automatically exports the indexable URL manifest to `scripts/.cache/indexable-urls.json`.

---

## Step 2 — Verify public files

Use [seo-public-file-checklist.md](./seo-public-file-checklist.md).

Minimum live checks:

| URL | Expect |
|-----|--------|
| `https://sectorcalc-bf412.web.app/robots.txt` | 200, admin/api disallowed |
| `https://sectorcalc-bf412.web.app/sitemap.xml` | 200, public routes present |
| `https://sectorcalc-bf412.web.app/llms.txt` | 200, hub links |

Spot-check HTML pages:

- `/en/free-tools`
- `/en/premium-tools`
- `/en/seo/manufacturing-cost-calculators`
- `/en/guides/what-is-oee-and-how-to-calculate-it`
- `/en/tools/free/area-converter`
- `/en/tools/premium-schema/cnc-oee-loss`

Each should: HTTP 200 · correct canonical · no accidental noindex · JSON-LD present · mobile usable at 390px.

---

## Step 3 — Submit sitemap in Google Search Console

1. Open GSC property for `sectorcalc-bf412.web.app` (or production domain)
2. **Sitemaps** → submit:

```
https://sectorcalc-bf412.web.app/sitemap.xml
```

3. Wait for processing (hours to days)
4. Note discovered vs submitted URL counts

---

## Step 4 — Inspect priority URLs

Follow [gsc-url-inspection-checklist.md](./gsc-url-inspection-checklist.md):

- 13 critical EN URLs (homepage through premium analyzers)
- SEO landing pages (8)
- Authority guides (8)
- Rich Results Test on representative pages

For each priority URL:
1. URL Inspection
2. Test Live URL
3. Request Indexing
4. Verify canonical
5. Re-check after 24–72h

Manifest inspection order: `getIndexableUrlManifest()` sorted by `inspectionOrder`.

---

## Step 5 — IndexNow submit

Setup: [indexnow-setup.md](./indexnow-setup.md)

```bash
INDEXNOW_KEY=your-key-here SITE_HOST=sectorcalc-bf412.web.app npm run seo:indexnow
```

Without key (safe skip):

```bash
npm run seo:indexnow
# → warning, exit 0
```

Success = HTTP 200 from `api.indexnow.org` with submitted URL count.

---

## Step 6 — Bing Webmaster Tools

1. Add site property
2. Submit sitemap: `https://sectorcalc-bf412.web.app/sitemap.xml`
3. Verify IndexNow key file accessible
4. Monitor URL submission / indexing reports

---

## Step 7 — 24–72h review

In Google Search Console:

- [ ] **Pages** → indexing status for critical URLs
- [ ] **Pages** → “Crawled — currently not indexed” — investigate top entries
- [ ] **Pages** → “Discovered — currently not indexed” — request indexing + internal links
- [ ] **Experience** → Mobile usability — zero errors on templates
- [ ] **Enhancements** → FAQ / Breadcrumbs if applicable
- [ ] **Performance** → earliest impression data (may be sparse in week 1)

---

## Step 8 — Fix loop

If priority URLs are not indexed:

1. **Strengthen internal links** — hub → tool → guide → pricing in visible HTML
2. **Featured snippet block** — ensure `FeaturedAnswerBlock` visible on page
3. **Request indexing again** — after content/link fix
4. **Check canonical** — no duplicate locale or trailing-slash mismatch
5. **Check robots/noindex** — especially print/admin accidental inclusion
6. **Re-submit IndexNow** after bulk fixes

Track changes in GSC notes; align with [conversion-review-playbook.md](./conversion-review-playbook.md) for traffic events.

---

## Measurement checklist (weekly)

- [ ] Landing page visits by campaign (`utm_campaign`)
- [ ] Free tool opens / calculate events
- [ ] Free → premium click rate
- [ ] Premium unlock / pricing CTA clicks
- [ ] Beta partner submits
- [ ] GSC top queries
- [ ] Mobile usability
- [ ] Index coverage (excluded vs indexed)
- [ ] Sitemap errors

---

## Command reference

| Task | Command |
|------|---------|
| Export manifest | `npx tsx scripts/export-indexable-manifest.ts` |
| IndexNow submit | `INDEXNOW_KEY=… SITE_HOST=sectorcalc-bf412.web.app npm run seo:indexnow` |
| Regenerate TXT files | `npm run seo:authority-txt` |
| Full build | `npm run build` |
| Deploy hosting | `firebase deploy --only hosting --project sectorcalc-bf412` |

---

## Related docs

- [gsc-url-inspection-checklist.md](./gsc-url-inspection-checklist.md)
- [gsc-campaign-url-list.md](./gsc-campaign-url-list.md)
- [indexnow-setup.md](./indexnow-setup.md)
- [seo-public-file-checklist.md](./seo-public-file-checklist.md)
- [launch-campaign-content-pack.md](./launch-campaign-content-pack.md)

**Code references:**
- `src/lib/seo/indexable-url-manifest.ts`
- `src/lib/seo/build-sitemap.ts`
- `src/app/robots.ts`
- `scripts/submit-indexnow.mjs`
