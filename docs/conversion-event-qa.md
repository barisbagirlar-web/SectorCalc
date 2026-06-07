# Conversion Event QA

Reference for Week-1 funnel measurement. Events flow through `trackConversionEvent()` → `trackSectorCalcEvent()` in `src/lib/analytics/conversion-funnel.ts`.

**Taxonomy source:** `SECTORCALC_EVENTS` in `src/lib/analytics/event-taxonomy.ts`.

---

## Event reference

### `seo_landing_cta_click`

| Field | Value |
|---|---|
| **Stage** | `landing` |
| **Triggered in** | `src/components/campaign/SeoHubCampaignActions.tsx` |
| **PII** | None |
| **campaignId** | Yes — from `useAttributionContext().utmCampaign` |
| **Failure fallback** | Silent catch in `trackConversionEvent`; page flow unaffected |

---

### `free_tool_open`

| Field | Value |
|---|---|
| **Stage** | `tool_open` |
| **Triggered in** | `src/components/tools/FreeTrafficToolPage.tsx` (mount `useEffect`) |
| **PII** | None |
| **campaignId** | Yes — UTM campaign when present |
| **Payload** | `toolSlug`, `locale`, `pagePath`, `category` |
| **Failure fallback** | Silent catch |

---

### `free_tool_calculate`

| Field | Value |
|---|---|
| **Stage** | `calculation` |
| **Triggered in** | `src/components/tools/FreeTrafficToolPage.tsx` (form submit success) |
| **PII** | None — input values never sent |
| **campaignId** | Yes |
| **Payload** | `toolSlug`, `locale`, `pagePath`, `category` |
| **Failure fallback** | Silent catch |

---

### `free_to_premium_click`

| Field | Value |
|---|---|
| **Stage** | `premium_interest` |
| **Triggered in** | `src/components/tools/FreeTrafficToolPage.tsx` (premium upsell Link `onClick`) |
| **PII** | None |
| **campaignId** | Yes |
| **Payload** | `toolSlug`, `premiumSlug`, `ctaId: "free_to_premium_click"` |
| **Failure fallback** | Silent catch; navigation proceeds |

---

### `premium_analyzer_open`

| Field | Value |
|---|---|
| **Stage** | `premium_preview` |
| **Triggered in** | `src/components/tools/DynamicPremiumCalculator.tsx` (mount) |
| **PII** | None |
| **campaignId** | Yes |
| **Payload** | `premiumSlug`, `locale`, `pagePath` |
| **Failure fallback** | Silent catch |

---

### `premium_unlock_click`

| Field | Value |
|---|---|
| **Stage** | `unlock_intent` |
| **Triggered in** | `src/components/reports/PremiumReportLockedState.tsx` (`handleUnlock`) |
| **PII** | None |
| **campaignId** | Yes |
| **Payload** | `premiumSlug`, `ctaId: "unlock_full_report"` |
| **Failure fallback** | Silent catch; checkout session still attempted via `startCheckoutSession()` |

---

### `pricing_view`

| Field | Value |
|---|---|
| **Stage** | `pricing_intent` |
| **Triggered in** | `src/components/sections/PricingPlansGrid.tsx`, `src/components/campaign/PricingPageTracker.tsx` |
| **PII** | None |
| **campaignId** | Optional |
| **Side effect** | Also fires `trackRevenueEvent(pricing_viewed)` |
| **Failure fallback** | Silent catch |

---

### `pricing_cta_click`

| Field | Value |
|---|---|
| **Stage** | `pricing_intent` |
| **Triggered in** | `src/components/sections/PricingPlansGrid.tsx`, `src/components/campaign/SeoHubCampaignActions.tsx`, `src/components/subscription/ProCheckoutButton.tsx` |
| **PII** | None |
| **campaignId** | Yes when from tracked CTAs |
| **Payload** | `ctaId` distinguishes plan (pro, single, team) |
| **Failure fallback** | Silent catch |

---

### `beta_partner_submit`

| Field | Value |
|---|---|
| **Stage** | `lead_submit` |
| **Triggered in** | `src/components/benchmarks/BetaPartnerForm.tsx` (successful submit) |
| **PII in analytics** | **None** — email/name stored in Firestore only, stripped by `normalizeConversionPayload()` |
| **campaignId** | Yes when UTM present |
| **Failure fallback** | Silent catch; form success UI independent |

---

### `report_export_click`

| Field | Value |
|---|---|
| **Stage** | `export_intent` |
| **Triggered in** | `src/components/reports/PremiumReportExportActions.tsx` |
| **PII** | None |
| **campaignId** | Optional |
| **Related events** | `report_print_click`, `report_csv_click`, `report_copy_summary_click`, `locked_export_click` |
| **Failure fallback** | Silent catch |

---

## Privacy boundaries

**Allowed in payloads:** `locale`, `pagePath`, `toolSlug`, `premiumSlug`, `campaignId`, `ctaId`, `stage`, `exportType`, `category`, `source`, `medium`

**Never in payloads:** email, name, company, phone, input values, result values, financial amounts

**PII filter:** `PII_FIELD_NAMES` in `conversion-funnel.ts` + `ALLOWED_PAYLOAD_KEYS` whitelist

---

## Dev QA procedure

1. Open page in development mode
2. Perform action (calculate, click CTA, etc.)
3. Confirm `[SectorCalc event]` or `[SectorCalc conversion]` in console
4. Verify payload has no input values or contact fields
5. Confirm `campaignId` present when URL has `utm_campaign`

---

## Week-1 monitoring checklist

- [ ] All 10 core events fire at least once in dev smoke test
- [ ] No PII in console debug payloads
- [ ] `campaignId` passes through on UTM links from `buildTrackedCtaHref()`
- [ ] Invalid event names fail silently (no user-facing error)
