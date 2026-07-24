#!/usr/bin/env node
import { SITE_ORIGIN } from './seo-registry.mjs';

const mode = process.argv.find((arg) => arg.startsWith('--check='))?.split('=')[1] ?? '';
if (!['status', 'content', 'canonical'].includes(mode)) {
  console.error(`[FAIL] unknown home probe: ${mode || 'missing'}`);
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function probe() {
  const response = await fetch(`${SITE_ORIGIN}/?seo_home_probe=${Date.now()}`, {
    redirect: 'manual',
    cache: 'no-store',
    headers: {
      'cache-control': 'no-cache, no-store, max-age=0',
      pragma: 'no-cache'
    }
  });
  const html = await response.text();

  if (mode === 'status') {
    if (response.status !== 200) throw new Error(`apex homepage status=${response.status}`);
    return;
  }

  if (mode === 'content') {
    const hasCurrentTitle = /<title>SectorCalc\s*-\s*Deterministic Industrial Decision Calculators<\/title>/i.test(html);
    const hasCurrentHero = /class=["'][^"']*sc-hero[^"']*["']/i.test(html) && /class=["'][^"']*sc-hero-title[^"']*["']/i.test(html);
    const hasH1 = /<h1\b/i.test(html);
    if (!hasCurrentTitle || !hasCurrentHero || !hasH1) {
      throw new Error(`apex homepage release identity mismatch title=${hasCurrentTitle} hero=${hasCurrentHero} h1=${hasH1}`);
    }
    return;
  }

  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
  if (canonical !== `${SITE_ORIGIN}/`) {
    throw new Error(`apex homepage canonical=${canonical ?? 'missing'} expected=${SITE_ORIGIN}/`);
  }
}

let lastError = null;
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    await probe();
    console.log(`[PASS] apex homepage ${mode}`);
    process.exit(0);
  } catch (error) {
    lastError = error instanceof Error ? error : new Error(String(error));
    console.error(`[WARN] apex homepage ${mode} attempt ${attempt}/6: ${lastError.message}`);
    if (attempt < 6) await sleep(10000);
  }
}

console.error(`[FAIL] apex homepage ${mode}: ${lastError?.message ?? 'unknown'}`);
process.exit(1);
