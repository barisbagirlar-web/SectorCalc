/**
 * SectorCalc billing Cloud Functions.
 * Server is the only credit/payment authority.
 */
import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { handleCheckout } from './http/checkout';
import { handleWallet, handleWalletTransactions } from './http/wallet';
import { handlePurchaseStatus } from './http/purchase';
import { handleProfessionalSession } from './http/session';
import { handlePaddleWebhook } from './http/webhook';
import { handleHealth } from './http/health';
import { runPurchaseReconciliation } from './http/reconcile';

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 20 });

/** Health + ops truth: scheduler export below means reconciliation is wired. */
export const RECONCILIATION_SCHEDULER_DEPLOYED = true as const;

function cors(res: { set: (k: string, v: string) => void }, origin: string | undefined): void {
  const allowed = new Set([
    'https://sectorcalc.com',
    'https://www.sectorcalc.com',
    'https://sectorcalc-prod.web.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]);
  if (origin && allowed.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  } else {
    res.set('Access-Control-Allow-Origin', 'https://sectorcalc.com');
  }
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function hydrateEnv(): void {
  process.env.PADDLE_ENV = (process.env.PADDLE_ENV || 'sandbox').trim();
  process.env.CREDIT_MONETIZATION_ENABLED = (
    process.env.CREDIT_MONETIZATION_ENABLED || 'true'
  ).trim();
  process.env.PADDLE_API_KEY = (process.env.PADDLE_API_KEY || '').trim();
  process.env.PADDLE_WEBHOOK_SECRET = (process.env.PADDLE_WEBHOOK_SECRET || '').trim();
  process.env.PADDLE_PRICE_STARTER = (
    process.env.PADDLE_PRICE_STARTER || 'pri_01kyhfb5q0jxrck07py0xxaqw7'
  ).trim();
  process.env.PADDLE_PRICE_WORKSHOP = (
    process.env.PADDLE_PRICE_WORKSHOP || 'pri_01kyhfczs0aaj62smrthvc3my8'
  ).trim();
  process.env.PADDLE_PRICE_PROFESSIONAL = (
    process.env.PADDLE_PRICE_PROFESSIONAL || 'pri_01kyhff4xx34m229w6ytpjpefs'
  ).trim();
  process.env.PADDLE_PRICE_TEAM_WALLET = (
    process.env.PADDLE_PRICE_TEAM_WALLET || 'pri_01kyhfgk3ax50gz1m7zh877w9c'
  ).trim();
  process.env.FIRESTORE_DB = (process.env.FIRESTORE_DB || 'sectorcalc-2').trim();
}

function normalizePath(raw: string): string {
  let path = raw || '/';
  if (path.startsWith('/api')) path = path.slice(4) || '/';
  return path;
}

function isPaddleWebhookPath(path: string): boolean {
  return path === '/webhooks/paddle' || path === '/webhook/paddle' || path === '/paddle/webhook';
}

export const api = onRequest(
  {
    cors: false,
    invoker: 'public',
    memory: '512MiB',
    timeoutSeconds: 60,
    concurrency: 80
  },
  async (req, res) => {
    hydrateEnv();
    cors(res, req.get('origin') || undefined);
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const path = normalizePath(req.path || '');
    try {
      if (path === '/health' || path === '/billing/health') {
        await handleHealth(req, res, {
          reconciliationSchedulerDeployed: RECONCILIATION_SCHEDULER_DEPLOYED
        });
        return;
      }
      if (path === '/billing/checkout' && req.method === 'POST') {
        await handleCheckout(req, res);
        return;
      }
      if (path.startsWith('/billing/purchases/') && req.method === 'GET') {
        await handlePurchaseStatus(req, res, path.replace('/billing/purchases/', ''));
        return;
      }
      if (path === '/wallet' && req.method === 'GET') {
        await handleWallet(req, res);
        return;
      }
      if (path === '/wallet/transactions' && req.method === 'GET') {
        await handleWalletTransactions(req, res);
        return;
      }
      if (path.match(/^\/tools\/[^/]+\/professional-session$/) && req.method === 'POST') {
        const toolId = path.split('/')[2]!;
        await handleProfessionalSession(req, res, toolId);
        return;
      }
      if (isPaddleWebhookPath(path) && req.method === 'POST') {
        await handlePaddleWebhook(req, res);
        return;
      }
      res.status(404).json({ error: 'NOT_FOUND', path });
    } catch (err) {
      console.error('api_unhandled', err);
      res.status(500).json({ error: 'INTERNAL' });
    }
  }
);

function hydrateAndReconcileFactory() {
  return async () => {
    hydrateEnv();
    const summary = await runPurchaseReconciliation();
    console.log('reconcile_purchases', summary);
  };
}

/** Cloud Scheduler → stuck purchase credit grants (same SSOT as webhook). */
export const reconcilePurchases = onSchedule(
  {
    schedule: 'every 15 minutes',
    region: 'us-central1',
    timeZone: 'UTC',
    memory: '512MiB',
    timeoutSeconds: 120
  },
  async () => {
    await hydrateAndReconcileFactory()();
  }
);
