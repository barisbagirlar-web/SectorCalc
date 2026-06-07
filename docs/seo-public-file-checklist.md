# SEO Public File Checklist

Verify these static files after every production deploy.

**Base URL:** `https://sectorcalc-bf412.web.app` (or production domain)

---

## robots.txt

**URL:** `/robots.txt`

Expected:
- [ ] HTTP 200
- [ ] `Sitemap:` line points to live sitemap URL
- [ ] `Disallow: /admin/` present
- [ ] `Disallow: /api/` present
- [ ] Print routes disallowed for generic crawlers (`/*/tools/premium-schema/*/print`)
- [ ] Public paths **not** disallowed (`/en/free-tools`, `/en/seo/…`, `/en/guides/…`)

Source: `src/app/robots.ts`

---

## sitemap.xml

**URL:** `/sitemap.xml`

Expected:
- [ ] HTTP 200
- [ ] Valid XML sitemap index or urlset
- [ ] Contains `/en/free-tools`, `/en/premium-tools`
- [ ] Contains free tool URLs (`/en/tools/free/…`)
- [ ] Contains premium analyzer URLs (`/en/tools/premium-schema/…`) — **not** `/print`
- [ ] Contains SEO hub URLs (`/en/seo/…`)
- [ ] Contains authority guide URLs (`/en/guides/…`)
- [ ] Does **not** contain `/admin`, `/api`, or `/print`

Source: `src/app/sitemap.ts` → `buildSitemapEntries()`

Cross-check EN paths against `getIndexableUrlManifest()` — all manifest EN paths should appear in sitemap.

---

## llms.txt

**URL:** `/llms.txt`

Expected:
- [ ] HTTP 200
- [ ] Primary site URL documented
- [ ] Hub links: `/en/free-tools`, `/en/premium-tools`, `/en/categories`, `/en/industries`, `/en/pricing`
- [ ] Programmatic SEO hub references
- [ ] Authority guide URLs (8 guides)
- [ ] Free/premium counts accurate
- [ ] No `[object Object]` or placeholder garbage

Regenerate: `npm run seo:llms`

---

## sectorcalc-index.txt

**URL:** `/sectorcalc-index.txt`

Expected:
- [ ] HTTP 200
- [ ] Core services listed (free calculators, premium reports)
- [ ] Industry category links
- [ ] Programmatic SEO hub links
- [ ] Authority guide section

Regenerate: `npm run seo:authority-txt`

---

## services-products.txt

**URL:** `/services-products.txt`

Expected:
- [ ] HTTP 200
- [ ] Pricing tiers documented (Free, single report, Pro, Team)
- [ ] Free calculator catalog reference
- [ ] Premium analyzer catalog reference
- [ ] No fabricated certifications or user counts

---

## faq-knowledge.txt

**URL:** `/faq-knowledge.txt`

Expected:
- [ ] HTTP 200
- [ ] Core FAQ: What is SectorCalc, ERP question, free vs premium
- [ ] Topic definitions: OEE, scrap rate, route deadhead, peak exposure, carbon
- [ ] Authority guide topic summaries and URLs
- [ ] Disclaimer: not financial/legal/engineering advice

---

## Quick manual curl checks

```bash
HOST=https://sectorcalc-bf412.web.app
for path in robots.txt sitemap.xml llms.txt sectorcalc-index.txt services-products.txt faq-knowledge.txt; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$HOST/$path")
  echo "$path → $code"
done
```

---

## Related docs

- [gsc-url-inspection-checklist.md](./gsc-url-inspection-checklist.md)
- [search-console-indexnow-runbook.md](./search-console-indexnow-runbook.md)
- [indexnow-setup.md](./indexnow-setup.md)
