/**
 * Browser-side credit balance (sandbox until webhook fulfillment lands).
 * Credits are integer counts — not money amounts.
 */
const STORAGE_KEY = 'sectorcalc-credits';

export interface CreditLedger {
  balance: number;
  updatedAt: string;
  lastTxnId?: string;
}

function emptyLedger(): CreditLedger {
  return { balance: 0, updatedAt: new Date().toISOString() };
}

export function readCredits(): CreditLedger {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLedger();
    const parsed = JSON.parse(raw) as Partial<CreditLedger>;
    const balance = Number(parsed.balance);
    if (!Number.isFinite(balance) || balance < 0 || !Number.isInteger(balance)) {
      return emptyLedger();
    }
    return {
      balance,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      lastTxnId: typeof parsed.lastTxnId === 'string' ? parsed.lastTxnId : undefined
    };
  } catch {
    return emptyLedger();
  }
}

export function writeCredits(ledger: CreditLedger): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
}

/** Idempotent grant: same txnId will not double-credit. */
export function grantCredits(amount: number, txnId?: string): CreditLedger {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('grantCredits: amount must be a positive integer');
  }
  const current = readCredits();
  if (txnId && current.lastTxnId === txnId) return current;
  const next: CreditLedger = {
    balance: current.balance + amount,
    updatedAt: new Date().toISOString(),
    lastTxnId: txnId ?? current.lastTxnId
  };
  writeCredits(next);
  return next;
}
