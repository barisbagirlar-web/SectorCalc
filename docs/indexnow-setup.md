# IndexNow Setup

IndexNow notifies Bing and participating search engines when public URLs change. SectorCalc uses a manifest-driven submit script — not the full sitemap — for EN/TR indexable URLs.

## Prerequisites

- Deployed site reachable at your host (default: `sectorcalc-bf412.web.app`)
- Node.js 18+ (for `npm run seo:indexnow`)
- No new npm packages required

## 1. Generate an IndexNow key

Create a random UUID or 32+ character alphanumeric string. Example format:

```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Do not commit the real key to git.**

## 2. Create the verification file

The key file must be publicly accessible at:

```
https://{SITE_HOST}/{INDEXNOW_KEY}.txt
```

Steps:

1. Create `public/{INDEXNOW_KEY}.txt` locally (not committed).
2. File content = the key string only (single line, no extra whitespace).
3. Deploy hosting:

```bash
firebase deploy --only hosting --project sectorcalc-bf412
```

4. Verify in browser:

```
https://sectorcalc-bf412.web.app/{INDEXNOW_KEY}.txt
```

Should return HTTP 200 with the key as plain text.

**Example placeholder in repo:** `public/indexnow-key-example.txt` — replace content with your real key in a separate file named after the key.

## 3. Export URL manifest (automatic at prebuild)

Prebuild runs:

```bash
npx tsx scripts/export-indexable-manifest.ts
```

Output: `scripts/.cache/indexable-urls.json` (gitignored).

Source: `src/lib/seo/indexable-url-manifest.ts`

## 4. Submit URLs

```bash
INDEXNOW_KEY=your-key-here SITE_HOST=sectorcalc-bf412.web.app npm run seo:indexnow
```

Or with production domain after DNS cutover:

```bash
INDEXNOW_KEY=your-key-here SITE_HOST=sectorcalc.com npm run seo:indexnow
```

### Expected success output

```
IndexNow OK — submitted N URLs (HTTP 200)
Host: sectorcalc-bf412.web.app
Key location: https://sectorcalc-bf412.web.app/your-key.txt
```

### If key is missing

```
INDEXNOW_KEY not set — skipping IndexNow submission. See docs/indexnow-setup.md
```

Exit code **0** — build/CI is not blocked.

### If API fails

Non-2xx response prints status and body; exit code **1**.

Common fixes:
- Key file not deployed or wrong filename
- Host in request does not match key file domain
- URL list empty — run export manifest first

## 5. Bing Webmaster Tools

1. Add site property for your host
2. Submit sitemap: `https://sectorcalc-bf412.web.app/sitemap.xml`
3. IndexNow submissions appear in URL submission logs (may lag)

## 6. When to re-submit

- After major deploy adding new tools, guides or SEO hubs
- After fixing canonical/noindex issues on priority URLs
- Not required for every deploy — use for bulk URL additions

## Security

- Never commit `public/{real-key}.txt` or `INDEXNOW_KEY` to the repository
- Add real key files to `.gitignore` if stored locally under `public/`
- Use CI secrets for `INDEXNOW_KEY` in automated pipelines

## Related

- [search-console-indexnow-runbook.md](./search-console-indexnow-runbook.md)
- [gsc-url-inspection-checklist.md](./gsc-url-inspection-checklist.md)
- Script: `scripts/submit-indexnow.mjs`
