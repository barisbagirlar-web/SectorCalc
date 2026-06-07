# Monetization Blocker Matrix

Priority classification for revenue-path issues before paid traffic.

**Decision:** P0 blocks launch. P1 must be fixed before paid traffic. P2 can wait.

---

## P0 blockers

| Issue | Detection |
|---|---|
| Checkout cannot start | CTA → error / no Stripe redirect |
| Checkout success but webhook fails | Success page but no Firestore entitlement |
| Webhook signature verification missing | `stripeWebhook` accepts unsigned POST |
| Entitlement not created after paid checkout | No `premiumEntitlements` doc after payment |
| Entitlement created without payment | Client or unsigned path writes entitlement |
| Duplicate entitlement from repeated webhook | Second event creates new doc with new id |
| Canceled checkout unlocks premium | Cancel flow grants export |
| Payment failed unlocks premium | `invoice.payment_failed` leaves `active` status |
| Full report/export without entitlement | CSV download or full print without gate |
| Stripe secret exposed in frontend | `NEXT_PUBLIC_*` or bundled secret |
| Firestore public write to entitlement collection | Rules allow client create/update |

---

## P1 major

| Issue | Detection |
|---|---|
| Success page unclear | User confusion post-payment |
| Cancel page unclear | No path back to analyzer/pricing |
| Pricing CTA wrong plan | Pro button starts team checkout |
| Single report return path wrong | `returnPath` not same analyzer |
| Export button confusing | Locked state without checkout CTA |
| KPI event missing for checkout started | No `checkout_started` on CTA click |
| KPI event missing for payment completed | No post-webhook signal (if wired) |
| Single report not visible on pricing grid | Pro-focused grid hides single-report card |

---

## P2 minor

| Issue | Detection |
|---|---|
| Copy issue | Wording only |
| Spacing issue | Visual only |
| Small loading state issue | Pending spinner UX |

---

## Code audit status (static)

| P0 item | Static check |
|---|---|
| Webhook signature | ✓ `constructEvent` in `functions/src/stripeWebhook.ts` |
| session_id client trust | ✓ `isClientCheckoutSessionTrusted` → always `false` |
| Export gate | ✓ `canExportPdf` / `canExportCsv` checks |
| Firestore rules | ✓ `premiumEntitlements` write `false` |
| Frontend secrets | ✓ No Stripe secret in `src/` client bundles |
| Idempotent doc ids | ✓ `stripe_session_{sessionId}` deterministic |
| Payment failed handling | ✓ `invoice.payment_failed` → status `pending` |

**Requires live test:** full checkout → webhook → entitlement → export path.

---

## Escalation

P0 → [Launch Incident Response](./launch-incident-response.md)  
P1 → [Post-launch Backlog Items](./post-launch-backlog-items.md) item #1 or #2
