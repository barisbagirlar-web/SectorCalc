// SectorCalc V5.3.1 — Server-Side Price Lookup
// Resolves price lookup keys to Stripe price IDs. Never exposes raw price IDs to the client.

import "server-only";

export function resolveStripePriceId(priceLookupKey: string): string | null {
  const lookup: Record<string, string | undefined> = {
    sectorcalc_pro_monthly:
      process.env.STRIPE_PRICE_SECTORCALC_PRO_MONTHLY,
  };

  return lookup[priceLookupKey] ?? null;
}

export function getPublicAppUrl(): string | null {
  return (
    process.env.SECTORCALC_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    null
  );
}
