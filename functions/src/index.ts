/**
 * SectorCalc billing Cloud Functions.
 * Server is the only credit/payment authority.
 */
import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { handleCheckout } from './http/checkout';
import { handleWallet, handleWalletTransactions } from './http/wallet';
import { handlePurchaseStatus } from './http/purchase';
import { handleProfessionalSession } from './http/session';
import { handlePaddleWebhook } from './http/webhook';
import { handleHealth } from './http/health';

const paddleApiKey = defineSecret('PADDLE_API_KEY');
const paddleWebhookSecret = defineSecret('PADDLE_WEBHOOK_SECRET');
const paddleEnv = defineString('PADDLE_ENV', { default: 'sandbox' });
const creditMonetization = defineString('CREDIT_MONETIZATION_ENABLED', { default: 'false' });
const priceStarter = defineString('PADDLE_PRICE_STARTER');
const priceWorkshop = defineString('PADDLE_PRICE_WORKSHOP');
const priceProfessional = defineString('PADDLE_PRICE_PROFESSIONAL');
const priceTeam = defineString('PADDLE_PRICE_TEAM_WALLET');
const firestoreDb = defineString('FIRESTORE_DB', { default: 'sectorcalc-2' });

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 20 });

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
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function hydrateEnv(): void {
  process.env.PADDLE_API_KEY = paddleApiKey.value();
  process.env.PADDLE_WEBHOOK_SECRET = paddleWebhookSecret.value();
  process.env.PADDLE_ENV = paddleEnv.value();
  process.env.CREDIT_MONETIZATION_ENABLED = creditMonetization.value();
  process.env.PADDLE_PRICE_STARTER = priceStarter.value();
  process.env.PADDLE_PRICE_WORKSHOP = priceWorkshop.value();
  process.env.PADDLE_PRICE_PROFESSIONAL = priceProfessional.value();
  process.env.PADDLE_PRICE_TEAM_WALLET = priceTeam.value();
  process.env.FIRESTORE_DB = firestoreDb.value();
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
    secrets: [paddleApiKey, paddleWebhookSecret]
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
        await handleHealth(req, res);
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
