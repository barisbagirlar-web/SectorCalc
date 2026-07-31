/**
 * Pure entitlement view + /my/tools merge logic (no Firebase).
 * Single source of truth for what the frontend renders — every access
 * decision comes from a real live session and the wallet, never from the
 * stored entitlement record alone.
 */
import { resolveToolCost } from './packages';
import {
  creditSessionDecision,
  sessionRemainingLabel,
  sessionRemainingSeconds,
  TOOL_META,
  type ToolEntitlement
} from './entitlement';

export interface EntitlementView {
  toolId: string;
  toolName: string;
  toolUrl: string;
  accessType: string;
  /** Panel label: ACTIVE while a live session exists, SUSPENDED when ops-suspended. */
  status: 'ACTIVE' | 'ENDED' | 'SUSPENDED';
  sessionStatus: 'ACTIVE' | 'ENDED';
  sessionStartsAt: string | null;
  sessionEndsAt: string | null;
  sessionRemainingSeconds: number;
  sessionRemainingLabel: string;
  creditsAvailable: number;
  sessionCreditCost: number;
  canOpenWithoutDebit: boolean;
  canStartNewSession: boolean;
  /** Extra (panel-only) fields; decision fields above are the contract. */
  firstUsedAt: string | null;
  usageConsumed: number;
  lastUsedAt: string | null;
}

export interface LiveSessionInfo {
  id: string;
  startedAt: string;
  expiresAt: string;
}

/** Pick the newest live (not yet expired) session for a tool. */
export function findLiveSessionForUser(
  sessions: Array<{ id: string; toolId: string; startedAt: string; expiresAt: string }>,
  toolId: string,
  nowMs: number
): LiveSessionInfo | null {
  let best: LiveSessionInfo | null = null;
  for (const s of sessions) {
    if (!s.expiresAt || Date.parse(s.expiresAt) <= nowMs) continue;
    if (s.toolId !== toolId) continue;
    if (!best || Date.parse(s.expiresAt) > Date.parse(best.expiresAt)) {
      best = { id: s.id, startedAt: s.startedAt, expiresAt: s.expiresAt };
    }
  }
  return best;
}

export function toView(input: {
  userId: string;
  toolId: string;
  entitlement: ToolEntitlement | null;
  session: LiveSessionInfo | null;
  spendable: number;
  nowMs: number;
  /** Merged max-lastUsed (legacy sessions may be newer than the record). */
  lastUsedAt?: string | null;
}): EntitlementView {
  const { toolId, entitlement: e, session } = input;
  const cost = resolveToolCost(toolId)?.creditCost ?? 0;
  const suspended = e?.status === 'SUSPENDED';
  // CREDIT_BASED decision is based ONLY on a real live session + wallet.
  // A stored entitlement record never grants access by itself.
  const decision = creditSessionDecision({
    hasLiveSession: !!session,
    sessionEndsAt: session?.expiresAt ?? null,
    creditsAvailable: input.spendable,
    creditCost: cost,
    suspended
  });
  const meta = TOOL_META[toolId];
  return {
    toolId,
    toolName: meta?.name || toolId,
    toolUrl: meta?.url || `/calculator/${toolId.toLowerCase()}`,
    accessType: e?.accessType ?? 'CREDIT_BASED',
    status: suspended ? 'SUSPENDED' : decision.sessionStatus,
    sessionStatus: decision.sessionStatus,
    sessionStartsAt: session?.startedAt ?? null,
    sessionEndsAt: session?.expiresAt ?? null,
    sessionRemainingSeconds: sessionRemainingSeconds(session?.expiresAt ?? null, input.nowMs),
    sessionRemainingLabel: sessionRemainingLabel(session?.expiresAt ?? null, input.nowMs),
    creditsAvailable: input.spendable,
    sessionCreditCost: cost,
    canOpenWithoutDebit: decision.canOpenWithoutDebit,
    canStartNewSession: decision.canStartNewSession,
    firstUsedAt: e?.createdAt ?? null,
    usageConsumed: e?.usageConsumed ?? 0,
    lastUsedAt: input.lastUsedAt ?? e?.lastUsedAt ?? null
  };
}

export interface MergeResult {
  rows: EntitlementView[];
  /** lastUsedAt per toolId used for sorting (max across all sources). */
  lastUsedByTool: Map<string, string>;
}

/**
 * Merge entitlements + legacy professional sessions into one row per toolId.
 * Rules (hardening mandate §6):
 *  1. one toolId appears exactly once
 *  2. newest server record wins for the session window
 *  3. an ended session can never surface as ACTIVE (only live sessions enter)
 *  4. lastUsedAt = max(lastUsedAt, session startedAt)
 *  5. creditsConsumed/usage come only from the entitlement/ledger record
 *  6. caller scopes inputs to one user (user isolation is enforced upstream)
 */
export function buildMergedToolViews(input: {
  entitlements: Map<string, ToolEntitlement>;
  sessions: Array<{ id: string; toolId: string; startedAt: string; expiresAt: string }>;
  spendable: number;
  nowMs: number;
}): MergeResult {
  const { spendable, nowMs } = input;
  const lastUsedByTool = new Map<string, string>();

  const liveByTool = new Map<string, LiveSessionInfo>();
  for (const s of input.sessions) {
    if (!s.toolId) continue;
    if (s.expiresAt && Date.parse(s.expiresAt) > nowMs) {
      const current = liveByTool.get(s.toolId);
      if (!current || Date.parse(s.expiresAt) > Date.parse(current.expiresAt)) {
        liveByTool.set(s.toolId, { id: s.id, startedAt: s.startedAt, expiresAt: s.expiresAt });
      }
    }
    if (s.startedAt) {
      const cur = lastUsedByTool.get(s.toolId);
      if (!cur || Date.parse(s.startedAt) > Date.parse(cur)) {
        lastUsedByTool.set(s.toolId, s.startedAt);
      }
    }
  }

  const merged = new Map<string, EntitlementView>();
  for (const [toolId, e] of input.entitlements) {
    if (e?.lastUsedAt) {
      const sessionLast = lastUsedByTool.get(toolId);
      if (sessionLast && Date.parse(sessionLast) > Date.parse(e.lastUsedAt)) {
        lastUsedByTool.set(toolId, sessionLast);
      } else {
        lastUsedByTool.set(toolId, e.lastUsedAt);
      }
    }
    merged.set(
      toolId,
      toView({
        userId: input.entitlements.get(toolId)!.userId,
        toolId,
        entitlement: e,
        session: liveByTool.get(toolId) ?? null,
        spendable,
        nowMs,
        lastUsedAt: lastUsedByTool.get(toolId) ?? e?.lastUsedAt
      })
    );
  }
  for (const [toolId, session] of liveByTool) {
    if (merged.has(toolId)) continue;
    if (session.startedAt) lastUsedByTool.set(toolId, session.startedAt);
    merged.set(
      toolId,
      toView({
        userId: 'legacy',
        toolId,
        entitlement: null,
        session,
        spendable,
        nowMs,
        lastUsedAt: lastUsedByTool.get(toolId) ?? session.startedAt
      })
    );
  }

  const rows = [...merged.values()].sort((a, b) => {
    const at = lastUsedByTool.get(a.toolId) ?? a.firstUsedAt ?? '';
    const bt = lastUsedByTool.get(b.toolId) ?? b.firstUsedAt ?? '';
    return bt.localeCompare(at);
  });
  return { rows, lastUsedByTool };
}
