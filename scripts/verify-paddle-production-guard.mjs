import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();

console.log('[SectorCalc] Running Paddle Production Guard Verification...');

const errors = [];

// Secret patterns intentionally match a broad suffix alphabet. The guard must
// detect secrets containing characters such as +, / or = without ever printing
// the matched value into CI logs.
const PADDLE_SECRET_PATTERNS = [
  "pdl_(live|sdbx)_apikey_[^[:space:]\\\"'`]{20,}",
  "pdl_ntfset_[^[:space:]\\\"'`]{20,}",
  "whsec_[^[:space:]\\\"'`]{20,}"
];
const PADDLE_SECRET_PATTERN = PADDLE_SECRET_PATTERNS.join('|');

function findTrackedSecretFiles() {
  try {
    const output = execFileSync(
      'git',
      [
        'grep',
        '-IlE',
        PADDLE_SECRET_PATTERN,
        '--',
        ':!package-lock.json',
        ':!functions/package-lock.json'
      ],
      { encoding: 'utf8', cwd: root }
    ).trim();
    return output ? output.split(/\r?\n/).filter(Boolean).sort() : [];
  } catch (err) {
    // git grep exits 1 when there are no matches. Any other failure is a guard failure.
    if (typeof err === 'object' && err && 'status' in err && err.status === 1) return [];
    errors.push('Could not complete tracked-file secret scan.');
    return [];
  }
}

function containsPaddleSecret(text) {
  const patterns = [
    /pdl_(?:live|sdbx)_apikey_[^\s"'`]{20,}/,
    /pdl_ntfset_[^\s"'`]{20,}/,
    /whsec_[^\s"'`]{20,}/
  ];
  return patterns.some((pattern) => pattern.test(String(text)));
}

// 1. Inspect .env.production
const envProdPath = path.join(root, '.env.production');
if (fs.existsSync(envProdPath)) {
  const content = fs.readFileSync(envProdPath, 'utf8');
  if (content.includes('VITE_PADDLE_ENV=sandbox')) {
    errors.push('.env.production contains VITE_PADDLE_ENV=sandbox! Must be production.');
  }
  if (content.includes('test_')) {
    errors.push('.env.production contains a test token! Must be live_...');
  }
  if (!content.includes('VITE_PADDLE_CLIENT_TOKEN=live_')) {
    errors.push('.env.production client token must start with live_...');
  }
} else {
  errors.push('.env.production file is missing!');
}

// 2. Inspect functions/.env.sectorcalc-prod
const funcEnvPath = path.join(root, 'functions', '.env.sectorcalc-prod');
if (fs.existsSync(funcEnvPath)) {
  const content = fs.readFileSync(funcEnvPath, 'utf8');
  if (content.includes('PADDLE_ENV=sandbox')) {
    errors.push('functions/.env.sectorcalc-prod contains PADDLE_ENV=sandbox! Must be production.');
  }
  if (content.includes('pri_01ky')) {
    errors.push(
      'functions/.env.sectorcalc-prod contains sandbox price IDs (pri_01ky)! Must be live pri_01kv...'
    );
  }
  if (content.includes('PADDLE_API_KEY')) {
    errors.push('functions/.env.sectorcalc-prod contains PADDLE_API_KEY! Must use Firebase Secret Manager.');
  }
  if (content.includes('PADDLE_WEBHOOK_SECRET')) {
    errors.push(
      'functions/.env.sectorcalc-prod contains PADDLE_WEBHOOK_SECRET! Must use Firebase Secret Manager.'
    );
  }
  const expectedPrices = [
    'pri_01kvwh93mw594eqe3xcf6k6nbv',
    'pri_01kvwhaef7k3t46qh7teqyfj9j',
    'pri_01kvwhbg71jfp136ahdxea11f5',
    'pri_01kvwhdvpxb7fqawahdcqtq5e9'
  ];
  for (const priceId of expectedPrices) {
    if (!content.includes(priceId)) {
      errors.push(`functions/.env.sectorcalc-prod missing required production price ID: ${priceId}`);
    }
  }
}

// 3. Inspect git tracked files for hardcoded API keys or webhook secrets.
// IMPORTANT: request filenames only (-l). Never print matching lines or values.
const trackedSecretFiles = findTrackedSecretFiles();
if (trackedSecretFiles.length > 0) {
  errors.push(`Tracked git files contain hardcoded Paddle secrets in: ${trackedSecretFiles.join(', ')}`);
}

// 4. Inspect dist/assets JS files if --dist flag is passed
if (process.argv.includes('--dist')) {
  const distAssetsPath = path.join(root, 'dist', 'assets');
  if (fs.existsSync(distAssetsPath)) {
    const files = fs.readdirSync(distAssetsPath).sort();
    for (const file of files) {
      if (file.endsWith('.js')) {
        const fullPath = path.join(distAssetsPath, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('VITE_PADDLE_ENV:"sandbox"')) {
          errors.push(`dist/assets/${file} contains sandbox Paddle environment configuration.`);
        }
        if (content.includes('VITE_PADDLE_CLIENT_TOKEN:"test_')) {
          errors.push(`dist/assets/${file} contains a test Paddle client token.`);
        }
        if (containsPaddleSecret(content)) {
          errors.push(`dist/assets/${file} contains a server-side Paddle secret pattern.`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ [FAIL] Paddle Production Guard Violations Found:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('✅ [OK] Paddle Production Guard Passed — no server-side Paddle secret pattern detected.');