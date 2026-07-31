import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import type {
  DocumentData,
  DocumentReference,
  Query,
  SetOptions,
  UpdateData
} from 'firebase-admin/firestore';
import { requireUser, sendError } from '../lib/auth';
import { resolveToolCost } from '../domain/packages';
import { openProfessionalSession, type ProfessionalSession } from '../domain/session';
import { monetizationEnabled } from '../lib/config';
import {
  db,
  ledgerCol,
  sessionsCol,
  walletRef,
  entitlementRef,
  FieldValue
} from '../lib/firestore';
import { emptyWallet, spendableCredits } from '../domain/types';
import {
  buildEntitlementId,
  touchEntitlementUsage,
  upsertCreditBasedEntitlement,
  type ToolEntitlement
} from '../domain/entitlement';
import { correlationIdFrom, logEntitlement, uidHash } from '../lib/entitlement-log';

function newId(): string {
  return db().collection('_').doc().id;
}

/** Structural snapshots so the transaction core is unit-testable without Firebase. */
export interface SessionDocSnapshotLike {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

export interface SessionQuerySnapshotLike {
  docs: Array<{ id: string; ref: unknown; data(): Record<string, unknown> }>;
}

/** Structural subset of Firestore Transaction used by the session core. */
export interface ProfessionalSessionTx {
  getDoc(ref: unknown): Promise<SessionDocSnapshotLike>;
  getQuery(ref: unknown): Promise<SessionQuerySnapshotLike>;
  set(ref: unknown, data: unknown, opts?: { merge?: boolean }): void;
  update(ref: unknown, data: unknown): void;
}

export interface ProfessionalSessionTxRefs {
  walletRef: unknown;
  activeSessionsQuery: unknown;
  entitlementRef: unknown;
  ledgerDoc: (entryId: string) => unknown;
  sessionDoc: (sessionId: string) => unknown;
}

export interface ProfessionalSessionTxContext {
  userId: string;
  toolId: string;
  pricing: { tier: string; creditCost: number; monetizationEnabled: boolean };
  nowMs: number;
  nowIso: string;
  correlationId: string;
  idFactory: () => string;
}

/**
 * Firestore-safe session transaction core.
 *
 * PHASE A — ALL READS (wallet, active sessions query, entitlement doc)
 * PHASE B — ALL WRITES (expired-session updates, wallet/ledger/session/entitlement sets)
 *
 * Firestore requires every read to happen before the first write; this split is
 * mandatory — a tx.get() after a tx.set()/tx.update() is rejected with an error.
 */
export async function executeProfessionalSessionTx(
  tx: ProfessionalSessionTx,
  refs: ProfessionalSessionTxRefs,
  ctx: ProfessionalSessionTxContext
): Promise<Record<string, unknown>> {
  const { userId, toolId, pricing, nowMs, nowIso, correlationId, idFactory } = ctx;
  const uidH = uidHash(userId);

  // ── PHASE A: ALL READS ────────────────────────────────────────────────
  const wSnap = await tx.getDoc(refs.walletRef);
  const wallet = wSnap.exists
    ? {
        userId,
        purchasedCredits: Number(wSnap.data()!.purchasedCredits) || 0,
        promotionalCredits: Number(wSnap.data()!.promotionalCredits) || 0,
        promotionalExpiresAt: (wSnap.data()!.promotionalExpiresAt as string) || null,
        creditDebt: Number(wSnap.data()!.creditDebt) || 0,
        version: Number(wSnap.data()!.version) || 0,
        updatedAt: (wSnap.data()!.updatedAt as string) || nowIso
      }
    : emptyWallet(userId, nowIso);
  const creditsBefore = spendableCredits(wallet, nowMs);

  const activeSnap = await tx.getQuery(refs.activeSessionsQuery);
  const entSnap = await tx.getDoc(refs.entitlementRef);
  const existingEntitlement = entSnap.exists
    ? (entSnap.data() as unknown as ToolEntitlement)
    : null;

  // Collect expired refs without writing — no tx.update inside the read loop.
  const expiredSessionRefs: unknown[] = [];
  let existing: ProfessionalSession | null = null;
  for (const d of activeSnap.docs) {
    const s = { id: d.id, ...(d.data() as Omit<ProfessionalSession, 'id'>) };
    if (Date.parse(s.expiresAt) > nowMs) {
      existing = s;
      break;
    }
    expiredSessionRefs.push(d.ref);
  }

  // ── OUTCOME (pure) ────────────────────────────────────────────────────
  const outcome = openProfessionalSession({
    wallet,
    userId,
    toolId,
    pricingTier: pricing.tier,
    creditCost: pricing.creditCost,
    monetizationEnabled: pricing.monetizationEnabled,
    existingActive: existing,
    nowMs,
    idFactory
  });

  // ── PHASE B: ALL WRITES ───────────────────────────────────────────────
  for (const ref of expiredSessionRefs) {
    tx.update(ref, { status: 'EXPIRED' });
  }

  if (!outcome.ok) {
    logEntitlement('entitlement_session_denied', {
      uidHash: uidH,
      toolId,
      result: outcome.code,
      creditsBefore,
      correlationId
    });
    return {
      error: outcome.code,
      requiredCredits: outcome.requiredCredits,
      availableCredits: outcome.availableCredits
    };
  }

  if (!outcome.reused) {
    tx.set(refs.walletRef, outcome.wallet, { merge: true });
    for (const e of outcome.ledger) tx.set(refs.ledgerDoc(e.id), e);
    tx.set(refs.sessionDoc(outcome.session.id), {
      ...outcome.session,
      updatedAt: FieldValue.serverTimestamp()
    });
    tx.set(
      refs.entitlementRef,
      upsertCreditBasedEntitlement({
        existing: existingEntitlement,
        userId,
        toolId,
        purchaseId: `session:${toolId}:${nowMs}`,
        expiresAt: outcome.session.expiresAt,
        debit: outcome.debit,
        nowIso
      })
    );
    logEntitlement('entitlement_session_started', {
      uidHash: uidH,
      toolId,
      sessionId: outcome.session.id,
      result: 'started',
      creditsBefore,
      creditsAfter: spendableCredits(outcome.wallet, nowMs),
      correlationId
    });
    logEntitlement('entitlement_upserted', {
      uidHash: uidH,
      toolId,
      sessionId: outcome.session.id,
      result: existingEntitlement ? 'extended' : 'created',
      creditsBefore,
      creditsAfter: spendableCredits(outcome.wallet, nowMs),
      correlationId
    });
  } else if (existingEntitlement) {
    tx.set(refs.entitlementRef, touchEntitlementUsage({ existing: existingEntitlement, nowIso }));
    logEntitlement('entitlement_session_reused', {
      uidHash: uidH,
      toolId,
      sessionId: outcome.session.id,
      result: 'reused',
      creditsBefore,
      creditsAfter: creditsBefore,
      correlationId
    });
  } else {
    logEntitlement('entitlement_session_reused', {
      uidHash: uidH,
      toolId,
      sessionId: outcome.session.id,
      result: 'reused',
      creditsBefore,
      creditsAfter: creditsBefore,
      correlationId
    });
  }

  const promoOk =
    outcome.wallet.promotionalExpiresAt && Date.parse(outcome.wallet.promotionalExpiresAt) > nowMs
      ? outcome.wallet.promotionalCredits
      : 0;
  return {
    sessionId: outcome.session.id,
    toolId: outcome.session.toolId,
    startedAt: outcome.session.startedAt,
    expiresAt: outcome.session.expiresAt,
    creditCost: outcome.reused ? 0 : outcome.debit,
    reused: outcome.reused,
    newWalletBalance: outcome.wallet.purchasedCredits + promoOk
  };
}

export async function handleProfessionalSession(
  req: Request,
  res: Response,
  toolId: string
): Promise<void> {
  const correlationId = correlationIdFrom(req);
  try {
    if (!monetizationEnabled()) {
      res
        .status(503)
        .json({ error: 'TOOL_NOT_MONETIZED', message: 'CREDIT_MONETIZATION_ENABLED=false' });
      return;
    }
    const user = await requireUser(req);
    const pricing = resolveToolCost(toolId);
    if (!pricing || !pricing.monetizationEnabled) {
      res.status(400).json({ error: 'TOOL_NOT_MONETIZED' });
      return;
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    let resultPayload: Record<string, unknown> | null = null;

    await db().runTransaction(async (tx) => {
      const refs: ProfessionalSessionTxRefs = {
        walletRef: walletRef(user.uid),
        activeSessionsQuery: sessionsCol(user.uid)
          .where('toolId', '==', toolId)
          .where('status', '==', 'ACTIVE')
          .limit(5),
        entitlementRef: entitlementRef(buildEntitlementId(user.uid, toolId)),
        ledgerDoc: (entryId) => ledgerCol(user.uid).doc(entryId),
        sessionDoc: (sessionId) => sessionsCol(user.uid).doc(sessionId)
      };
      const adapter: ProfessionalSessionTx = {
        getDoc: (ref) => tx.get(ref as unknown as DocumentReference),
        getQuery: (ref) => tx.get(ref as unknown as Query),
        set: (ref, data, opts) =>
          tx.set(ref as unknown as DocumentReference, data as DocumentData, opts as SetOptions),
        update: (ref, data) =>
          tx.update(ref as unknown as DocumentReference, data as UpdateData<DocumentData>)
      };
      resultPayload = await executeProfessionalSessionTx(adapter, refs, {
        userId: user.uid,
        toolId,
        pricing: {
          tier: pricing.tier,
          creditCost: pricing.creditCost,
          monetizationEnabled: pricing.monetizationEnabled
        },
        nowMs,
        nowIso,
        correlationId,
        idFactory: () => newId()
      });
    });

    const payload = resultPayload as Record<string, unknown> | null;
    if (payload && typeof payload.error === 'string') {
      const code = payload.error;
      const status = code === 'INSUFFICIENT_CREDITS' || code === 'BILLING_DEBT' ? 402 : 400;
      res.status(status).json(payload);
      return;
    }
    res.status(200).json(payload);
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
