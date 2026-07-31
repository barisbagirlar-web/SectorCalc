#!/usr/bin/env node
/**
 * Paddle LIVE connection + API key permission verification (release gate).
 * Uses the production API key from Firebase Secret Manager (never hardcoded).
 *
 * Usage:
 *   node scripts/verify-paddle-live.mjs
 *   PADDLE_API_KEY=... node scripts/verify-paddle-live.mjs
 *
 * Exit 0 + PADDLE_LIVE_VERIFY=PASS only when:
 *   - PADDLE_ENV=production and key has pdl_live_apikey_ prefix
 *   - auth probe succeeds (prices.read)
 *   - all 4 production prices are active, one-time, correct amount/currency
 *   - transactions.read probe succeeds
 */
import { execFileSync } from 'node:child_process';

const ENV = (process.env.PADDLE_ENV || '').toLowerCase() || 'production';
const API_BASE = ENV === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';

const PRICE_MAP = {
  STARTER: process.env.PADDLE_PRICE_STARTER || 'pri_01kvwh93mw594eqe3xcf6k6nbv',
  WORKSHOP: process.env.PADDLE_PRICE_WORKSHOP || 'pri_01kvwhaef7k3t46qh7teqyfj9j',
  PROFESSIONAL: process.env.PADDLE_PRICE_PROFESSIONAL || 'pri_01kvwhbg71jfp136ahdxea11f5',
  TEAM_WALLET: process.env.PADDLE_PRICE_TEAM_WALLET || 'pri_01kvwhdvpxb7fqawahdcqtq5e9'
};

const EXPECTED = {
  STARTER: { minor: '1500', credits: 20 },
  WORKSHOP: { minor: '5900', credits: 100 },
  PROFESSIONAL: { minor: '14900', credits: 300 },
  TEAM_WALLET: { minor: '39900', credits: 1000 }
};

const errors = [];

function apiKey() {
  if (process.env.PADDLE_API_KEY) return process.env.PADDLE_API_KEY;
  try {
    const out = execFileSync(
      'gcloud',
      ['secrets', 'versions', 'access', 'latest', '--secret=PADDLE_API_KEY', '--project=sectorcalc-prod'],
      { encoding: 'utf8' }
    ).trim();
    return out;
  } catch (err) {
    errors.push(
      `Could not load PADDLE_API_KEY: set PADDLE_API_KEY env or grant gcloud access (${String(err.message || err).split('\n')[0]})`
    );
    return '';
  }
}

async function paddleGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Paddle-Version': '1'
    }
  });
  let body;
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  return { res, body };
}

function redactDetail(msg) {
  // Strip any API-key lookalike before printing.
  return String(msg).replace(/pdl_(live|sdbx)_apikey_[A-Za-z0-9_-]+/g, 'pdl_...REDACTED');
}

async function verifyPrice(key, id) {
  const exp = EXPECTED[key];
  const { res, body } = await paddleGet(`/prices/${id}`);
  if (!res.ok) {
    const code = body?.error?.code;
    errors.push(`${key}: HTTP ${res.status} code=${code || '?'} (request ${body?.meta?.request_id || '?'})`);
    return;
  }
  const p = body.data || {};
  const unit = p.unit_price || {};
  const qty = p.quantity || {};
  const fails = [];
  if (p.status !== 'active') fails.push(`status=${p.status}`);
  if (String(unit.amount) !== exp.minor) fails.push(`amount=${unit.amount} != ${exp.minor}`);
  if (unit.currency_code !== 'USD') fails.push(`currency=${unit.currency_code}`);
  if (p.billing_cycle !== null) fails.push('billing_cycle != null (not one-time)');
  if (qty.minimum !== 1 || qty.maximum !== 1) fails.push(`quantity=${JSON.stringify(qty)}`);
  if (fails.length) {
    errors.push(`${key}=${id}: ${fails.join('; ')}`);
    return;
  }
  console.log(`OK ${key}=${id} active one-time ${unit.currency_code} ${unit.amount} (${exp.credits} credits)`);
}

async function main() {
  const key = apiKey();
  if (ENV !== 'production') errors.push(`PADDLE_ENV must be production (got "${ENV}")`);
  if (!key.startsWith('pdl_live_apikey_')) {
    errors.push('API key does not start with pdl_live_apikey_ (not a production key)');
  }

  // Auth + prices.read probe (also exercised per-price below).
  const probe = await paddleGet(`/prices/${PRICE_MAP.STARTER}`);
  if (probe.res.status === 401) errors.push('Auth probe: HTTP 401 — API key invalid/revoked');
  if (probe.res.status === 403) errors.push('Auth probe: HTTP 403 — missing prices.read permission');
  console.log(`Auth probe GET /prices/${PRICE_MAP.STARTER} → HTTP ${probe.res.status}`);

  // transactions.read probe.
  const txnProbe = await paddleGet('/transactions?per_page=1');
  if (txnProbe.res.status === 401) errors.push('transactions probe: HTTP 401 — API key invalid/revoked');
  if (txnProbe.res.status === 403) errors.push('transactions probe: HTTP 403 — missing transactions.read permission');
  console.log(`Auth probe GET /transactions?per_page=1 → HTTP ${txnProbe.res.status}`);

  for (const [key, id] of Object.entries(PRICE_MAP)) {
    await verifyPrice(key, id);
  }

  if (errors.length) {
    console.log('\nPADDLE_LIVE_VERIFY=FAIL');
    for (const e of errors) console.error(' -', redactDetail(e));
    process.exit(1);
  }
  console.log('\nPADDLE_LIVE_VERIFY=PASS — all 4 prices live + API key permissions OK.');
  process.exit(0);
}

main().catch((err) => {
  console.log('PADDLE_LIVE_VERIFY=FAIL');
  console.error(redactDetail(String(err?.stack || err)));
  process.exit(1);
});
