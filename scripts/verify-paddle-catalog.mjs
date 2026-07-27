#!/usr/bin/env node
/**
 * Paddle catalog verification guard.
 * Exit 0 + PADDLE_CATALOG_VERIFY=PASS only when all four one-time prices match invariants.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const INVALID = new Set([
  'pri_01kyhfb5q0jxrck07py0xxaqw7',
  'pri_01kyhfczs0aaj62smrthvc3my8',
  'pri_01kyhff4xx34m229w6ytpjpefs',
  'pri_01kyhfgk3ax50gz1m7zh877w9c'
]);

const EXPECTED = {
  STARTER: { minor: '1500', credits: 20 },
  WORKSHOP: { minor: '5900', credits: 100 },
  PROFESSIONAL: { minor: '14900', credits: 300 },
  TEAM_WALLET: { minor: '39900', credits: 1000 }
};

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (process.env[m[1]] == null) process.env[m[1]] = m[2];
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'));
loadEnvFile(resolve(process.cwd(), '.env.production'));

const env = process.env.PADDLE_ENV || process.env.VITE_PADDLE_ENV || '';
const apiKey = process.env.PADDLE_API_KEY || '';
const errors = [];

if (env !== 'sandbox' && env !== 'production') {
  errors.push(`PADDLE_ENV must be sandbox|production (got ${env || 'empty'})`);
}

const priceMap = {
  STARTER: process.env.PADDLE_PRICE_STARTER || '',
  WORKSHOP: process.env.PADDLE_PRICE_WORKSHOP || '',
  PROFESSIONAL: process.env.PADDLE_PRICE_PROFESSIONAL || '',
  TEAM_WALLET: process.env.PADDLE_PRICE_TEAM_WALLET || ''
};

for (const [key, id] of Object.entries(priceMap)) {
  if (!id) errors.push(`${key}: missing PADDLE_PRICE_${key}`);
  else if (INVALID.has(id)) errors.push(`${key}: INVALID archived/unlocked price ID ${id}`);
}

async function fetchPrice(id) {
  const base =
    env === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
  const res = await fetch(`${base}/prices/${id}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Paddle-Version': '1'
    }
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status} ${JSON.stringify(body.error || body)}`);
  return body.data;
}

async function main() {
  if (!apiKey) errors.push('PADDLE_API_KEY missing');

  if (errors.length) {
    console.log('PADDLE_CATALOG_VERIFY=FAIL');
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }

  for (const [key, id] of Object.entries(priceMap)) {
    try {
      const p = await fetchPrice(id);
      const exp = EXPECTED[key];
      if (p.status !== 'active') errors.push(`${key}: status=${p.status}`);
      if (p.billing_cycle !== null) errors.push(`${key}: billing_cycle must be null (got ${JSON.stringify(p.billing_cycle)})`);
      if (p.trial_period !== null) errors.push(`${key}: trial_period must be null`);
      if (p.quantity?.minimum !== 1 || p.quantity?.maximum !== 1) {
        errors.push(`${key}: quantity must be 1..1 (got ${JSON.stringify(p.quantity)})`);
      }
      if (String(p.unit_price?.amount) !== exp.minor) {
        errors.push(`${key}: amount ${p.unit_price?.amount} != ${exp.minor}`);
      }
      if (p.unit_price?.currency_code !== 'USD') {
        errors.push(`${key}: currency must be USD`);
      }
      console.log(
        `OK ${key}=${id} one-time amount=${p.unit_price.amount} qty=${JSON.stringify(p.quantity)}`
      );
    } catch (err) {
      errors.push(String(err.message || err));
    }
  }

  if (errors.length) {
    console.log('PADDLE_CATALOG_VERIFY=FAIL');
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }
  console.log('PADDLE_CATALOG_VERIFY=PASS');
}

main().catch((err) => {
  console.log('PADDLE_CATALOG_VERIFY=FAIL');
  console.error(err);
  process.exit(1);
});
