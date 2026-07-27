/**
 * Professional calculation session entitlement rules (pure).
 * One debit → one session; 24h unlock; max 3 report revisions.
 */
import type { CalculationSessionRecord, PricingTier } from './types.js';

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_REPORT_REVISIONS = 3;

export function buildSessionId(accountId: string, toolId: string, createdAtIso: string): string {
  // Stable per open attempt timestamp; reuse path uses existing ACTIVE session id.
  const stamp = createdAtIso.replace(/[:.]/g, '-');
  return `cs_${accountId}_${toolId}_${stamp}`;
}

export function createActiveSession(input: {
  accountId: string;
  toolId: string;
  pricingTier: PricingTier;
  creditCost: number;
  debitTransactionId: string | null;
  now?: Date;
}): CalculationSessionRecord {
  const now = input.now ?? new Date();
  const createdAt = now.toISOString();
  return {
    calculationSessionId: buildSessionId(input.accountId, input.toolId, createdAt),
    accountId: input.accountId,
    toolId: input.toolId,
    pricingTier: input.pricingTier,
    creditCost: input.creditCost,
    createdAt,
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
    reportRevisionCount: 0,
    maxReportRevisions: MAX_REPORT_REVISIONS,
    status: 'ACTIVE',
    debitTransactionId: input.debitTransactionId
  };
}

export function isSessionActive(session: CalculationSessionRecord, now = new Date()): boolean {
  if (session.status !== 'ACTIVE') return false;
  return new Date(session.expiresAt).getTime() > now.getTime();
}

/** Find reusable ACTIVE session for tool (no additional debit). */
export function findReusableSession(
  sessions: CalculationSessionRecord[],
  accountId: string,
  toolId: string,
  now = new Date()
): CalculationSessionRecord | null {
  const active = sessions
    .filter((s) => s.accountId === accountId && s.toolId === toolId && isSessionActive(s, now))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return active[0] ?? null;
}

export function registerReportRevision(
  session: CalculationSessionRecord,
  now = new Date()
): CalculationSessionRecord {
  if (!isSessionActive(session, now)) {
    throw new Error('SESSION_EXPIRED');
  }
  if (session.reportRevisionCount >= session.maxReportRevisions) {
    throw new Error('REPORT_REVISION_LIMIT');
  }
  return {
    ...session,
    reportRevisionCount: session.reportRevisionCount + 1
  };
}

/**
 * Deterministic debit key for a professional session open.
 * Same account+tool+clientSessionKey → same debit id (tab/refresh safe).
 */
export function professionalSessionDebitKey(
  accountId: string,
  toolId: string,
  clientSessionKey: string
): string {
  return `psession_${accountId}_${toolId}_${clientSessionKey}`;
}
