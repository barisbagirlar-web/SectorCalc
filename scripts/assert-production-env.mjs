#!/usr/bin/env node
/**
 * Fail the production build if required Vite client env is missing.
 * Runs before `vite build` so Hosting never ships a hollow auth/payments bundle.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const required = [
  'VITE_PADDLE_ENV',
  'VITE_PADDLE_CLIENT_TOKEN',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_FIRESTORE_DB',
  'VITE_OPS_GATE_HASH',
  'VITE_OPS_ADMIN_EMAILS'
];

function loadEnvFile(name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const i = trimmed.indexOf('=');
    if (i < 0) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const fileEnv =
  mode === 'production'
    ? { ...loadEnvFile('.env'), ...loadEnvFile('.env.production'), ...loadEnvFile('.env.production.local') }
    : { ...loadEnvFile('.env'), ...loadEnvFile('.env.local') };

const merged = { ...fileEnv, ...process.env };
const missing = required.filter((k) => !merged[k] || String(merged[k]).trim() === '');

if (missing.length) {
  console.error('Production client env incomplete. Missing:');
  for (const k of missing) console.error(`  - ${k}`);
  console.error('Set them in .env.production (committed public client config) or CI secrets.');
  process.exit(1);
}

if (!String(merged.VITE_FIREBASE_PROJECT_ID).includes('sectorcalc')) {
  console.error('VITE_FIREBASE_PROJECT_ID does not look like sectorcalc-prod');
  process.exit(1);
}

if (!String(merged.VITE_PADDLE_CLIENT_TOKEN).startsWith('test_') &&
    !String(merged.VITE_PADDLE_CLIENT_TOKEN).startsWith('live_')) {
  console.error('VITE_PADDLE_CLIENT_TOKEN must start with test_ or live_');
  process.exit(1);
}

console.log('OK: production client env ready');
console.log(`  paddle=${merged.VITE_PADDLE_ENV}`);
console.log(`  firebase=${merged.VITE_FIREBASE_PROJECT_ID}`);
console.log(`  firestore=${merged.VITE_FIREBASE_FIRESTORE_DB}`);
console.log(`  opsAdmins=${merged.VITE_OPS_ADMIN_EMAILS}`);
