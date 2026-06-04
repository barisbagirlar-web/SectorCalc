# First live test script

Run this sequence on the **production URL** (e.g. `https://sectorcalc.com`) immediately after first deploy. Use a private/incognito window. Use test data only — no real customer PII.

**Tester:** _____________  
**Date:** _____________  
**Build / deploy ID:** _____________  
**Firebase configured:** Yes / No  

---

## 1. Homepage

1. Open `https://sectorcalc.com/`
2. Confirm hero, navigation, and footer load.
3. Resize to mobile width — no horizontal scroll.

**Pass / Fail:** _______

---

## 2. Free Tools

1. Open `/free-tools`
2. Confirm all five free tools are listed.

**Pass / Fail:** _______

---

## 3. Machine Hour Estimator (free)

1. Open `/tools/free/machine-hour-estimator`
2. Change inputs — results update without full page reload.
3. Blur an invalid field — inline validation if applicable.

**Pass / Fail:** _______

---

## 4. Premium teaser → CNC tool

1. On the Machine Hour Estimator page, find the premium teaser.
2. Follow the link to **CNC Minimum Safe Quote Analyzer**.
3. Confirm URL is `/tools/premium/cnc-minimum-safe-quote-analyzer`.

**Pass / Fail:** _______

---

## 5. Premium tool — calculator + report preview

1. Adjust inputs on the CNC premium tool.
2. Confirm risk verdict, scenario table, and decision report preview sections appear.

**Pass / Fail:** _______

---

## 6. Export preview (panel)

1. In the decision report section, click an export button (PDF / Excel / Word / Save preview).
2. Confirm mock message appears (no file download).

**Pass / Fail:** _______

---

## 7. Lead modal from export CTA

1. In the **Export** toolbar (below calculator), click PDF / Excel / Word / Save.
2. Click **Request premium report access**.
3. Confirm modal title: “Request this decision report”.

**Pass / Fail:** _______

---

## 8. Submit test lead (export source)

Use obvious test values, e.g.:

- Name: `Live Test Export`
- Email: `test-export+live@sectorcalc.com`
- Company: `SectorCalc QA`
- Industry: any
- Intended use: any

1. Submit the form.
2. Confirm success: “Request received.”

**Pass / Fail:** _______

---

## 9. Firestore verification (if Firebase configured)

1. Open Firebase Console → Firestore → `leadIntents`.
2. Find document with test email or recent `createdAt`.
3. Confirm fields: `status: "new"`, `storageMode: "firestore"`, `source: "export"`.

If Firebase **not** configured, skip and note “localStorage only”.

**Pass / Fail / N/A:** _______

---

## 10. Pricing page

1. Open `/pricing`
2. Confirm four plan cards.

**Pass / Fail:** _______

---

## 11. Single Report CTA → second lead

1. Click the **Single Report** plan CTA (opens lead modal, not checkout).
2. Submit a second test lead (different email, e.g. `test-pricing+live@sectorcalc.com`).
3. Confirm success message.

**Pass / Fail:** _______

---

## 12. LocalStorage fallback check

1. DevTools → Application → Local Storage → origin.
2. Confirm key `sectorcalc:lead-intents` contains JSON array with test leads.

**Pass / Fail:** _______

---

## 13. Sitemap

1. Open `/sitemap.xml`
2. Confirm production URLs (sectorcalc.com) for home, tools, industries, legal.

**Pass / Fail:** _______

---

## 14. Robots

1. Open `/robots.txt`
2. Confirm `Disallow: /admin/` and `Sitemap: https://sectorcalc.com/sitemap.xml` (or your `NEXT_PUBLIC_SITE_URL`).

**Pass / Fail:** _______

---

## 15. Admin disabled on production

1. Open `/admin/leads` (not linked in nav).
2. Confirm **disabled** state — not a full lead table.
3. Confirm warnings about authentication and production enablement.
4. Confirm `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` was **not** set on this deploy.

**Pass / Fail:** _______

---

## Sign-off

| Area | Status |
|------|--------|
| Core navigation | |
| Free + premium tools | |
| Lead capture | |
| SEO (sitemap/robots) | |
| Admin locked down | |
| Firestore rules deployed | |

**Notes:**

_______________________________________________________________________________

_______________________________________________________________________________

Next: full route matrix in [public-qa-checklist.md](./public-qa-checklist.md).
