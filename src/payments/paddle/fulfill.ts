/**
 * Pure checkout.completed → credit grant helpers (testable, no DOM).
 */
import { getPackageByPriceId } from '../../lib/pricing-packages.js';
import { grantCredits, readCredits, type CreditLedger } from './credits.js';

export interface PaddleCheckoutEventData {
  id?: string;
  transaction_id?: string;
  custom_data?: Record<string, string> | null;
  items?: Array<{
    price_id?: string;
    priceId?: string;
    quantity?: number;
    price?: { id?: string };
  }>;
}

export interface PaddleCheckoutEvent {
  name?: string;
  data?: PaddleCheckoutEventData;
}

export interface FulfillResult {
  granted: number;
  txnId?: string;
  ledger: CreditLedger;
  source: 'items' | 'custom_data' | 'pending' | 'none';
}

function priceIdFromItem(item: NonNullable<PaddleCheckoutEventData['items']>[number]): string | undefined {
  return item.price_id || item.priceId || item.price?.id;
}

function creditsFromItems(data: PaddleCheckoutEventData | undefined): number {
  const items = data?.items ?? [];
  let total = 0;
  for (const item of items) {
    const priceId = priceIdFromItem(item);
    if (!priceId) continue;
    const pack = getPackageByPriceId(priceId);
    if (!pack) continue;
    const qty = Number.isInteger(item.quantity) && (item.quantity ?? 0) > 0 ? item.quantity! : 1;
    total += pack.credits * qty;
  }
  return total;
}

function creditsFromCustomData(data: PaddleCheckoutEventData | undefined): number {
  const raw = data?.custom_data?.credits;
  if (raw == null || raw === '') return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/**
 * Grant credits from a Paddle.js checkout event.
 * Prefer line items → custom_data.credits → pendingCredits fallback.
 */
export function fulfillCheckoutCompleted(
  event: PaddleCheckoutEvent,
  pendingCredits?: number
): FulfillResult {
  if (event.name !== 'checkout.completed') {
    return { granted: 0, ledger: readCredits(), source: 'none' };
  }

  const fromItems = creditsFromItems(event.data);
  const fromCustom = creditsFromCustomData(event.data);
  const fromPending =
    Number.isInteger(pendingCredits) && (pendingCredits ?? 0) > 0 ? pendingCredits! : 0;

  let granted = 0;
  let source: FulfillResult['source'] = 'none';
  if (fromItems > 0) {
    granted = fromItems;
    source = 'items';
  } else if (fromCustom > 0) {
    granted = fromCustom;
    source = 'custom_data';
  } else if (fromPending > 0) {
    granted = fromPending;
    source = 'pending';
  }

  const txnId = event.data?.transaction_id || event.data?.id;
  if (granted <= 0) {
    return { granted: 0, txnId, ledger: readCredits(), source: 'none' };
  }
  const ledger = grantCredits(granted, txnId);
  return { granted, txnId, ledger, source };
}
