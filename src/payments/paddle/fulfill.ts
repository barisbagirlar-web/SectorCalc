/**
 * checkout.completed is UX-only. It MUST NOT grant credits.
 * Financial authority is the server webhook (transaction.completed).
 */
import { readCredits, type CreditLedger } from './credits.js';

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
  source: 'items' | 'custom_data' | 'pending' | 'none' | 'server_pending';
  pendingActivation: boolean;
}

/**
 * Client checkout.completed handler — no wallet mutation.
 */
export function fulfillCheckoutCompleted(
  event: PaddleCheckoutEvent,
  _pendingCredits?: number
): FulfillResult {
  if (event.name !== 'checkout.completed') {
    return { granted: 0, ledger: readCredits(), source: 'none', pendingActivation: false };
  }
  const txnId = event.data?.transaction_id || event.data?.id;
  return {
    granted: 0,
    txnId,
    ledger: readCredits(),
    source: 'server_pending',
    pendingActivation: true
  };
}
