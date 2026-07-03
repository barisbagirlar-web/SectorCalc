// SectorCalc V5.3.1 — Monetization Safety Guard
// Fails build on forbidden patterns in monetization code.

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let exitCode = 0;
const results = [];

function fail(reason, file, detail) {
  results.push({ status: "FAIL", reason, file, detail });
  exitCode = 1;
}

function pass(reason) {
  results.push({ status: "PASS", reason, file: "", detail: "" });
}

function readFileOrNull(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function scanFile(path, pattern, label) {
  if (!existsSync(path)) {
    fail(label, path, "File not found");
    return [];
  }
  const content = readFileSync(path, "utf8");
  if (!content) return [];
  const lines = content.split("\n");
  const matches = [];
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      matches.push({ line: i + 1, text: lines[i].trim() });
    }
  }
  return matches;
}

function readdirRecursive(dir) {
  const result = [];
  function walk(current) {
    const entries = readdirSync(current);
    for (const entry of entries) {
      const fullPath = join(current, entry);
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }
  walk(dir);
  return result;
}

// ── Checks ──

// 1. Registry: no `logic: (`
const registryPath = join(ROOT, "src/sectorcalc/monetization/monetization-registry.ts");
const logicMatches = scanFile(registryPath, /logic:\s*\(/, "monetization-registry.ts must not contain `logic: (`");
if (logicMatches.length > 0) {
  fail(
    "Registry contains function values (logic: ()",
    "src/sectorcalc/monetization/monetization-registry.ts",
    logicMatches.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
  );
} else {
  pass("Registry has no `logic: (` functions");
}

// 2. Checkout: no `priceId` from client body (server-side local variable is fine)
const checkoutPath = join(ROOT, "src/app/api/checkout/route.ts");
const checkoutContent = readFileOrNull(checkoutPath);
if (checkoutContent) {
  const lines = checkoutContent.split("\n");
  const rawPriceIdIssues = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for raw priceId in request body destructuring or type annotation
    if (
      /body\.\s*priceId\b/.test(line) ||
      /\bpriceId\b.*typeof\s/.test(line) ||
      /:\s*(string|unknown)[^;]*\bpriceId\b/.test(line) ||
      /\bpriceId\b.*req\./.test(line)
    ) {
      rawPriceIdIssues.push({ line: i + 1, text: line.trim() });
    }
  }
  if (rawPriceIdIssues.length > 0) {
    fail(
      "Checkout route accepts raw priceId from client",
      "src/app/api/checkout/route.ts",
      rawPriceIdIssues.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
    );
  } else {
    pass("Checkout route does not accept raw priceId from client");
  }
}

// 3. No hardcoded Stripe checkout URL in monetization files
const monetizationFiles = [
  "src/sectorcalc/monetization/monetization-registry.ts",
  "src/sectorcalc/monetization/monetization-types.ts",
  "src/sectorcalc/monetization/build-premium-hook.ts",
  "src/sectorcalc/monetization/server-impact-engine.ts",
  "src/sectorcalc/monetization/price-lookup.server.ts",
];
let stripeUrlCheckPassed = true;
for (const file of monetizationFiles) {
  const filePath = join(ROOT, file);
  const stripeUrlMatches = scanFile(
    filePath,
    /checkout\.stripe\.com/,
    `${file} must not contain hardcoded Stripe checkout URL`,
  );
  if (stripeUrlMatches.length > 0) {
    fail(
      "Hardcoded Stripe checkout URL found",
      file,
      stripeUrlMatches.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
    );
    stripeUrlCheckPassed = false;
  }
}
if (stripeUrlCheckPassed) {
  pass("No hardcoded Stripe checkout URLs in monetization files");
}

// 4. Forbidden claims — allow negation context ("not certified")
let claimsCheckPassed = true;
function hasForbiddenClaim(text, pattern, lineIndex, allLines) {
  const matches = text.match(pattern);
  if (!matches) return false;
  // Check if the current or surrounding lines contain negation
  const contextLines = [];
  for (let di = -1; di <= 0; di++) {
    const idx = lineIndex + di;
    if (idx >= 0 && idx < allLines.length) {
      contextLines.push(allLines[idx]);
    }
  }
  const context = contextLines.join(" ").toLowerCase();
  if (/not\s+a\s+(certified|approved)/i.test(context)) return false;
  return true;
}
for (const file of monetizationFiles) {
  const filePath = join(ROOT, file);
  if (!existsSync(filePath)) continue;
  const content = readFileOrNull(filePath);
  if (!content) continue;
  const lines = content.split("\n");
  const forbidden = [
    /official declaration/i,
    /compliant declaration/i,
    /\bcertified\b/i,
    /\bapproved\b/i,
    /\bguaranteed\b/i,
    /legal proof/i,
  ];
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of forbidden) {
      if (hasForbiddenClaim(lines[i], pattern, i, lines)) {
        fail(
          `Forbidden claim found: ${pattern.source}`,
          file,
          `Line ${i + 1}: ${lines[i].trim()}`,
        );
        claimsCheckPassed = false;
      }
    }
  }
}
if (claimsCheckPassed) {
  pass("No forbidden claims in monetization files");
}

