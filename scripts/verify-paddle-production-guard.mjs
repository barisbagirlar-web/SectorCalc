import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

console.log('[SectorCalc] Running Paddle Production Guard Verification...');

const errors = [];

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
    errors.push('functions/.env.sectorcalc-prod contains sandbox price IDs (pri_01ky)! Must be live pri_01kv...');
  }
}

// 3. Inspect dist/assets JS files if build directory exists
const distAssetsPath = path.join(root, 'dist', 'assets');
if (fs.existsSync(distAssetsPath)) {
  const files = fs.readdirSync(distAssetsPath);
  for (const file of files) {
    if (file.endsWith('.js')) {
      const fullPath = path.join(distAssetsPath, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('VITE_PADDLE_ENV:"sandbox"')) {
        errors.push(`dist/assets/${file} contains literal VITE_PADDLE_ENV:"sandbox"! Must be production.`);
      }
      if (content.includes('test_6380be7c84b551e3fcd08d55d7e')) {
        errors.push(`dist/assets/${file} contains test client token! Must be live_...`);
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

console.log('✅ [OK] Paddle Production Guard Passed — Zero Sandbox/Test Leak Detected.');
