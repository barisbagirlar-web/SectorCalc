# SectorCalc SEO Automation — n8n Workflows

These are importable [n8n](https://n8n.io) workflows that operationalize
SectorCalc's SEO mandate as scheduled, node-based pipelines (the n8n
methodology: *trigger -> fetch -> transform -> act*). They run **outside** the
Next.js app and never touch the "gold standard" build, so the core site stays
untouched.

> Companion CLIs (run the same logic locally / in CI):
> - `npm run seo:export-manifest` -> writes `public/url-manifest.json`
> - `npm run seo:indexnow` -> submits indexable URLs to IndexNow
> - `npm run seo:striking-distance` -> Google Search Console opportunity report

## Workflows (7 total)

| File | Purpose | Trigger | Credentials |
|---|---|---|---|
| `indexnow-resubmit.workflow.json` | Re-submit fresh URLs to IndexNow (Bing/Yandex/etc.) | Schedule (daily) | `INDEXNOW_KEY` env |
| `striking-distance-keywords.workflow.json` | Pull GSC data, flag page-2 "striking distance" queries | Schedule (weekly) | Google service account |
| `digital-pr-distribution.workflow.json` | On new linkable asset: fast-index + notify distribution webhook | Webhook / manual | `INDEXNOW_KEY`, `PR_WEBHOOK_URL` |
| `canonical-sentinel.workflow.json` | **NEW** — Monitor canonical URLs across all pages. Alert on mismatch. | Schedule (6h) | `SLACK_CANONICAL_WEBHOOK`, `GOOGLE_SHEETS_ID` |
| `llm-citation-monitor.workflow.json` | **NEW** — Track LLM (Perplexity) citations of sectorcalc.com. Weekly report. | Schedule (6h + weekly aggregate) | Perplexity API key, `SLACK_SEO_WEBHOOK`, `GOOGLE_SHEETS_ID` |
| `schema-validator-gate.workflow.json` | **NEW** — CI gate: build + schema validate + Rich Results test on push to main. | GitHub webhook | `SLACK_SEO_WEBHOOK` |
| `competitor-entity-tracker.workflow.json` | **NEW** — Weekly competitor keyword gap analysis (calculator.net, omnicalculator.com, etc.). | Schedule (weekly Mon 3AM) | `SLACK_SEO_WEBHOOK`, `GOOGLE_SHEETS_ID` |

### Mandate-mandated workflows

These 4 workflows correspond to the SectorCalc Release Mandate v2.0 Section 8:

1. **Daily Canonical Sentinel (Workflow 1):** Cron every 6 hours. Fetches sitemap index -> sub-sitemaps -> all URLs. Checks canonical header on each page. If canonical != self, sends Slack CRITICAL alert + logs to Google Sheets.

2. **LLM Citation Monitor (Workflow 2):** Cron every 6 hours + weekly aggregate. Queries Perplexity API for sectorcalc.com citations. Extracts URLs, logs to Sheets, notifies Slack on new citations. Weekly aggregate report to Slack.

3. **Schema Validator Gate (Workflow 3):** Triggered by GitHub push to main. Clones repo, runs build, runs schema validation (schema-validate.mjs), runs Google Rich Results Test API. If fail -> block deploy + Slack alert.

4. **Competitor Entity Tracker (Workflow 4):** Weekly Monday 3AM cron. Fetches sitemaps from calculator.net, omnicalculator.com, goodcalculators.com. Extracts keywords, compares with sectorcalc.com coverage. Flags gaps to Slack + Google Sheets. Auto-opens Jira tickets for uncovered keywords.

## Import

1. n8n -> **Workflows -> Import from File** -> pick a `*.workflow.json`.
2. Open each **HTTP Request** node and attach credentials (see below).
3. Adjust the **Schedule Trigger** cadence if needed.
4. Activate the workflow.

## Credentials & environment

Set these as n8n environment variables (Settings -> Variables/Environment) or
node credentials. **Never hard-code secrets in the workflow JSON.**

- `INDEXNOW_KEY` — the IndexNow key. The key file must be reachable at
  `https://sectorcalc.com/<INDEXNOW_KEY>.txt` (served dynamically when the app's
  `INDEXNOW_KEY` env is set; see `docs/indexnow-setup.md`).
- **Google Search Console**: create a Google Cloud **service account**, enable
  the *Search Console API*, download the JSON key, and add the service-account
  email as a **user** on the GSC property. In n8n add a **Google API** credential
  (service account) and select it in the GSC HTTP Request node. The property is
  `sc-domain:sectorcalc.com`.
- `PR_WEBHOOK_URL` — optional outbound webhook (Slack / Buffer / Zapier) for
  digital-PR distribution.
- `SLACK_CANONICAL_WEBHOOK` — Slack incoming webhook URL for canonical alerts.
- `SLACK_SEO_WEBHOOK` — Slack incoming webhook URL for general SEO alerts.
- `GOOGLE_SHEETS_ID` — Google Sheets ID for logging (canonical, citations, gaps).
- **Perplexity API** — API key for LLM citation monitoring (set as HTTP Header Auth in n8n).

## Striking distance definition

Queries with **average position 8-20** (edge of / just past page 1) and
**>= 20 impressions** over the lookback window. These are the highest-ROI SEO
targets: small on-page improvements can move them onto page 1. The workflow and
`scripts/seo/gsc-striking-distance.mjs` share the same thresholds and
opportunity-score formula.

## Honesty notes (what is and isn't automated)

- **Striking distance & IndexNow**: fully automatable — these workflows do the
  end-to-end job once credentials are attached.
- **Canonical Sentinel & Citation Monitor**: fully automatable with credentials.
- **Schema Validator Gate**: requires a GitHub webhook setup and build environment on n8n host.
- **Competitor Entity Tracker**: fully automatable once credentials are set.
- **Digital PR / linkable-asset creation**: intentionally *semi*-automated. The
  workflow handles **distribution** (fast-index + webhook broadcast) of a new
  asset, but producing the linkable asset itself (original data study, tool,
  guide) remains human/editorial and long-term. No fake outreach is performed.