// 5. Carbon price default
const impactEnginePath = join(ROOT, "src/sectorcalc/monetization/server-impact-engine.ts");
const carbonDefaultMatches = scanFile(
  impactEnginePath,
  /\bcarbonPrice\s*\?\?|assumed_carbon_price_eur.*\?\?/,
  "No default carbon price allowed",
);
if (carbonDefaultMatches.length > 0) {
  fail(
    "Carbon price default detected",
    "src/sectorcalc/monetization/server-impact-engine.ts",
    carbonDefaultMatches.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
  );
} else {
  pass("No hidden carbon price default");
}

// 6. req.nextUrl.origin in checkout route
const originMatches = scanFile(
  checkoutPath,
  /req\.nextUrl\.origin/,
  "checkout route must not use req.nextUrl.origin",
);
if (originMatches.length > 0) {
  fail(
    "req.nextUrl.origin used in checkout — must use configured app URL",
    "src/app/api/checkout/route.ts",
    originMatches.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
  );
} else {
  pass("Checkout uses configured app URL, not request origin");
}

// 7. process.env.STRIPE_SECRET_KEY! (non-null assertion)
const secretAssertMatches = scanFile(
  checkoutPath,
  /STRIPE_SECRET_KEY!/,
  "process.env.STRIPE_SECRET_KEY non-null assertion is forbidden",
);
if (secretAssertMatches.length > 0) {
  fail(
    "STRIPE_SECRET_KEY non-null assertion",
    "src/app/api/checkout/route.ts",
    secretAssertMatches.map((m) => `Line ${m.line}: ${m.text}`).join("; "),
  );
}
if (secretAssertMatches.length === 0) {
  pass("No STRIPE_SECRET_KEY! non-null assertion");
}

// 8. eval and new Function
let evalCheckPassed = true;
for (const dir of ["src/app/api/checkout", "src/sectorcalc/monetization"]) {
  const checkDir = join(ROOT, dir);
  if (!existsSync(checkDir)) continue;
  const entries = readdirRecursive(checkDir);
  for (const entry of entries) {
    if (!entry.endsWith(".ts") && !entry.endsWith(".tsx")) continue;
    const content = readFileOrNull(entry);
    if (!content) continue;
    const evalMatches = content.match(/\beval\s*\(/g);
    if (evalMatches) {
      fail(
        "eval() usage is forbidden",
        relative(ROOT, entry),
        `Found ${evalMatches.length} eval() calls`,
      );
      evalCheckPassed = false;
    }
    const fnMatches = content.match(/new\s+Function\s*\(/g);
    if (fnMatches) {
      fail(
        "new Function() usage is forbidden",
        relative(ROOT, entry),
        `Found ${fnMatches.length} new Function() calls`,
      );
      evalCheckPassed = false;
    }
  }
}
if (evalCheckPassed) {
  pass("No eval or new Function in monetization code");
}

// 9. No `any` type in monetization or checkout code
let anyCheckPassed = true;
for (const dir of ["src/app/api/checkout", "src/sectorcalc/monetization"]) {
  const checkDir = join(ROOT, dir);
  if (!existsSync(checkDir)) continue;
  const entries = readdirRecursive(checkDir);
  for (const entry of entries) {
    if (!entry.endsWith(".ts") && !entry.endsWith(".tsx")) continue;
    const content = readFileOrNull(entry);
    if (!content) continue;
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("//")) continue;
      if (/:\s*any\b|\bas\s+any\b|<\s*any\s*>/.test(line)) {
        fail(
          "TypeScript `any` is forbidden",
          relative(ROOT, entry),
          `Line ${i + 1}: ${line.trim()}`,
        );
        anyCheckPassed = false;
      }
    }
  }
}
if (anyCheckPassed) {
  pass("No TypeScript `any` in monetization code");
}

// 10. Public client imports of server-only modules
const forbiddenServerImports = [
  "server-impact-engine",
  "price-lookup.server",
];
const clientFilesToScan = [
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/sectorcalc/pro-form/contract-types.ts",
  "src/sectorcalc/pro-form/form-state-machine.ts",
];
let clientImportCheckPassed = true;
for (const moduleName of forbiddenServerImports) {
  for (const clientFile of clientFilesToScan) {
    const filePath = join(ROOT, clientFile);
    const content = readFileOrNull(filePath);
    if (!content) continue;
    if (content.includes(moduleName)) {
      fail(
        `Client file must not import server-only module ${moduleName}`,
        clientFile,
        `Direct import of ${moduleName} found in client code`,
      );
      clientImportCheckPassed = false;
    }
  }
}
if (clientImportCheckPassed) {
  pass("No client imports of server-only modules");
}

// ── Summary ──
console.log("\n=== V5.3.1 Monetization Safety Guard ===");
for (const r of results) {
  const icon = r.status === "PASS" ? "\u2713" : "\u2717";
  console.log(`  ${icon} ${r.reason}`);
  if (r.file) {
    console.log(`      file: ${r.file}`);
  }
  if (r.detail) {
    console.log(`      detail: ${r.detail}`);
  }
}
console.log(`\nResult: ${exitCode === 0 ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"}`);
process.exit(exitCode);
