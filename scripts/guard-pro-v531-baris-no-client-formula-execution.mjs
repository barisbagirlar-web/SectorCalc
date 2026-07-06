#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const FORMULA_DIR = "src/sectorcalc/formulas/pro-v531";
const FORMULA_DIR_ABS = path.join(ROOT, FORMULA_DIR);
const PRO_RUNTIME_DIR = "src/sectorcalc/pro-runtime";
const CLIENT_SCAN_DIRS = ["src/app", "src/components"];

let violations = 0;
let totalChecks = 0;

function fail(msg) {
  console.error(`❌ FAIL: ${msg}`);
  violations++;
}

function pass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

function check(condition, msg) {
  totalChecks++;
  if (!condition) {
    fail(msg);
  } else {
    pass(msg);
  }
}

// ---------------------------------------------------------------------------
// CHECK 1: Scan src/ for any file that imports from pro-v531 formula dir.
//          Files in pro-v531 itself are excluded (self-imports).
//          Each importing file must be server-only (import "server-only"
//          present OR be under src/app/api/ which is server-side Next.js).
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 1] Files importing from pro-v531 formula directory must be server-only...");

function grepImportsFromProV531(dir, pattern) {
  const fileList = [];
  if (!fs.existsSync(dir)) return fileList;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".next", "out", "dist", "coverage", ".git", ".firebase"].includes(entry.name)) {
        fileList.push(...grepImportsFromProV531(fullPath, pattern));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (pattern.test(content)) {
          fileList.push(fullPath);
        }
      }
    }
  }
  return fileList;
}

// Precise regex: import ... from ".../formulas/pro-v531/<file>"
const importPattern = /from\s+['"].*?formulas\/pro-v531\//;
const importingFiles = grepImportsFromProV531(
  path.join(ROOT, "src"),
  importPattern
).filter((fp) => !fp.startsWith(FORMULA_DIR_ABS));

totalChecks++;
if (importingFiles.length === 0) {
  pass("No files outside pro-v531 import from pro-v531 formula directory");
} else {
  let serverOnlyMissing = [];
  for (const fp of importingFiles) {
    const rel = path.relative(ROOT, fp);
    const isApiRoute = rel.startsWith("src/app/api/");
    const content = fs.readFileSync(fp, "utf-8");
    const hasServerOnly = content.includes('server-only');
    if (!hasServerOnly && !isApiRoute) {
      serverOnlyMissing.push(rel);
    }
  }
  if (serverOnlyMissing.length > 0) {
    for (const f of serverOnlyMissing) {
      fail(`${f} imports from pro-v531 but is missing "server-only" and is not an API route`);
    }
  } else {
    pass(
      `All ${importingFiles.length} file(s) importing from pro-v531 are server-only (API route or server-only directive)`
    );
  }
}

// ---------------------------------------------------------------------------
// CHECK 2: Verify pro-v531-formula-registry.ts is NOT in a client-bundled path
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 2] Verifying registry file is in server-only path...");
const registryPath = path.join(ROOT, FORMULA_DIR, "pro-v531-formula-registry.ts");
const registryExists = fs.existsSync(registryPath);
check(registryExists, "pro-v531-formula-registry.ts exists in pro-v531 directory");

if (registryExists) {
  const rel = path.relative(ROOT, registryPath);
  const isInClientPath = CLIENT_SCAN_DIRS.some((cd) => rel.startsWith(cd));
  check(!isInClientPath, "pro-v531-formula-registry.ts is NOT in a client-bundled path");
}

// ---------------------------------------------------------------------------
// CHECK 3: Every .ts file in pro-v531 must contain "server-only" directive
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 3] Checking server-only directive in all pro-v531 formula files...");

totalChecks++;
if (fs.existsSync(FORMULA_DIR_ABS)) {
  const formulaFiles = fs
    .readdirSync(FORMULA_DIR_ABS)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  if (formulaFiles.length === 0) {
    fail("No .ts files found in pro-v531 formula directory");
  } else {
    const missing = [];
    for (const file of formulaFiles) {
      const content = fs.readFileSync(path.join(FORMULA_DIR_ABS, file), "utf-8");
      if (
        !content.includes('server-only')
      ) {
        missing.push(file);
      }
    }
    if (missing.length > 0) {
      for (const f of missing) {
        fail(`${FORMULA_DIR}/${f} is missing "server-only" import directive`);
      }
    } else {
      pass(`All ${formulaFiles.length} pro-v531 formula files contain "server-only"`);
    }
  }
} else {
  fail(`pro-v531 formula directory not found: ${FORMULA_DIR}`);
}

