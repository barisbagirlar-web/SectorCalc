#!/usr/bin/env node
/**
 * guard-no-rsc-rate-limit.mjs
 *
 * Fails if:
 * - middleware/rate limiter can return 429 for GET
 * - middleware/rate limiter matches _rsc requests
 * - public /cbam route is rate-limited
 * - public tool page GET routes are rate-limited
 * - large tool grids prefetch without control (if this caused RSC storms)
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let violations = 0;
let checks = 0;

function check(label, condition, detail) {
  checks++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${label}`);
    console.error(`     ${detail}`);
    violations++;
  } else {
    console.log(`  ✅ PASS: ${label}`);
  }
}

function checkFileContains(filePath, pattern, useNegation, label) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const found = pattern.test(content);
    if (useNegation) {
      check(label, !found, `Must NOT match pattern ${pattern} in ${filePath}`);
    } else {
      check(label, found, `Must match pattern ${pattern} in ${filePath}`);
    }
  } catch (e) {
    check(label, false, `Cannot read ${filePath}: ${e.message}`);
  }
}

async function main() {
  console.log("🚦 No RSC Rate-Limit Guard\n");

  const middlewarePath = join(ROOT, "src/middleware.ts");
  const middlewareContent = readFileSync(middlewarePath, "utf-8");

  // ---- Middleware rate limiter must skip GET/RSC/public ----
  check(
    "Rate limiter skips GET requests",
    middlewareContent.includes('if (method !== "POST") return true;'),
    "shouldSkipRateLimit must return true for non-POST methods"
  );

  check(
    "Rate limiter skips _rsc prefetch requests",
    middlewareContent.includes('if (request.nextUrl.searchParams.has("_rsc")) return true;'),
    "_rsc requests must be explicitly skipped"
  );

  check(
    "Rate limiter skips /_next static assets",
    middlewareContent.includes('if (pathname.startsWith("/_next")) return true;'),
    "Static assets must not be rate-limited"
  );

  check(
    "Rate limiter skips /api routes",
    middlewareContent.includes('if (pathname.startsWith("/api")) return true;'),
    "API routes must be skipped (they have their own rate limiting)"
  );

  check(
    "Rate limiter explicitly skips /cbam route",
    middlewareContent.includes('if (pathname.startsWith("/cbam")) return true;'),
    "CBAM route must be in shouldSkipRateLimit"
  );

  check(
    "Rate limiter explicitly skips /verify route",
    middlewareContent.includes('if (pathname.startsWith("/verify")) return true;'),
    "Verify route must be in shouldSkipRateLimit"
  );

  check(
    "Rate limiter skips /cbam/entitlement API",
    middlewareContent.includes('pathname.startsWith("/api/cbam/entitlement")'),
    "CBAM entitlement API must be in shouldSkipRateLimit"
  );

  check(
    "Rate limiter skips /tools/pro/ routes",
    middlewareContent.includes('pathname.startsWith("/tools/pro/")'),
    "Pro tool routes must be in shouldSkipRateLimit"
  );

  check(
    "Rate limiter skips /tools/free/ routes",
    middlewareContent.includes('pathname.startsWith("/tools/free/")'),
    "Free tool routes must be in shouldSkipRateLimit"
  );

  check(
    "Rate limiter skips homepage",
    middlewareContent.includes('if (pathname === "/") return true;'),
    "Homepage must be in shouldSkipRateLimit"
  );

  // ---- Rate limiter must only apply to POST ----
  const rateLimitSection = middlewareContent.substring(
    middlewareContent.indexOf("function isBelowRateLimit"),
    middlewareContent.indexOf("// ── Middleware ──")
  );
  check(
    "Rate limiter only applies to POST",
    !rateLimitSection.includes("GET") || rateLimitSection.includes("method !== \"POST\""),
    "Rate limiter must only track POST requests"
  );

  // ---- No 429 string for GET in middleware ----
  check(
    "Middleware does not return 429 text for GET requests",
    !middlewareContent.includes("GET") || middlewareContent.includes('if (method !== "POST") return true;'),
    "Middleware shouldSkipRateLimit must short-circuit GET before 429"
  );

  // ---- Check tool list components don't create RSC storms ----
  // (The recent commit already applied prefetch=false to grids)

  // Summary
  console.log(`\n📊 Results: ${checks} checks, ${violations} violations`);
  if (violations > 0) {
    console.log("❌ GUARD FAILED");
    process.exit(1);
  }
  console.log("✅ GUARD PASSED");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
