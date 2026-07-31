import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { requireUser, sendError } from '../lib/auth';
import { readWallet, entitlementCol, entitlementRef, sessionsCol } from '../lib/firestore';
import { spendableCredits } from '../domain/types';
import { buildEntitlementId, type ToolEntitlement } from '../domain/entitlement';
import { buildMergedToolViews, findLiveSessionForUser, toView } from '../domain/entitlement-view';
import { correlationIdFrom, logEntitlement, uidHash } from '../lib/entitlement-log';

async function findLiveSession(
  userId: string,
  toolId: string,
  nowMs: number
): Promise<ReturnType<typeof findLiveSessionForUser>> {
  const snap = await sessionsCol(userId)
    .where('toolId', '==', toolId)
    .where('status', '==', 'ACTIVE')
    .limit(10)
    .get();
  const docs = snap.docs.map((d) => {
    const s = d.data();
    return {
      id: d.id,
      toolId: String(s?.toolId || ''),
      startedAt: String(s?.startedAt || s?.createdAt || ''),
      expiresAt: String(s?.expiresAt || '')
    };
  });
  return findLiveSessionForUser(docs, toolId, nowMs);
}

export async function handleToolEntitlement(
  req: Request,
  res: Response,
  toolId: string
): Promise<void> {
  const correlationId = correlationIdFrom(req);
  try {
    const user = await requireUser(req);
    const nowMs = Date.now();
    const wallet = await readWallet(user.uid);
    const spendable = spendableCredits(wallet, nowMs);
    const entSnap = await entitlementRef(buildEntitlementId(user.uid, toolId)).get();
    const session = await findLiveSession(user.uid, toolId, nowMs);
    const view = toView({
      userId: user.uid,
      toolId,
      entitlement: entSnap.exists ? (entSnap.data() as ToolEntitlement) : null,
      session,
      spendable,
      nowMs
    });
    logEntitlement('entitlement_list_requested', {
      uidHash: uidHash(user.uid),
      toolId,
      result: view.sessionStatus,
      correlationId
    });
    res.status(200).json(view);
  } catch (err) {
    logEntitlement('entitlement_api_failed', {
      uidHash: '',
      toolId,
      result: err instanceof Error ? err.message : 'INTERNAL',
      correlationId
    });
    sendError(res, err);
  }
}

export async function handleMyEntitlements(req: Request, res: Response): Promise<void> {
  const correlationId = correlationIdFrom(req);
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
    const sessions = sessionSnap.docs.map((d) => {
      const s = d.data();
      return {
        id: d.id,
        toolId: String(s?.toolId || ''),
        startedAt: String(s?.startedAt || s?.createdAt || ''),
        expiresAt: String(s?.expiresAt || '')
      };
    });

    const { rows } = buildMergedToolViews({ entitlements, sessions, spendable, nowMs });

    logEntitlement('entitlement_list_requested', {
      uidHash: uidHash(user.uid),
      result: `count=${rows.length}`,
      correlationId
    });
    res.status(200).json({ tools: rows, creditsRemaining: spendable });
  } catch (err) {
    logEntitlement('entitlement_api_failed', {
      uidHash: '',
      result: err instanceof Error ? err.message : 'INTERNAL',
      correlationId
    });
    sendError(res, err);
  }
}