// ---------------------------------------------------------------------------
// CHECK 4 & 5a: rg — no file in src/app or src/components imports from
//               baris formula files directly.
//               Pattern: import ... pro-v531 ... formula
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 5a] rg: imports from pro-v531 formula in client dirs...");
totalChecks++;
try {
  const clientResult = execSync(
    `rg -l "import.*pro-v531.*formula" src/app src/components`,
    { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
  const clientFiles = clientResult.split("\n").filter(Boolean);
  if (clientFiles.length > 0) {
    for (const f of clientFiles) {
      fail(`Client-side import from pro-v531 formula in: ${f.trim()}`);
    }
  } else {
    pass("No client-side imports from pro-v531 formula files (rg check)");
  }
} catch (e) {
  if (e.status === 1) {
    pass("No client-side imports from pro-v531 formula files (rg check)");
  } else {
    fail(`rg command failed: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 5b: rg — pro-v531 formulas must be imported somewhere in the
//            server execution pipeline (pro-runtime or API routes).
//            The pro-runtime is a generic engine; integration may live
//            in API routes that import registry files.
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 5b] rg: pro-v531 formula imports in server execution pipeline...");
totalChecks++;
try {
  const runtimeResult = execSync(
    `rg -l "import.*pro-v531" src/sectorcalc/pro-runtime src/app/api`,
    { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
  const runtimeFiles = runtimeResult.split("\n").filter(Boolean);
  if (runtimeFiles.length > 0) {
    pass(`pro-v531 formulas integrated in execution pipeline (${runtimeFiles.length} file(s))`);
    for (const f of runtimeFiles) {
      console.log(`    - ${f.trim()}`);
    }
  } else {
    fail("No server files import from pro-v531 — integration may be broken");
  }
} catch (e) {
  if (e.status === 1) {
    fail("No server files import from pro-v531 — integration may be broken");
  } else {
    fail(`rg command failed: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 5c: rg — each formula file should have "server-only"
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 5c] rg: server-only directive in each formula file...");
totalChecks++;
if (fs.existsSync(FORMULA_DIR_ABS)) {
  const formulaTsFiles = fs
    .readdirSync(FORMULA_DIR_ABS)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  const missingSo = [];
  for (const file of formulaTsFiles) {
    try {
      const result = execSync(
        `rg "server-only" "${path.join(FORMULA_DIR, file)}"`,
        { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      ).trim();
      if (!result) {
        missingSo.push(file);
      }
    } catch {
      missingSo.push(file);
    }
  }

  if (missingSo.length > 0) {
    for (const f of missingSo) {
      fail(`${FORMULA_DIR}/${f} is missing "server-only" directive (rg check)`);
    }
  } else {
    pass(`All ${formulaTsFiles.length} formula files have "server-only" (rg check)`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 6: pro-v531-formula-registry.ts must import from "server-only"
// ---------------------------------------------------------------------------
console.log("\n🔍 [Check 6] Registry file imports from server-only...");
totalChecks++;
if (registryExists) {
  const registryContent = fs.readFileSync(registryPath, "utf-8");
  if (registryContent.includes('server-only')) {
    pass("pro-v531-formula-registry.ts imports from server-only");
  } else {
    fail("pro-v531-formula-registry.ts is missing import from server-only");
  }
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n${"=".repeat(60)}`);
console.log(`Total checks: ${totalChecks}`);
console.log(`Violations:    ${violations}`);
console.log(`${"=".repeat(60)}`);

if (violations > 0) {
  console.error(
    `\n❌ GUARD FAILED: ${violations} violation(s) found. Baris pro tools have client-side formula execution risk.`
  );
  process.exit(1);
} else {
  console.log(`\n✅ GUARD PASSED: No baris pro tools have client-side formula execution.`);
  process.exit(0);
}
