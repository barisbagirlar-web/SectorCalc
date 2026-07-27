/**
 * SectorCalc billing Cloud Functions.
 * Server is the only credit/payment authority.
 */
import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { handleCheckout } from './http/checkout';
import { handleWallet, handleWalletTransactions } from './http/wallet';
import { handlePurchaseStatus } from './http/purchase';
import { handleProfessionalSession } from './http/session';
import { handlePaddleWebhook } from './http/webhook';
import { handleHealth } from './http/health';

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

export const api = onRequest({ cors: false, invoker: 'public' }, async (req, res) => {
  cors(res, req.get('origin') || undefined);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const path = (req.path || '').replace(/^\/api/, '') || '/';
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
    if ((path === '/webhooks/paddle' || path === '/webhook/paddle') && req.method === 'POST') {
      await handlePaddleWebhook(req, res);
      return;
    }
    res.status(404).json({ error: 'NOT_FOUND', path });
  } catch (err) {
    console.error('api_unhandled', err);
    res.status(500).json({ error: 'INTERNAL' });
  }
});
