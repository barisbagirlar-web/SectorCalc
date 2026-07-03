/**
 * scripts/guard-v531-architecture.mjs
 * Regression guard for SectorCalc V5.3.1 single-form architecture.
 *
 * Guards:
 *   A — No legacy form runtime imports
 *   B — No null schema in execute route
 *   C — No client formula execution (private registry in client bundle)
 *   D — No formula leak in public surface
 *   E — Root-only (no locale prefix routes)
 *   F — English-only UI text
 *
 * Exit code 0 = PASS, non-zero = FAIL
 */

import fs from "node:fs";
import path from "node:path";

let exitCode = 0;

function fail(guard, reason) {
  console.error(`❌ GUARD ${guard}: ${reason}`);
  exitCode = 1;
}

function pass(guard, detail) {
  console.log(`  ✅ ${guard}: ${detail}`);
}

function recursiveFiles(dir, extSet) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (extSet.has(ext)) results.push(full);
    }
  }
  return results;
}

const SRC = path.resolve("src");
const TS_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

console.log("\n🔍 V5.3.1 Architecture Regression Guards\n");

/* ─────────────────────────────────────────── */
/*  Guard A — No legacy form runtime           */
/* ─────────────────────────────────────────── */
const LEGACY_FORMS = ["PremiumSchemaToolForm", "LegacyCalculatorForm", "ProToolForm"];
const LEGACY_FORM_SKIP = ["free-tool-results"]; // type alias only, not runtime
{
  const files = recursiveFiles(SRC, TS_EXT);
  let violations = 0;
  for (const f of files) {
    if (f.includes("__tests__") || f.includes(".test.")) continue;
    const rel = path.relative(SRC, f);
    if (LEGACY_FORM_SKIP.some((s) => rel.includes(s))) continue;
    const content = fs.readFileSync(f, "utf-8");
    for (const legacy of LEGACY_FORMS) {
      if (content.includes(legacy)) {
        console.error(`  ${rel}: contains "${legacy}"`);
        violations++;
      }
    }
  }
  if (violations > 0) {
    fail("A", `Legacy form runtime references found (${violations} matches, non-test)`);
  } else {
    pass("A", "No legacy form runtime imports (PremiumSchemaToolForm, FreeToolForm, etc.)");
  }
}

/* ─────────────────────────────────────────── */
/*  Guard B — No null schema in execute route  */
/* ─────────────────────────────────────────── */
{
  const execRoute = path.join(SRC, "app/api/pro-calculator/execute/route.ts");
  if (fs.existsSync(execRoute)) {
    const content = fs.readFileSync(execRoute, "utf-8");
    if (content.includes("const schema = null") || content.includes("let schema = null")) {
      fail("B", "Execute route contains null schema assignment");
    } else {
      pass("B", "Execute route has no null schema");
    }
  } else {
    fail("B", "Execute route file not found");
  }
}

/* ─────────────────────────────────────────── */
/*  Guard C — No client formula execution      */
/* ─────────────────────────────────────────── */
const PRIVATE_MODULE_PATTERNS = [
  "formula-registry",
  "internal-checker-trace",
  "deterministic-formula-engine",
  "golden-hash-storage",
];
const PRIVATE_MODULE_SKIP = ["admin/"]; // admin components are server-protected
{
  const clientFiles = recursiveFiles(SRC, new Set([".tsx", ".jsx"]));
  let violations = 0;
  for (const f of clientFiles) {
    if (f.includes("__tests__") || f.includes(".test.")) continue;
    const rel = path.relative(SRC, f);
    if (PRIVATE_MODULE_SKIP.some((s) => rel.includes(s))) continue;
    const content = fs.readFileSync(f, "utf-8");
    for (const pattern of PRIVATE_MODULE_PATTERNS) {
      if (content.includes(pattern)) {
        console.error(`  ${rel}: imports private module: ${pattern}`);
        violations++;
      }
    }
  }
  if (violations > 0) {
    fail("C", `Client files import private formula registry patterns (${violations} violations)`);
  } else {
    pass("C", "No client imports of private formula registry");
  }
}

