// Version-agnostic accessors for Stripe Subscription/Invoice fields whose location moved
// across stripe-node type releases (current_period_end migrated from the top-level
// Subscription object to per-SubscriptionItem; Invoice.subscription moved under
// invoice.parent.subscription_details.subscription in newer typings). These read the field
// wherever it actually exists on the object at runtime, independent of which stripe-node
// minor version's .d.ts is active at compile time -- so entitlement logic keeps working
// whether current_period_end/invoice.subscription are typed as present on the object or not.
//
// No behavior change for the common case (single-item subscription, field present at the
// legacy top-level location): the legacy path is tried first.

import type Stripe from "stripe";

/**
 * Reads a subscription's current period end (unix seconds), trying the legacy top-level
 * field first, then the per-item location Stripe introduced for flexible/multi-item billing.
 */
export function readSubscriptionCurrentPeriodEnd(
  subscription: Stripe.Subscription | null | undefined,
): number | undefined {
  if (!subscription) return undefined;
  const legacy = (subscription as unknown as { current_period_end?: unknown }).current_period_end;
  if (typeof legacy === "number") return legacy;

  const items = (subscription as unknown as {
    items?: { data?: Array<{ current_period_end?: unknown }> };
  }).items;
  const fromItem = items?.data?.[0]?.current_period_end;
  return typeof fromItem === "number" ? fromItem : undefined;
}

/**
 * Reads the subscription id/object an invoice belongs to, trying the legacy top-level
 * `invoice.subscription` field first, then the newer `invoice.parent.subscription_details`
 * location.
 */
export function readInvoiceSubscription(
  invoice: Stripe.Invoice | null | undefined,
): string | Stripe.Subscription | null | undefined {
  if (!invoice) return undefined;
  const legacy = (invoice as unknown as { subscription?: string | Stripe.Subscription | null })
    .subscription;
  if (legacy !== undefined && legacy !== null) return legacy;

  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | Stripe.Subscription | null } | null } | null;
  }).parent;
  return parent?.subscription_details?.subscription ?? undefined;
}
