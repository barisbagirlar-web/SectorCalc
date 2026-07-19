#!/usr/bin/env tsx
/**
 * CI/CD SEO Invariant Verification
 * =================================
 * Regression gate: blocks deploy if HSTS header is missing or
 * sitemap lastmod monoculture exceeds 60% threshold.
 *
 * Exit code: 0 = pass, 1 = blocked
 *
 * Usage: npx tsx scripts/verify-seo-invariants.ts [--url https://sectorcalc.com]
 */

const BASE_URL = process.argv.find((a) => a.startsWith("--url="))?.split("=")[1]
  ?? "https://sectorcalc.com";

async function checkHSTS(): Promise<void> {
  const response = await fetch(BASE_URL, { method: "HEAD", redirect: "manual" });
  const hsts = response.headers.get("strict-transport-security");

  if (!hsts) {
    throw new Error(
      `[FAIL] HSTS header missing on ${BASE_URL}. ` +
      `Add to firebase.json headers and next.config.ts headers.`,
    );
  }

  const hasMaxAge = /max-age=\d+/.test(hsts);
  const hasIncludeSubdomains = hsts.includes("includeSubDomains");
  const hasPreload = hsts.includes("preload");

  if (!hasMaxAge || !hasIncludeSubdomains || !hasPreload) {
    throw new Error(
      `[FAIL] HSTS header incomplete: "${hsts}". ` +
      `Expected: max-age=N; includeSubDomains; preload`,
    );
  }

  console.log("[PASS] HSTS invariant verified:", hsts);
}

async function checkLastmodEntropy(): Promise<void> {
  const response = await fetch(`${BASE_URL}/sitemap.xml`);

  if (!response.ok) {
    throw new Error(`[FAIL] Sitemap unreachable: HTTP ${response.status}`);
  }

  const xml = await response.text();

  const lastmodMatches = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];

  if (lastmodMatches.length === 0) {
    throw new Error("[FAIL] No <lastmod> entries found in sitemap.");
  }

  const lastmods = lastmodMatches.map((m) => m[1]);
  const counts = new Map<string, number>();

  for (const mod of lastmods) {
    counts.set(mod, (counts.get(mod) ?? 0) + 1);
  }

  const maxCount = Math.max(...counts.values());
  const ratio = maxCount / lastmods.length;
  const ratioPct = (ratio * 100).toFixed(1);
  const topTimestamp = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])[0][0];

  if (ratio > 0.60) {
    throw new Error(
      `[FAIL] Lastmod monoculture detected: ${ratioPct}% (${maxCount}/${lastmods.length}) ` +
      `share timestamp "${topTimestamp}". Threshold is 60%.`,
    );
  }

  const uniqueCount = counts.size;
  console.log(
    `[PASS] Lastmod entropy verified: max share ${ratioPct}%, ` +
    `${uniqueCount} unique timestamps across ${lastmods.length} URLs.`,
  );
}

async function main(): Promise<void> {
  const errors: string[] = [];

  try {
    await checkHSTS();
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  try {
    await checkLastmodEntropy();
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  if (errors.length > 0) {
    console.error("\n[BLOCKED] Deploy aborted — SEO invariant violations:\n");
    for (const e of errors) {
      console.error(`  ${e}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("\n[SUCCESS] All SEO invariants verified. Deploy authorized.");
  process.exit(0);
}

main();
