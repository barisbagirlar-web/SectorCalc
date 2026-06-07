# Entitlement QA Checklist

Server-verified premium access — no client trust of `session_id`, localStorage, or query params.

**Code:** `src/lib/entitlements/`, `functions/src/entitlementPersistence.ts`

---

## Single report

- [ ] Active only after paid checkout (webhook writes `premiumEntitlements`)
- [ ] Linked to `premiumSlug` when metadata present
- [ ] `reportLimit: 1`, `reportsUsed: 0` on create
- [ ] Non-matching `premiumSlug` does not unlock other analyzers
- [ ] Legacy `users/{uid}/purchases` still read as fallback during migration

---

## Pro

- [ ] Unlocks all premium reports (any slug)
- [ ] Export allowed (`canExportPdf`, `canExportCsv`)
- [ ] Subscription canceled → webhook updates status → access removed
- [ ] `customer.subscription.deleted` → status `canceled`

---

## Team

- [ ] Unlocks all premium reports
- [ ] Export allowed
- [ ] Team-specific features future-safe (v1 = full premium access)

---

## Security

- [ ] `session_id` query param alone does not unlock (`isClientCheckoutSessionTrusted` → false)
- [ ] localStorage does not grant entitlement
- [ ] Print page query param does not bypass gate (`PremiumPrintReportShell` uses hook)
- [ ] Client cannot write entitlement (Firestore rules `write: false`)
- [ ] Webhook idempotent — doc id `stripe_session_{sessionId}` / `stripe_sub_{subscriptionId}`
- [ ] Unknown plan metadata → no entitlement write (logged, skipped)
- [ ] `createdBy !== sectorcalc` → skip write

---

## Canceled / failed payment

- [ ] Checkout cancel → no entitlement doc created
- [ ] `invoice.payment_failed` → subscription entitlement status `pending` (not full access if client respects status)
- [ ] `status: canceled` / `expired` → `resolveEntitlementLevelFromRecords` → preview

---

## Automated tests

`src/lib/entitlements/__tests__/final-monetization-qa.test.ts`  
`src/lib/entitlements/__tests__/entitlement-mapping.test.ts`

---

## Manual verification

After [Stripe Test Checkout Runbook](./stripe-test-checkout-runbook.md), confirm each checkbox above.
