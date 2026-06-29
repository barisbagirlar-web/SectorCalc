#!/usr/bin/env node
/**
 * Smoke test: verify deploy freshness by checking ETag and cache headers.
 *
 * Run AFTER deploy to confirm the new build is live and cache policy is correct.
 *
 * Usage:
 *   node scripts/smoke-deploy-cache.mjs [url]
 *
 * Default URL: https://www.sectorcalc.com/
 */

const DEFAULT_URL = "https://www.sectorcalc.com/";
const URL = process.argv[2] || DEFAULT_URL;

const EXPECTED_CACHE = "public, max-age=0, must-revalidate";
const MAX_AGE_SEC = 600; // max Surrogate-Control age in seconds

async function main() {
  console.log(`=== Deploy Cache Smoke Test — ${URL} ===\n`);

  const response = await fetch(URL, { method: "HEAD", redirect: "follow" });
  const headers = {};

  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  let failed = false;

  // 1. ETag — verify it changes between deploys (manual comparison)
  const etag = headers["etag"] || "(missing)";
  console.log(`ETag: ${etag}`);
  console.log(`   (compare against pre-deploy value to confirm freshness)\n`);

  // 2. Cache-Control — must be short-lived
  const cacheControl = headers["cache-control"] || "(missing)";
  const cacheOk = cacheControl.includes("max-age=0") || cacheControl.includes("no-cache") || cacheControl.includes("must-revalidate");
  if (!cacheOk) {
    console.error(`✗ FAIL: Cache-Control="${cacheControl}" — expected short-lived policy`);
    console.error(`  Expected pattern: max-age=0 or no-cache or must-revalidate`);
    failed = true;
  } else {
    console.log(`✓ Cache-Control: ${cacheControl}`);
  }

  // 3. Surrogate-Control — must exist with reasonable age
  const surrogateControl = headers["surrogate-control"] || "(missing)";
  const surrogateMatch = surrogateControl.match(/max-age=(\d+)/);
  if (!surrogateMatch) {
    console.error(`✗ FAIL: Surrogate-Control="${surrogateControl}" — expected max-age directive`);
    failed = true;
  } else {
    const age = parseInt(surrogateMatch[1], 10);
    if (age > MAX_AGE_SEC) {
      console.error(`✗ FAIL: Surrogate-Control max-age=${age}s — expected ≤${MAX_AGE_SEC}s`);
      failed = true;
    } else {
      console.log(`✓ Surrogate-Control: ${surrogateControl} (max-age=${age}s ≤${MAX_AGE_SEC}s)`);
    }
  }

  // 4. Surrogate-Key — must exist
  const surrogateKey = headers["surrogate-key"] || "(missing)";
  if (surrogateKey === "(missing)") {
    console.warn(`⚠ WARN: Surrogate-Key is missing — targeted CDN purge will not work`);
  } else {
    console.log(`✓ Surrogate-Key: ${surrogateKey}`);
  }

  // 5. Server — should be Google Frontend (App Hosting)
  const server = headers["server"] || "(missing)";
  console.log(`Server: ${server}`);

  console.log(`\n${failed ? "✗ SMOKE TEST FAILED" : "✓ SMOKE TEST PASSED"}`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(`smoke-deploy-cache: error — ${err.message}`);
  process.exit(1);
});
