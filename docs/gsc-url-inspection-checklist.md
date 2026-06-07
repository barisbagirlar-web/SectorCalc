# Google Search Console URL Inspection Checklist

Use this checklist after deploying the Enterprise SEO Authority Architecture patch.

## Priority inspect URLs

1. `/en`
2. `/en/free-tools`
3. `/en/premium-tools`
4. `/en/categories`
5. `/en/industries`
6. `/en/seo/manufacturing-cost-calculators`
7. `/en/tools/free/area-converter`
8. `/en/tools/free/oee-calculator`
9. `/en/tools/free/concrete-volume-calculator`
10. `/en/tools/premium-schema/cnc-oee-loss`
11. `/en/tools/premium-schema/carbon-footprint-compliance-risk`

## Turkish locale spot checks

- `/tr/free-tools`
- `/tr/premium-tools`
- `/tr/seo/manufacturing-cost-calculators`

## Authority TXT files

- `/llms.txt`
- `/sectorcalc-index.txt`
- `/services-products.txt`
- `/faq-knowledge.txt`

## GSC tasks

- [ ] URL inspection for each priority URL
- [ ] Request indexing for new or updated hub pages
- [ ] Review Coverage report for excluded pages
- [ ] Confirm `/admin`, `/api`, and print routes are not indexed
- [ ] Mobile usability check on homepage and one free tool page
- [ ] Page indexing status: "URL is on Google" for core hubs
- [ ] Rich Results test (Organization, BreadcrumbList, FAQPage where present)
- [ ] Submit sitemap: `https://sectorcalc.com/sitemap.xml`
- [ ] Core Web Vitals: LCP, INP, CLS on homepage and `/en/free-tools`

## Structured data checks

- [ ] Homepage: Organization + WebSite + SoftwareApplication JSON-LD
- [ ] Free tool page: Breadcrumb + WebApplication (+ FAQ when featured answer present)
- [ ] Premium analyzer: Breadcrumb + SoftwareApplication + Service + FAQ
- [ ] SEO hub: Breadcrumb + ItemList + FAQ
- [ ] No fake ratings, reviews, or prices in JSON-LD

## Crawl index visibility

- [ ] Hub pages show visible HTML link lists (Calculator index section)
- [ ] Links resolve without JavaScript
- [ ] Internal links connect hubs → tools → pricing

## Optional IndexNow

If `INDEXNOW_KEY` is configured:

```bash
npm run seo:indexnow
```

Verify key file exists at `public/{INDEXNOW_KEY}.txt`.