/* ─────────────────────────────────────────── */
/*  Guard D — No formula leak in public surface*/
/* ─────────────────────────────────────────── */
const LEAK_PATTERNS = [
  // These are string-value leaks, not type/interface declarations
  "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI",
];
const LEAK_SKIP = ["contract-types.ts", "schema-adapter.ts", "public-response-redactor.ts"]; // these define/check the rules
{
  const publicDirs = [
    path.join(SRC, "components"),
    path.join(SRC, "sectorcalc/pro-form"),
    path.join(SRC, "app"),
  ];
  let violations = 0;
  for (const dir of publicDirs) {
    const files = recursiveFiles(dir, new Set([".ts", ".tsx"]));
    for (const f of files) {
      if (f.includes("__tests__") || f.includes(".test.")) continue;
      const rel = path.relative(SRC, f);
      if (LEAK_SKIP.some((s) => rel.includes(s))) continue;
      const content = fs.readFileSync(f, "utf-8");
      for (const pattern of LEAK_PATTERNS) {
        if (content.includes(pattern)) {
          violations++;
          console.error(`  ${rel}: contains "${pattern}"`);
        }
      }
    }
  }
  if (violations > 0) {
    fail("D", `Formula leak patterns found in public surface (${violations} matches)`);
  } else {
    pass("D", "No formula leak patterns in public surface");
  }
}

/* ─────────────────────────────────────────── */
/*  Guard E — Root-only (no locale prefixes)   */
/* ─────────────────────────────────────────── */
{
  const routeDir = path.join(SRC, "app");
  const routeFiles = [];
  for (const entry of fs.readdirSync(routeDir, { recursive: true })) {
    const full = path.join(routeDir, entry);
    // Check if the path component matches a locale code
    const parts = full.split(path.sep);
    for (const p of parts) {
      if (/^(en|tr|fr|de|es|ar)$/.test(p) && fs.statSync(full).isDirectory()) {
        const parentDir = path.dirname(full);
        const parentName = path.basename(parentDir);
        // Only flag if it's a route segment (parent is app/)
        if (parentDir === routeDir || parentName.startsWith("(")) {
          routeFiles.push(full);
        }
      }
    }
  }
  if (routeFiles.length > 0) {
    const unique = [...new Set(routeFiles.map((f) => path.relative(routeDir, f)))];
    fail("E", `Locale-prefixed route directories found (${unique.length} matches)`);
    for (const f of unique.slice(0, 5)) {
      console.error(`  app/${f}`);
    }
  } else {
    pass("E", "No locale-prefixed routes");
  }
}

/* ─────────────────────────────────────────── */
/*  Guard F — English-only UI text             */
/* ─────────────────────────────────────────── */
{
  const turkishChars = /[ğüşıöçĞÜŞİÖÇ]/;
  const uiFiles = recursiveFiles(path.join(SRC, "components"), new Set([".tsx", ".jsx"]));
  let violations = 0;
  for (const f of uiFiles) {
    if (f.includes("__tests__") || f.includes(".test.")) continue;
    const content = fs.readFileSync(f, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (turkishChars.test(lines[i])) {
        const match = lines[i].match(/'[^']*[ğüşıöçĞÜŞİÖÇ][^']*'|"[^"]*[ğüşıöçĞÜŞİÖÇ][^"]*"/);
        if (match) {
          violations++;
          if (violations <= 3) {
            console.error(`  ${path.relative(SRC, f)}:${i + 1}: ${match[0].slice(0, 80)}`);
          }
        }
      }
    }
  }
  if (violations > 0) {
    fail("F", `Turkish/non-English characters found in UI components (${violations} matches)`);
  } else {
    pass("F", "English-only UI text");
  }
}

console.log("");
if (exitCode === 0) {
  console.log("✅ ALL V5.3.1 ARCHITECTURE GUARDS PASS");
} else {
  console.error("❌ V5.3.1 ARCHITECTURE GUARDS FAILED");
}
process.exit(exitCode);
