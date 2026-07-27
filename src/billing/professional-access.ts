/**
 * Client facade for professional calculation sessions.
 * Resolves cost from SSOT; never trusts browser-supplied creditCost.
 * When monetization flag is off → always allow (Phase 1/2).
 */
import {
  getToolPricingTier,
  resolveToolCreditCost,
  isToolMonetizationActive,
  findReusableSession,
  createActiveSession,
  professionalSessionDebitKey,
  type CalculationSessionRecord
} from './index.js';
import { trackBillingEvent } from './analytics.js';

export interface ProfessionalAccessResult {
  allowed: boolean;
  reason:
    | 'monetization_disabled'
    | 'unclassified_free'
    | 'active_session'
    | 'insufficient_credits'
    | 'debit_required'
    | 'unauthenticated';
  creditCost: number;
  pricingTier: string | null;
  session: CalculationSessionRecord | null;
  availableCredits?: number;
}

export interface ProfessionalAccessDeps {
  getAccountId: () => string | null;
  getClientSessionKey: () => string;
  listSessions: () => Promise<CalculationSessionRecord[]>;
  getAvailableCredits: () => Promise<number>;
  /** Server-side atomic debit + session create. Optional until Functions deploy. */
  openSessionOnServer?: (input: {
    toolId: string;
    clientSessionKey: string;
  }) => Promise<CalculationSessionRecord>;
}

/**
 * Decide whether professional surfaces may open for toolId.
 * Does not perform debit itself unless openSessionOnServer is provided.
 */
export async function requestProfessionalAccess(
  toolId: string,
  deps: ProfessionalAccessDeps
): Promise<ProfessionalAccessResult> {
  trackBillingEvent('professional_report_clicked', { toolId });

  if (!isToolMonetizationActive(toolId)) {
    return {
      allowed: true,
      reason: 'monetization_disabled',
      creditCost: 0,
      pricingTier: getToolPricingTier(toolId),
      session: null
    };
  }

  const tier = getToolPricingTier(toolId);
  const cost = resolveToolCreditCost(toolId);
  if (tier == null || cost == null) {
    return {
      allowed: true,
      reason: 'unclassified_free',
      creditCost: 0,
      pricingTier: null,
      session: null
    };
  }

  const accountId = deps.getAccountId();
  if (!accountId) {
    trackBillingEvent('insufficient_credit', { toolId, pricingTier: tier, creditCost: cost });
    return {
      allowed: false,
      reason: 'unauthenticated',
      creditCost: cost,
      pricingTier: tier,
      session: null,
      availableCredits: 0
    };
  }

  const sessions = await deps.listSessions();
  const existing = findReusableSession(sessions, accountId, toolId);
  if (existing) {
    trackBillingEvent('professional_session_started', {
      toolId,
      pricingTier: tier,
      creditCost: 0,
      cohort: 'account'
    });
    return {
      allowed: true,
      reason: 'active_session',
      creditCost: 0,
      pricingTier: tier,
      session: existing
    };
  }

  const available = await deps.getAvailableCredits();
  if (available < cost) {
    trackBillingEvent('insufficient_credit', {
      toolId,
      pricingTier: tier,
      creditCost: cost,
      cohort: 'account'
    });
    return {
      allowed: false,
      reason: 'insufficient_credits',
      creditCost: cost,
      pricingTier: tier,
      session: null,
      availableCredits: available
    };
  }

  if (deps.openSessionOnServer) {
    const session = await deps.openSessionOnServer({
      toolId,
      clientSessionKey: deps.getClientSessionKey()
    });
    trackBillingEvent('professional_session_started', {
      toolId,
      pricingTier: tier,
      creditCost: cost,
      cohort: 'account'
    });
    return {
      allowed: true,
      reason: 'debit_required',
      creditCost: cost,
      pricingTier: tier,
      session
    };
  }

  // Local optimistic path only when server adapter missing (dev). Still uses SSOT cost.
  const debitKey = professionalSessionDebitKey(accountId, toolId, deps.getClientSessionKey());
  const session = createActiveSession({
    accountId,
    toolId,
    pricingTier: tier,
    creditCost: cost,
    debitTransactionId: debitKey
  });
  trackBillingEvent('professional_session_started', {
    toolId,
    pricingTier: tier,
    creditCost: cost,
    cohort: 'account'
  });
  return {
    allowed: true,
    reason: 'debit_required',
    creditCost: cost,
    pricingTier: tier,
    session,
    availableCredits: available
  };
}

export function professionalCtaCopy(creditCost: number): string {
  return `Professional Report\n[${creditCost} credits]`;
}
