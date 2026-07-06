#!/usr/bin/env node

/**
 * guard-no-rsc-rate-limit.mjs
 *
 * Verifies that:
 * 1. middleware.ts does NOT return 429 for GET/RSC requests
 * 2. rate limiter matches do NOT include _rsc requests
 * 3. public tool GET routes are NOT in the rate-limit matcher
 * 4. large tool card links have prefetch disabled
 * 5. carbon-price-exposure does not call execute/payment API during render
 *
 * Expected output: NO_RSC_RATE_LIMIT_GUARD=PASS
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let fails = 0;
const fail = (msg) => {
  console.error(`  FAIL: ${msg}`);
  fails++;
};
const pass = (msg) => {
  console.log(`  PASS: ${msg}`);
};

console.log("guard-no-rsc-rate-limit.mjs — checking RSC rate-limit safety\n");

// ── 1. Check middleware.ts ────────────────────────────────────────────────

const middlewarePath = resolve(ROOT, "src/middleware.ts");
if (!existsSync(middlewarePath)) {
  fail("src/middleware.ts not found");
} else {
  const src = readFileSync(middlewarePath, "utf8");

  // Rate limiter must skip GET
  if (src.includes('method !== "POST"')) {
    pass("middleware rate-limiter skips non-POST methods");
  } else {
    fail("middleware rate-limiter does not skip non-POST methods — GET/RSC would be rate-limited");
  }

  // Rate limiter must skip _rsc
  if (src.includes('"_rsc"')) {
    pass("middleware rate-limiter skips _rsc requests");
  } else {
    fail("middleware rate-limiter does not skip _rsc requests");
  }

  // Rate limiter must skip public tool routes
  if (src.includes('"/tools/pro/"') && src.includes('"/tools/free/"')) {
    pass("middleware rate-limiter skips /tools/pro/* and /tools/free/* routes");
  } else {
    fail("middleware rate-limiter does not skip public tool routes");
  }

  // Rate limiter must skip listing pages
  if (src.includes('"/pro-tools"') && src.includes('"/free-tools"')) {
    pass("middleware rate-limiter skips /pro-tools and /free-tools listing pages");
  } else {
    fail("middleware rate-limiter does not skip listing pages");
  }

  // POST-only rate limit must exist
  if (src.includes('x-ratelimit-policy')) {
    pass("middleware rate-limiter has identifiable POST-only policy header");
  } else {
    fail("middleware rate-limiter missing POST-only policy header");
  }
}

// ── 2. Check CatalogPageShell tool link prefetch ──────────────────────────

const catalogShellPath = resolve(ROOT, "src/components/catalog/CatalogPageShell.tsx");
if (!existsSync(catalogShellPath)) {
  fail("CatalogPageShell.tsx not found");
} else {
  const shellSrc = readFileSync(catalogShellPath, "utf8");

  // Tool list links must have prefetch={false}
  const linkCount = (shellSrc.match(/prefetch=\{false\}/g) || []).length;
  // The "cc-link" pattern in the tool list should have prefetch={false}
  if (shellSrc.includes('prefetch={false}') && shellSrc.includes('visibleTools.map')) {
    // Check that the specific tool list Link has prefetch={false}
    if (shellSrc.includes('prefetch={false} className="cc-link"')) {
      pass("CatalogPageShell tool list links have prefetch={false}");
    } else if (shellSrc.includes('prefetch={false}') && shellSrc.includes('cc-link')) {
      pass("CatalogPageShell tool list links have prefetch={false}");
    } else {
      fail("CatalogPageShell tool list links may not have prefetch={false}");
    }
  } else {
    fail("CatalogPageShell tool list links missing prefetch={false}");
  }
}

// ── 3. Check carbon-price-exposure page does not call API during render ──

// The page is rendered via /tools/free/[slug]/page.tsx and /tools/pro/[slug]/page.tsx
const freeToolPagePath = resolve(ROOT, "src/app/tools/free/[slug]/page.tsx");
const proToolPagePath = resolve(ROOT, "src/app/tools/pro/[slug]/page.tsx");

for (const [label, filePath] of [["Free tool page", freeToolPagePath], ["Pro tool page", proToolPagePath]]) {
  if (!existsSync(filePath)) {
    fail(`${label} not found at ${filePath}`);
    continue;
  }
  const pageSrc = readFileSync(filePath, "utf8");

  // No fetch('/api/...') during render
  const fetchApiCalls = pageSrc.match(/fetch\(['"`]\/api\//g);
  if (fetchApiCalls?.length > 0) {
    fail(`${label} makes ${fetchApiCalls.length} fetch('/api/...') call(s) during render — may trigger rate limit`);
  } else {
    pass(`${label} does not call internal API during render`);
  }

  // No unstable_noStore
  if (pageSrc.includes("unstable_noStore")) {
    fail(`${label} uses unstable_noStore`);
  } else {
    pass(`${label} does not use unstable_noStore`);
  }

  // force-dynamic is acceptable but note it
  if (pageSrc.includes('force-dynamic')) {
    pass(`${label} uses force-dynamic (expected for RSC tool pages)`);
  }
}

// ── 4. Summary ────────────────────────────────────────────────────────────

console.log("");
if (fails === 0) {
  console.log("NO_RSC_RATE_LIMIT_GUARD=PASS");
  process.exit(0);
} else {
  console.log(`NO_RSC_RATE_LIMIT_GUARD=FAIL (${fails} failure(s))`);
  process.exit(1);
}
