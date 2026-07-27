/**
 * Promotional credits (NOT Paddle trials). Feature-flagged.
 */
import type { CreditLedgerEntry, CreditWallet } from './types.js';
import { assertNonNegativeInts } from './types.js';

export function promotionalTrialEnabled(): boolean {
  const env =
    typeof process !== 'undefined'
      ? process.env?.PROMOTIONAL_TRIAL_CREDITS_ENABLED
      : undefined;
  return String(env || '').toLowerCase() === 'true';
}

export function applyPromotionalGrant(input: {
  wallet: CreditWallet;
  credits: number;
  expiresAtIso: string;
  sourceId: string;
  nowIso: string;
  idFactory: () => string;
}): { wallet: CreditWallet; ledger: CreditLedgerEntry[] } {
  if (!Number.isInteger(input.credits) || input.credits <= 0) {
    throw new Error('promotional credits must be positive integer');
  }
  const promotionalCredits = input.wallet.promotionalCredits + input.credits;
  const wallet: CreditWallet = {
    ...input.wallet,
    promotionalCredits,
    promotionalExpiresAt: input.expiresAtIso,
    version: input.wallet.version + 1,
    updatedAt: input.nowIso
  };
  assertNonNegativeInts(wallet);
  const ledger: CreditLedgerEntry[] = [
    {
      id: input.idFactory(),
      userId: input.wallet.userId,
      type: 'PROMOTIONAL_GRANT',
      bucket: 'promotional',
      deltaCredits: input.credits,
      sourceType: 'promotional_trial',
      sourceId: input.sourceId,
      toolId: null,
      balancePurchasedAfter: wallet.purchasedCredits,
      balancePromotionalAfter: wallet.promotionalCredits,
      creditDebtAfter: wallet.creditDebt,
      createdAt: input.nowIso
    }
  ];
  return { wallet, ledger };
}
