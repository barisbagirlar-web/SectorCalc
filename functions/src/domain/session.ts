/**
 * Pure professional-session debit accounting (atomic domain SSOT).
 */
import type { CreditLedgerEntry, CreditWallet, SessionStatus } from './types';
import { assertNonNegativeInts, spendableCredits } from './types';

export interface ProfessionalSession {
  id: string;
  userId: string;
  toolId: string;
  pricingTier: string;
  creditCost: number;
  status: SessionStatus;
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

export type SessionOpenErrorCode =
  | 'BILLING_DEBT'
  | 'INSUFFICIENT_CREDITS'
  | 'TOOL_NOT_MONETIZED'
  | 'NOT_AUTHENTICATED';

export interface SessionOpenOk {
  ok: true;
  reused: boolean;
  debit: number;
  wallet: CreditWallet;
  ledger: CreditLedgerEntry[];
  session: ProfessionalSession;
}

export interface SessionOpenErr {
  ok: false;
  code: SessionOpenErrorCode;
  requiredCredits?: number;
  availableCredits?: number;
}

export interface SessionOpenInput {
  wallet: CreditWallet;
  userId: string;
  toolId: string;
  pricingTier: string;
  creditCost: number;
  monetizationEnabled: boolean;
  existingActive: ProfessionalSession | null;
  nowMs: number;
  sessionHours?: number;
  idFactory: () => string;
}

export function openProfessionalSession(input: SessionOpenInput): SessionOpenOk | SessionOpenErr {
  if (!input.userId) return { ok: false, code: 'NOT_AUTHENTICATED' };
  if (!input.monetizationEnabled) return { ok: false, code: 'TOOL_NOT_MONETIZED' };

  if (input.existingActive && Date.parse(input.existingActive.expiresAt) > input.nowMs) {
    return {
      ok: true,
      reused: true,
      debit: 0,
      wallet: input.wallet,
      ledger: [],
      session: input.existingActive
    };
  }

  if (input.wallet.creditDebt > 0) {
    return { ok: false, code: 'BILLING_DEBT' };
  }

  const available = spendableCredits(input.wallet, input.nowMs);
  if (available < input.creditCost) {
    return {
      ok: false,
      code: 'INSUFFICIENT_CREDITS',
      requiredCredits: input.creditCost,
      availableCredits: available
    };
  }

  let promo =
    input.wallet.promotionalCredits > 0 &&
    input.wallet.promotionalExpiresAt &&
    Date.parse(input.wallet.promotionalExpiresAt) > input.nowMs
      ? input.wallet.promotionalCredits
      : 0;
  let purchased = input.wallet.purchasedCredits;
  let remaining = input.creditCost;
  const ledger: CreditLedgerEntry[] = [];
  const nowIso = new Date(input.nowMs).toISOString();
  const sourceId = `session:${input.toolId}:${input.nowMs}`;

  const fromPromo = Math.min(promo, remaining);
  if (fromPromo > 0) {
    promo -= fromPromo;
    remaining -= fromPromo;
    ledger.push({
      id: input.idFactory(),
      userId: input.userId,
      type: 'SESSION_DEBIT',
      bucket: 'promotional',
      deltaCredits: -fromPromo,
      sourceType: 'professional_session',
      sourceId,
      toolId: input.toolId,
      balancePurchasedAfter: purchased,
      balancePromotionalAfter: promo,
      creditDebtAfter: input.wallet.creditDebt,
      createdAt: nowIso
    });
  }

  if (remaining > 0) {
    purchased -= remaining;
    ledger.push({
      id: input.idFactory(),
      userId: input.userId,
      type: 'SESSION_DEBIT',
      bucket: 'purchased',
      deltaCredits: -remaining,
      sourceType: 'professional_session',
      sourceId,
      toolId: input.toolId,
      balancePurchasedAfter: purchased,
      balancePromotionalAfter: promo,
      creditDebtAfter: input.wallet.creditDebt,
      createdAt: nowIso
    });
  }

  const hours = input.sessionHours ?? 24;
  const expiresAt = new Date(input.nowMs + hours * 60 * 60 * 1000).toISOString();
  const session: ProfessionalSession = {
    id: input.idFactory(),
    userId: input.userId,
    toolId: input.toolId,
    pricingTier: input.pricingTier,
    creditCost: input.creditCost,
    status: 'ACTIVE',
    startedAt: nowIso,
    expiresAt,
    createdAt: nowIso
  };

  const wallet: CreditWallet = {
    ...input.wallet,
    purchasedCredits: purchased,
    promotionalCredits: promo,
    promotionalExpiresAt: promo > 0 ? input.wallet.promotionalExpiresAt : null,
    version: input.wallet.version + 1,
    updatedAt: nowIso
  };
  assertNonNegativeInts(wallet);

  return {
    ok: true,
    reused: false,
    debit: input.creditCost,
    wallet,
    ledger,
    session
  };
}
