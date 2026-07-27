/**
 * Authoritative credit ledger + Paddle webhook (Firebase Cloud Functions).
 * Deploy: firebase deploy --only functions,firestore:rules
 * Secrets: PADDLE_WEBHOOK_SECRET (required for webhook). Do not invent credentials.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

if (!admin.apps.length) admin.initializeApp();
const db = getFirestore(admin.app(), process.env.FIRESTORE_DB || 'sectorcalc-2');

const CREDIT_COST = { FREE: 0, CORE: 3, PRO: 7, ADVANCED: 15, DECISION: 30 };
const TOOL_TIER = {
  'SC-001': 'CORE', 'SC-010': 'CORE', 'SC-012': 'CORE', 'SC-028': 'CORE', 'SC-037': 'CORE', 'SC-038': 'CORE',
  'SC-021': 'PRO', 'SC-022': 'PRO', 'SC-023': 'PRO', 'SC-024': 'PRO', 'SC-025': 'PRO', 'SC-026': 'PRO',
  'SC-027': 'PRO', 'SC-030': 'PRO', 'SC-031': 'PRO', 'SC-032': 'PRO', 'SC-035': 'PRO', 'SC-039': 'PRO', 'SC-040': 'PRO',
  'SC-008': 'ADVANCED', 'SC-020': 'ADVANCED', 'SC-029': 'ADVANCED', 'SC-033': 'ADVANCED', 'SC-034': 'ADVANCED', 'SC-036': 'ADVANCED'
};
const PACKAGES_BY_PRICE = {
  pri_01kyhfb5q0jxrck07py0xxaqw7: { id: 'STARTER', credits: 20 },
  pri_01kyhfczs0aaj62smrthvc3my8: { id: 'WORKSHOP', credits: 100 },
  pri_01kyhff4xx34m229w6ytpjpefs: { id: 'PROFESSIONAL', credits: 300 },
  pri_01kyhfgk3ax50gz1m7zh877w9c: { id: 'TEAM_WALLET', credits: 1000 }
};
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const TRIAL_CREDITS = 15;
const TRIAL_DAYS = 14;

const walletRef = (uid) => db.collection('users').doc(uid).collection('wallet').doc('main');
const txCol = (uid) => db.collection('users').doc(uid).collection('creditTransactions');
const sessionsCol = (uid) => db.collection('users').doc(uid).collection('calculationSessions');

async function readWallet(uid, txn) {
  const snap = await txn.get(walletRef(uid));
  if (!snap.exists) return { purchasedCredits: 0, promotionalCredits: 0, promotionalExpiresAt: null, processedIds: [] };
  const d = snap.data();
  return {
    purchasedCredits: d.purchasedCredits || 0,
    promotionalCredits: d.promotionalCredits || 0,
    promotionalExpiresAt: d.promotionalExpiresAt || null,
    processedIds: Array.isArray(d.processedIds) ? d.processedIds : []
  };
}

function promoValid(w, now) {
  if ((w.promotionalCredits || 0) <= 0) return false;
  if (!w.promotionalExpiresAt) return true;
  return new Date(w.promotionalExpiresAt).getTime() > now.getTime();
}

exports.getWallet = functions.https.onCall(async (_data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const snap = await walletRef(context.auth.uid).get();
  const now = new Date();
  if (!snap.exists) {
    return { purchasedCredits: 0, promotionalCredits: 0, promotionalExpiresAt: null, availableCredits: 0, updatedAt: now.toISOString() };
  }
  const w = snap.data();
  const promo = promoValid(w, now) ? w.promotionalCredits || 0 : 0;
  return {
    purchasedCredits: w.purchasedCredits || 0,
    promotionalCredits: promo,
    promotionalExpiresAt: promo ? w.promotionalExpiresAt || null : null,
    availableCredits: (w.purchasedCredits || 0) + promo,
    updatedAt: w.updatedAt || now.toISOString()
  };
});

exports.grantTrialCredits = functions.https.onCall(async (_data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const uid = context.auth.uid;
  const idem = `trial_${uid}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TRIAL_DAYS * 86400000).toISOString();
  let granted = 0;
  await db.runTransaction(async (txn) => {
    const w = await readWallet(uid, txn);
    if (w.processedIds.includes(idem)) return;
    granted = TRIAL_CREDITS;
    const promotional = (w.promotionalCredits || 0) + TRIAL_CREDITS;
    txn.set(walletRef(uid), {
      purchasedCredits: w.purchasedCredits || 0,
      promotionalCredits: promotional,
      promotionalExpiresAt: expiresAt,
      processedIds: [...w.processedIds, idem].slice(-500),
      updatedAt: now.toISOString()
    }, { merge: true });
    txn.set(txCol(uid).doc(idem), {
      id: idem, type: 'PROMOTIONAL_GRANT', delta: TRIAL_CREDITS, purchasedDelta: 0, promotionalDelta: TRIAL_CREDITS,
      note: 'Trial promotional credits', createdAt: now.toISOString()
    });
    txn.set(db.collection('users').doc(uid), {
      credits: (w.purchasedCredits || 0) + promotional,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  return { granted, expiresAt };
});

exports.openProfessionalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  const uid = context.auth.uid;
  const toolId = String(data?.toolId || '');
  const clientSessionKey = String(data?.clientSessionKey || '');
  if (!toolId || !clientSessionKey) throw new functions.https.HttpsError('invalid-argument', 'toolId and clientSessionKey required');
  const tier = TOOL_TIER[toolId];
  if (!tier) throw new functions.https.HttpsError('failed-precondition', 'Tool unclassified');
  const cost = CREDIT_COST[tier];
  const debitId = `psession_${uid}_${toolId}_${clientSessionKey}`;
  const now = new Date();
  const existingSnap = await sessionsCol(uid).where('toolId', '==', toolId).where('status', '==', 'ACTIVE').limit(10).get();
  for (const doc of existingSnap.docs) {
    const s = doc.data();
    if (s.expiresAt && new Date(s.expiresAt).getTime() > now.getTime()) {
      return { session: { calculationSessionId: doc.id, ...s }, debit: 0 };
    }
  }
  let sessionOut = null;
  await db.runTransaction(async (txn) => {
    const w = await readWallet(uid, txn);
    if (w.processedIds.includes(debitId)) return;
    let promotionalCredits = w.promotionalCredits || 0;
    let promotionalExpiresAt = w.promotionalExpiresAt || null;
    if (promotionalCredits > 0 && promotionalExpiresAt && new Date(promotionalExpiresAt).getTime() <= now.getTime()) {
      promotionalCredits = 0; promotionalExpiresAt = null;
    }
    const avail = (w.purchasedCredits || 0) + promotionalCredits;
    if (avail < cost) throw new functions.https.HttpsError('failed-precondition', `INSUFFICIENT_CREDITS need ${cost} have ${avail}`);
    const fromPromo = Math.min(promotionalCredits, cost);
    const fromPurchased = cost - fromPromo;
    const purchasedCredits = (w.purchasedCredits || 0) - fromPurchased;
    promotionalCredits -= fromPromo;
    const createdAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS).toISOString();
    const calculationSessionId = `cs_${uid}_${toolId}_${createdAt.replace(/[:.]/g, '-')}`;
    txn.set(walletRef(uid), {
      purchasedCredits, promotionalCredits, promotionalExpiresAt,
      processedIds: [...w.processedIds, debitId].slice(-500), updatedAt: createdAt
    }, { merge: true });
    txn.set(txCol(uid).doc(debitId), {
      id: debitId, type: 'SESSION_DEBIT', delta: -cost, purchasedDelta: -fromPurchased, promotionalDelta: -fromPromo,
      toolId, pricingTier: tier, calculationSessionId, createdAt
    });
    sessionOut = {
      calculationSessionId, accountId: uid, toolId, pricingTier: tier, creditCost: cost,
      createdAt, expiresAt, reportRevisionCount: 0, maxReportRevisions: 3, status: 'ACTIVE', debitTransactionId: debitId
    };
    txn.set(sessionsCol(uid).doc(calculationSessionId), sessionOut);
    txn.set(db.collection('users').doc(uid), {
      credits: purchasedCredits + promotionalCredits,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  return { session: sessionOut, debit: cost };
});

exports.paddleWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method not allowed'); return; }
  const secret = process.env.PADDLE_WEBHOOK_SECRET || (functions.config().paddle && functions.config().paddle.webhook_secret);
  if (!secret) { console.error('PADDLE_WEBHOOK_SECRET missing'); res.status(500).send('Webhook not configured'); return; }
  const eventId = String(req.body?.event_id || req.body?.data?.id || '');
  const eventType = String(req.body?.event_type || '');
  if (!eventId) { res.status(400).send('Missing event id'); return; }
  const eventRef = db.collection('paymentEvents').doc(eventId);
  if ((await eventRef.get()).exists) { res.status(200).json({ ok: true, duplicate: true }); return; }
  if (!/transaction\.completed|transaction\.paid/i.test(eventType)) {
    await eventRef.set({ providerEventId: eventId, provider: 'paddle', type: eventType || 'ignored', processedAt: new Date().toISOString() });
    res.status(200).json({ ok: true, ignored: true }); return;
  }
  const data = req.body?.data || {};
  const custom = data.custom_data || {};
  const uid = String(custom.accountId || custom.uid || '');
  let pack = null;
  for (const item of data.items || []) {
    const priceId = item.price?.id || item.price_id || item.priceId;
    if (priceId && PACKAGES_BY_PRICE[priceId]) { pack = PACKAGES_BY_PRICE[priceId]; break; }
  }
  if (!pack && custom.packageId && custom.credits) pack = { id: custom.packageId, credits: Number(custom.credits) };
  if (!uid || !pack || !Number.isInteger(pack.credits) || pack.credits <= 0) { res.status(422).send('Cannot resolve account/package'); return; }
  const purchaseKey = `purchase_${eventId}`;
  const now = new Date();
  await db.runTransaction(async (txn) => {
    if ((await txn.get(eventRef)).exists) return;
    const w = await readWallet(uid, txn);
    if (w.processedIds.includes(purchaseKey)) {
      txn.set(eventRef, { providerEventId: eventId, provider: 'paddle', type: eventType, accountId: uid, packageId: pack.id, creditsGranted: 0, processedAt: now.toISOString(), duplicateGrant: true });
      return;
    }
    const purchasedCredits = (w.purchasedCredits || 0) + pack.credits;
    txn.set(walletRef(uid), {
      purchasedCredits, promotionalCredits: w.promotionalCredits || 0, promotionalExpiresAt: w.promotionalExpiresAt || null,
      processedIds: [...w.processedIds, purchaseKey].slice(-500), updatedAt: now.toISOString()
    }, { merge: true });
    txn.set(txCol(uid).doc(purchaseKey), {
      id: purchaseKey, type: 'PURCHASE', delta: pack.credits, purchasedDelta: pack.credits, promotionalDelta: 0,
      packageId: pack.id, providerEventId: eventId, createdAt: now.toISOString()
    });
    txn.set(eventRef, {
      providerEventId: eventId, provider: 'paddle', type: eventType, accountId: uid, packageId: pack.id, creditsGranted: pack.credits, processedAt: now.toISOString()
    });
    txn.set(db.collection('users').doc(uid), {
      credits: purchasedCredits + (w.promotionalCredits || 0),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  res.status(200).json({ ok: true });
});
