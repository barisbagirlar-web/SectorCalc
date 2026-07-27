/**
 * Append-only credit ledger engine (pure, authoritative algorithm).
 * Persistence adapters call these reducers inside DB transactions.
 */
import type {
  CreditLedgerEntry,
  CreditPackageId,
  CreditTransactionType,
  CreditWalletBalances,
  PricingTier
} from './types.js';

export interface WalletState {
  purchasedCredits: number;
  promotionalCredits: number;
  promotionalExpiresAt: string | null;
  updatedAt: string;
  /** Processed idempotency keys (also mirrored as ledger entry ids). */
  processedIds: Set<string>;
  entries: CreditLedgerEntry[];
}

export function emptyWallet(now = new Date()): WalletState {
  return {
    purchasedCredits: 0,
    promotionalCredits: 0,
    promotionalExpiresAt: null,
    updatedAt: now.toISOString(),
    processedIds: new Set(),
    entries: []
  };
}

function assertNonNegInt(n: number, label: string): void {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${label} must be a non-negative integer`);
}

export function isPromoValid(state: WalletState, now = new Date()): boolean {
  if (state.promotionalCredits <= 0) return false;
  if (!state.promotionalExpiresAt) return state.promotionalCredits > 0;
  return new Date(state.promotionalExpiresAt).getTime() > now.getTime();
}

export function availableCredits(state: WalletState, now = new Date()): number {
  const promo = isPromoValid(state, now) ? state.promotionalCredits : 0;
  return state.purchasedCredits + promo;
}

export function toBalances(state: WalletState, now = new Date()): CreditWalletBalances {
  const promoValid = isPromoValid(state, now);
  return {
    purchasedCredits: state.purchasedCredits,
    promotionalCredits: promoValid ? state.promotionalCredits : 0,
    promotionalExpiresAt: promoValid ? state.promotionalExpiresAt : null,
    availableCredits: availableCredits(state, now),
    updatedAt: state.updatedAt
  };
}

function pushEntry(
  state: WalletState,
  entry: CreditLedgerEntry
): WalletState {
  if (state.processedIds.has(entry.id)) return state;
  const next: WalletState = {
    ...state,
    purchasedCredits: state.purchasedCredits + entry.purchasedDelta,
    promotionalCredits: state.promotionalCredits + entry.promotionalDelta,
    updatedAt: entry.createdAt,
    processedIds: new Set(state.processedIds),
    entries: [...state.entries, entry]
  };
  next.processedIds.add(entry.id);
  if (next.purchasedCredits < 0 || next.promotionalCredits < 0) {
    throw new Error('Ledger apply would produce negative wallet component');
  }
  return next;
}

/** Expire stale promo into an EXPIRATION entry when needed before debit/read. */
export function expirePromotionalIfNeeded(state: WalletState, now = new Date()): WalletState {
  if (state.promotionalCredits <= 0) return state;
  if (!state.promotionalExpiresAt) return state;
  if (new Date(state.promotionalExpiresAt).getTime() > now.getTime()) return state;
  const id = `exp_${state.promotionalExpiresAt}_${state.promotionalCredits}`;
  if (state.processedIds.has(id)) {
    return { ...state, promotionalCredits: 0, promotionalExpiresAt: null };
  }
  const createdAt = now.toISOString();
  return pushEntry(
    { ...state, promotionalExpiresAt: null },
    {
      id,
      type: 'EXPIRATION',
      delta: -state.promotionalCredits,
      purchasedDelta: 0,
      promotionalDelta: -state.promotionalCredits,
      note: 'Promotional credits expired',
      createdAt
    }
  );
}

export function applyPurchase(
  state: WalletState,
  input: {
    idempotencyKey: string;
    credits: number;
    packageId: CreditPackageId;
    providerEventId: string;
    now?: Date;
  }
): WalletState {
  assertNonNegInt(input.credits, 'purchase credits');
  if (input.credits === 0) return state;
  if (state.processedIds.has(input.idempotencyKey)) return state;
  const createdAt = (input.now ?? new Date()).toISOString();
  return pushEntry(state, {
    id: input.idempotencyKey,
    type: 'PURCHASE',
    delta: input.credits,
    purchasedDelta: input.credits,
    promotionalDelta: 0,
    packageId: input.packageId,
    providerEventId: input.providerEventId,
    createdAt
  });
}

export function applyPromotionalGrant(
  state: WalletState,
  input: {
    idempotencyKey: string;
    credits: number;
    expiresAt: string;
    note?: string;
    now?: Date;
  }
): WalletState {
  assertNonNegInt(input.credits, 'promo credits');
  if (input.credits === 0) return state;
  if (state.processedIds.has(input.idempotencyKey)) return state;
  const createdAt = (input.now ?? new Date()).toISOString();
  const next = pushEntry(state, {
    id: input.idempotencyKey,
    type: 'PROMOTIONAL_GRANT',
    delta: input.credits,
    purchasedDelta: 0,
    promotionalDelta: input.credits,
    note: input.note,
    createdAt
  });
  return { ...next, promotionalExpiresAt: input.expiresAt };
}

/**
 * Promo-first debit. Throws if insufficient available credits.
 * Idempotent on idempotencyKey (same key → no second debit).
 */
export function applySessionDebit(
  state: WalletState,
  input: {
    idempotencyKey: string;
    creditCost: number;
    toolId: string;
    pricingTier: PricingTier;
    calculationSessionId: string;
    now?: Date;
  }
): WalletState {
  assertNonNegInt(input.creditCost, 'creditCost');
  if (state.processedIds.has(input.idempotencyKey)) return state;
  const now = input.now ?? new Date();
  let cur = expirePromotionalIfNeeded(state, now);
  if (input.creditCost === 0) {
    return pushEntry(cur, {
      id: input.idempotencyKey,
      type: 'SESSION_DEBIT',
      delta: 0,
      purchasedDelta: 0,
      promotionalDelta: 0,
      toolId: input.toolId,
      pricingTier: input.pricingTier,
      calculationSessionId: input.calculationSessionId,
      note: 'Zero-cost session (reuse / free tier)',
      createdAt: now.toISOString()
    });
  }
  const avail = availableCredits(cur, now);
  if (avail < input.creditCost) {
    throw new Error(`INSUFFICIENT_CREDITS: need ${input.creditCost}, have ${avail}`);
  }
  const promoAvail = isPromoValid(cur, now) ? cur.promotionalCredits : 0;
  const fromPromo = Math.min(promoAvail, input.creditCost);
  const fromPurchased = input.creditCost - fromPromo;
  return pushEntry(cur, {
    id: input.idempotencyKey,
    type: 'SESSION_DEBIT',
    delta: -input.creditCost,
    purchasedDelta: -fromPurchased,
    promotionalDelta: -fromPromo,
    toolId: input.toolId,
    pricingTier: input.pricingTier,
    calculationSessionId: input.calculationSessionId,
    createdAt: now.toISOString()
  });
}

export function applyRefund(
  state: WalletState,
  input: {
    idempotencyKey: string;
    purchasedCredits: number;
    promotionalCredits?: number;
    providerEventId?: string;
    note?: string;
    now?: Date;
  }
): WalletState {
  assertNonNegInt(input.purchasedCredits, 'refund purchased');
  const promo = input.promotionalCredits ?? 0;
  assertNonNegInt(promo, 'refund promo');
  if (state.processedIds.has(input.idempotencyKey)) return state;
  const createdAt = (input.now ?? new Date()).toISOString();
  return pushEntry(state, {
    id: input.idempotencyKey,
    type: 'REFUND',
    delta: -(input.purchasedCredits + promo),
    purchasedDelta: -input.purchasedCredits,
    promotionalDelta: -promo,
    providerEventId: input.providerEventId,
    note: input.note,
    createdAt
  });
}

export function applyAdminAdjustment(
  state: WalletState,
  input: {
    idempotencyKey: string;
    purchasedDelta: number;
    promotionalDelta?: number;
    note?: string;
    now?: Date;
  }
): WalletState {
  if (!Number.isInteger(input.purchasedDelta)) throw new Error('purchasedDelta must be int');
  const promoDelta = input.promotionalDelta ?? 0;
  if (!Number.isInteger(promoDelta)) throw new Error('promotionalDelta must be int');
  if (state.processedIds.has(input.idempotencyKey)) return state;
  const createdAt = (input.now ?? new Date()).toISOString();
  return pushEntry(state, {
    id: input.idempotencyKey,
    type: 'ADMIN_ADJUSTMENT',
    delta: input.purchasedDelta + promoDelta,
    purchasedDelta: input.purchasedDelta,
    promotionalDelta: promoDelta,
    note: input.note,
    createdAt
  });
}

export function sessionDebitId(accountId: string, toolId: string, sessionKey: string): string {
  return `debit_${accountId}_${toolId}_${sessionKey}`;
}

export function purchaseIdempotencyKey(providerEventId: string): string {
  return `purchase_${providerEventId}`;
}

export function trialGrantId(accountId: string): string {
  return `trial_${accountId}`;
}

export type { CreditTransactionType };
