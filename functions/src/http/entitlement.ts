import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { requireUser, sendError } from '../lib/auth';
import { readWallet, entitlementCol, entitlementRef, sessionsCol } from '../lib/firestore';
import { spendableCredits } from '../domain/types';
import { resolveToolCost } from '../domain/packages';
import {
  buildEntitlementId,
  computeEntitlementStatus,
  entitlementCanAccess,
  entitlementDaysRemaining,
  TOOL_META,
  type ToolEntitlement
} from '../domain/entitlement';

export interface EntitlementView {
  id: string;
  toolId: string;
  toolName: string;
  toolUrl: string;
  status: string;
  accessType: string;
  startsAt: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  usageLimit: number | null;
  usageConsumed: number;
  usageRemaining: number | null;
  creditsRemaining: number;
  creditCost: number;
  canAccess: boolean;
  sessionActive: boolean;
  lastUsedAt: string | null;
  purchasedAt: string;
}

function toView(input: {
  userId: string;
  toolId: string;
  entitlement: ToolEntitlement | null;
  sessionExpiresAt: string | null;
  spendable: number;
  nowMs: number;
}): EntitlementView {
  const { toolId, entitlement: e } = input;
  const sessionExpires = input.sessionExpiresAt || e?.expiresAt || null;
  const accessType = e?.accessType ?? 'CREDIT_BASED';
  const cost = resolveToolCost(toolId)?.creditCost ?? 0;
  const status = computeEntitlementStatus({
    storedStatus: e?.status ?? 'ACTIVE',
    accessType,
    expiresAt: sessionExpires,
    usageLimit: e?.usageLimit ?? null,
    usageConsumed: e?.usageConsumed ?? 0,
    nowMs: input.nowMs
  });
  const canAccess = entitlementCanAccess({
    status,
    accessType,
    expiresAt: sessionExpires,
    usageLimit: e?.usageLimit ?? null,
    usageConsumed: e?.usageConsumed ?? 0,
    creditsAvailable: input.spendable,
    creditCost: cost,
    nowMs: input.nowMs
  });
  const meta = TOOL_META[toolId];
  return {
    id: e?.id || buildEntitlementId(input.userId, toolId),
    toolId,
    toolName: meta?.name || toolId,
    toolUrl: meta?.url || `/calculator/${toolId.toLowerCase()}`,
    status,
    accessType,
    startsAt: e?.startsAt ?? null,
    expiresAt: sessionExpires,
    daysRemaining: entitlementDaysRemaining(sessionExpires, input.nowMs),
    usageLimit: e?.usageLimit ?? null,
    usageConsumed: e?.usageConsumed ?? 0,
    usageRemaining:
      e?.usageLimit != null ? Math.max(0, e.usageLimit - (e?.usageConsumed ?? 0)) : null,
    creditsRemaining: input.spendable,
    creditCost: cost,
    canAccess,
    sessionActive: !!input.sessionExpiresAt,
    lastUsedAt: e?.lastUsedAt ?? null,
    purchasedAt: e?.createdAt ?? ''
  };
}

async function findLiveSession(
  userId: string,
  toolId: string,
  nowMs: number
): Promise<string | null> {
  const snap = await sessionsCol(userId)
    .where('toolId', '==', toolId)
    .where('status', '==', 'ACTIVE')
    .limit(5)
    .get();
  for (const d of snap.docs) {
    const expiresAt = String(d.data()?.expiresAt || '');
    if (expiresAt && Date.parse(expiresAt) > nowMs) return expiresAt;
  }
  return null;
}

export async function handleToolEntitlement(
  req: Request,
  res: Response,
  toolId: string
): Promise<void> {
  try {
    const user = await requireUser(req);
    const nowMs = Date.now();
    const wallet = await readWallet(user.uid);
    const spendable = spendableCredits(wallet, nowMs);
    const entSnap = await entitlementRef(buildEntitlementId(user.uid, toolId)).get();
    const sessionExpiresAt = await findLiveSession(user.uid, toolId, nowMs);
    const view = toView({
      userId: user.uid,
      toolId,
      entitlement: entSnap.exists ? (entSnap.data() as ToolEntitlement) : null,
      sessionExpiresAt,
      spendable,
      nowMs
    });
    res.status(200).json(view);
  } catch (err) {
    sendError(res, err);
  }
}

export async function handleMyEntitlements(req: Request, res: Response): Promise<void> {
  try {
    const user = await requireUser(req);
    const nowMs = Date.now();
    const wallet = await readWallet(user.uid);
    const spendable = spendableCredits(wallet, nowMs);

    const entSnap = await entitlementCol().where('userId', '==', user.uid).limit(100).get();
    const entitlements = new Map<string, ToolEntitlement>();
    for (const d of entSnap.docs) {
      const e = d.data() as ToolEntitlement;
      entitlements.set(e.toolId, e);
    }

    // Legacy: sessions opened before entitlements existed still grant access.
    const sessionSnap = await sessionsCol(user.uid).limit(200).get();
    const liveByTool = new Map<string, string>();
    for (const d of sessionSnap.docs) {
      const s = d.data();
      const toolId = String(s?.toolId || '');
      const expiresAt = String(s?.expiresAt || '');
      if (!toolId || !expiresAt || Date.parse(expiresAt) <= nowMs) continue;
      const current = liveByTool.get(toolId);
      if (!current || Date.parse(expiresAt) > Date.parse(current)) {
        liveByTool.set(toolId, expiresAt);
      }
    }

    const merged = new Map<string, EntitlementView>();
    for (const [toolId, e] of entitlements) {
      merged.set(
        toolId,
        toView({
          userId: user.uid,
          toolId,
          entitlement: e,
          sessionExpiresAt: liveByTool.get(toolId) ?? null,
          spendable,
          nowMs
        })
      );
    }
    for (const [toolId, expiresAt] of liveByTool) {
      if (merged.has(toolId)) continue;
      merged.set(
        toolId,
        toView({
          userId: user.uid,
          toolId,
          entitlement: null,
          sessionExpiresAt: expiresAt,
          spendable,
          nowMs
        })
      );
    }

    const rows = [...merged.values()].sort((a, b) =>
      (b.lastUsedAt || b.purchasedAt).localeCompare(a.lastUsedAt || a.purchasedAt)
    );
    res.status(200).json({ tools: rows, creditsRemaining: spendable });
  } catch (err) {
    sendError(res, err);
  }
}
