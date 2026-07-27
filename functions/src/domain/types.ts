/** Pure wallet/ledger/session domain types (no Firebase). */

export type LedgerType =
  | 'PURCHASE_GRANT'
  | 'PROMOTIONAL_GRANT'
  | 'SESSION_DEBIT'
  | 'REFUND_REVERSAL'
  | 'CHARGEBACK_REVERSAL'
  | 'DEBT_CREATED'
  | 'DEBT_SETTLED'
  | 'ADMIN_ADJUSTMENT';

export type LedgerBucket = 'purchased' | 'promotional' | 'debt';

export type PurchaseStatus =
  | 'PENDING'
  | 'CHECKOUT_CREATED'
  | 'PAYMENT_COMPLETED'
  | 'CREDITED'
  | 'REFUNDED'
  | 'CHARGEDBACK'
  | 'REVIEW_REQUIRED'
  | 'FAILED';

export type SessionStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface CreditWallet {
  userId: string;
  purchasedCredits: number;
  promotionalCredits: number;
  promotionalExpiresAt: string | null;
  creditDebt: number;
  version: number;
  updatedAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  type: LedgerType;
  bucket: LedgerBucket;
  deltaCredits: number;
  sourceType: string;
  sourceId: string;
  toolId?: string | null;
  balancePurchasedAfter: number;
  balancePromotionalAfter: number;
  creditDebtAfter: number;
  createdAt: string;
}

export interface BillingPurchase {
  id: string;
  userId: string;
  packageKey: string;
  expectedCredits: number;
  expectedPaddlePriceId: string;
  paddleTransactionId: string | null;
  status: PurchaseStatus;
  createdAt: string;
  completedAt: string | null;
  creditedAt: string | null;
  refundedAt: string | null;
  returnTo: string | null;
}

export function emptyWallet(userId: string, nowIso: string): CreditWallet {
  return {
    userId,
    purchasedCredits: 0,
    promotionalCredits: 0,
    promotionalExpiresAt: null,
    creditDebt: 0,
    version: 0,
    updatedAt: nowIso
  };
}

export function spendableCredits(wallet: CreditWallet, nowMs: number): number {
  const promo =
    wallet.promotionalCredits > 0 &&
    wallet.promotionalExpiresAt &&
    Date.parse(wallet.promotionalExpiresAt) > nowMs
      ? wallet.promotionalCredits
      : 0;
  return promo + wallet.purchasedCredits;
}

export function assertNonNegativeInts(wallet: CreditWallet): void {
  for (const [k, v] of Object.entries({
    purchasedCredits: wallet.purchasedCredits,
    promotionalCredits: wallet.promotionalCredits,
    creditDebt: wallet.creditDebt,
    version: wallet.version
  })) {
    if (!Number.isInteger(v) || (v as number) < 0) {
      throw new Error(`Invalid wallet field ${k}=${v}`);
    }
  }
}
