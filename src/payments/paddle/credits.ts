/**
 * Browser display/cache for credit balance — NOT authoritative.
 * Authoritative wallet lives in Firestore ledger (Cloud Functions).
 */
const STORAGE_KEY = 'sectorcalc-credits-cache';

export interface CreditLedger {
  balance: number;
  purchasedCredits?: number;
  promotionalCredits?: number;
  updatedAt: string;
  lastTxnId?: string;
  /** Cache only — never trust for charging. */
  authoritative?: boolean;
}

function emptyLedger(): CreditLedger {
  return { balance: 0, purchasedCredits: 0, promotionalCredits: 0, updatedAt: new Date().toISOString() };
}

export function readCredits(): CreditLedger {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('sectorcalc-credits');
    if (!raw) return emptyLedger();
    const parsed = JSON.parse(raw) as Partial<CreditLedger>;
    const balance = Number(parsed.balance);
    if (!Number.isFinite(balance) || balance < 0 || !Number.isInteger(balance)) {
      return emptyLedger();
    }
    return {
      balance,
      purchasedCredits: Number.isInteger(parsed.purchasedCredits) ? parsed.purchasedCredits : undefined,
      promotionalCredits: Number.isInteger(parsed.promotionalCredits)
        ? parsed.promotionalCredits
        : undefined,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      lastTxnId: typeof parsed.lastTxnId === 'string' ? parsed.lastTxnId : undefined,
      authoritative: false
    };
  } catch {
    return emptyLedger();
  }
}

export function writeCredits(ledger: CreditLedger): void {
  const payload: CreditLedger = { ...ledger, authoritative: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Optimistic cache grant after Paddle.js checkout.completed.
 * Server webhook / callable must still grant authoritatively (idempotent).
 */
export function grantCredits(amount: number, txnId?: string): CreditLedger {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('grantCredits: amount must be a positive integer');
  }
  const current = readCredits();
  if (txnId && current.lastTxnId === txnId) return current;
  const next: CreditLedger = {
    balance: current.balance + amount,
    purchasedCredits: (current.purchasedCredits ?? current.balance) + amount,
    promotionalCredits: current.promotionalCredits ?? 0,
    updatedAt: new Date().toISOString(),
    lastTxnId: txnId ?? current.lastTxnId,
    authoritative: false
  };
  writeCredits(next);
  return next;
}

export function cacheAuthoritativeBalances(input: {
  purchasedCredits: number;
  promotionalCredits: number;
  availableCredits: number;
  lastTxnId?: string;
}): CreditLedger {
  const next: CreditLedger = {
    balance: input.availableCredits,
    purchasedCredits: input.purchasedCredits,
    promotionalCredits: input.promotionalCredits,
    updatedAt: new Date().toISOString(),
    lastTxnId: input.lastTxnId,
    authoritative: false
  };
  writeCredits(next);
  return next;
}
