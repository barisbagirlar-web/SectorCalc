# SectorCalc Quick Launch Checklist

Pre-share and post-share checks before distributing campaign links. Full operations: [Final Launch Command Center](./final-launch-command-center.md).

**Live host:** verify against production URL from `SITE_BASE_URL` / Firebase hosting.

---

## Before sharing

### Build & deploy

- [ ] Production build passed (`npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`)
- [ ] Latest deploy successful ([deployment checklist](./deployment-checklist.md))

### Core routes (EN)

- [ ] Homepage opens
- [ ] `/en/free-tools` opens
- [ ] `/en/premium-tools` opens
- [ ] `/en/pricing` opens

### SEO public files

- [ ] `/sitemap.xml` opens
- [ ] `/robots.txt` opens
- [ ] `/llms.txt` opens
- [ ] Sitemap excludes admin, api, print routes

### Tier-1 smoke tests

- [ ] [Area converter](/en/tools/free/area-converter) — calculate works
- [ ] [OEE calculator](/en/tools/free/oee-calculator) — calculate works
- [ ] [CNC OEE loss analyzer](/en/tools/premium-schema/cnc-oee-loss) — preview loads
- [ ] Premium locked CTA works (unlock/pricing path, no export leak)

### Quality

- [ ] Mobile 390px — no horizontal scroll on homepage + one free + one premium page
- [ ] Console clear on spot-checked pages
- [ ] Network clear — no failed critical assets

---

## After sharing

- [ ] Check conversion events (opens, calculates, premium clicks)
- [ ] Check GSC for crawl/index signals
- [ ] Check beta partner form submissions
- [ ] Check pricing CTA clicks
- [ ] Write daily note (command center checklist or Week-1 report)

---

## If any before-share item fails

1. Classify severity: [Launch Incident Response](./launch-incident-response.md)
2. Do not share new campaign links until blockers cleared
3. Fix → test → deploy → re-run this checklist
