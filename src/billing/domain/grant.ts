/**
 * Pure credit-grant accounting (webhook + reconciliation SSOT).
 */
import type { CreditLedgerEntry, CreditWallet } from './types.js';
import { assertNonNegativeInts } from './types.js';

export interface GrantInput {
  wallet: CreditWallet;
  grantCredits: number;
  sourceId: string;
  nowIso: string;
  idFactory: () => string;
}

export interface GrantResult {
  wallet: CreditWallet;
  ledger: CreditLedgerEntry[];
}

/**
 * Apply purchased credit grant. Settles creditDebt first.
 */
export function applyPurchaseGrant(input: GrantInput): GrantResult {
  const { grantCredits, sourceId, nowIso, idFactory } = input;
  if (!Number.isInteger(grantCredits) || grantCredits <= 0) {
    throw new Error('grantCredits must be a positive integer');
  }
  let purchased = input.wallet.purchasedCredits;
  let promo = input.wallet.promotionalCredits;
  let debt = input.wallet.creditDebt;
  const ledger: CreditLedgerEntry[] = [];

  let remaining = grantCredits;
  if (debt > 0) {
    const settle = Math.min(debt, remaining);
    debt -= settle;
    remaining -= settle;
    ledger.push({
      id: idFactory(),
      userId: input.wallet.userId,
      type: 'DEBT_SETTLED',
      bucket: 'debt',
      deltaCredits: -settle,
      sourceType: 'paddle_purchase',
      sourceId,
      toolId: null,
      balancePurchasedAfter: purchased,
      balancePromotionalAfter: promo,
      creditDebtAfter: debt,
      createdAt: nowIso
    });
  }

  if (remaining > 0) {
    purchased += remaining;
    ledger.push({
      id: idFactory(),
      userId: input.wallet.userId,
      type: 'PURCHASE_GRANT',
      bucket: 'purchased',
      deltaCredits: remaining,
      sourceType: 'paddle_purchase',
      sourceId,
      toolId: null,
      balancePurchasedAfter: purchased,
      balancePromotionalAfter: promo,
      creditDebtAfter: debt,
      createdAt: nowIso
    });
  }

  const wallet: CreditWallet = {
    ...input.wallet,
    purchasedCredits: purchased,
    promotionalCredits: promo,
    creditDebt: debt,
    version: input.wallet.version + 1,
    updatedAt: nowIso
  };
  assertNonNegativeInts(wallet);
  return { wallet, ledger };
}

export interface RefundInput {
  wallet: CreditWallet;
  reverseCredits: number;
  sourceId: string;
  nowIso: string;
  idFactory: () => string;
  kind: 'REFUND_REVERSAL' | 'CHARGEBACK_REVERSAL';
}

export interface RefundResult {
  wallet: CreditWallet;
  ledger: CreditLedgerEntry[];
}

/** Reverse originally granted purchased credits; excess becomes creditDebt. */
export function applyPurchaseReversal(input: RefundInput): RefundResult {
  const { reverseCredits, sourceId, nowIso, idFactory, kind } = input;
  if (!Number.isInteger(reverseCredits) || reverseCredits <= 0) {
    throw new Error('reverseCredits must be a positive integer');
  }
  let purchased = input.wallet.purchasedCredits;
  let promo = input.wallet.promotionalCredits;
  let debt = input.wallet.creditDebt;
  const ledger: CreditLedgerEntry[] = [];

  const fromPurchased = Math.min(purchased, reverseCredits);
  purchased -= fromPurchased;
  const deficit = reverseCredits - fromPurchased;

  ledger.push({
    id: idFactory(),
    userId: input.wallet.userId,
    type: kind,
    bucket: 'purchased',
    deltaCredits: -fromPurchased,
    sourceType: kind === 'REFUND_REVERSAL' ? 'paddle_refund' : 'paddle_chargeback',
    sourceId,
    toolId: null,
    balancePurchasedAfter: purchased,
    balancePromotionalAfter: promo,
    creditDebtAfter: debt + deficit,
    createdAt: nowIso
  });

  if (deficit > 0) {
    debt += deficit;
    ledger.push({
      id: idFactory(),
      userId: input.wallet.userId,
      type: 'DEBT_CREATED',
      bucket: 'debt',
      deltaCredits: deficit,
      sourceType: kind === 'REFUND_REVERSAL' ? 'paddle_refund' : 'paddle_chargeback',
      sourceId,
      toolId: null,
      balancePurchasedAfter: purchased,
      balancePromotionalAfter: promo,
      creditDebtAfter: debt,
      createdAt: nowIso
    });
  }

  const wallet: CreditWallet = {
    ...input.wallet,
    purchasedCredits: purchased,
    promotionalCredits: promo,
    creditDebt: debt,
    version: input.wallet.version + 1,
    updatedAt: nowIso
  };
  assertNonNegativeInts(wallet);
  return { wallet, ledger };
}
