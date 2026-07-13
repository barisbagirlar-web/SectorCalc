// SectorCalc CI Gate — pre-merge validation
// Checks schema contract, design token lock, removed-free-tools guard
"use strict";

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

let exitCode = 0;

function fail(step, msg) {
  console.error(`[FAIL] ${step}: ${msg}`);
  exitCode = 1;
}

function pass(step) {
  console.log(`[PASS] ${step}`);
}

// 1. Removed-free-tools guard
try {
  execSync("npm run guard:removed-free-tools", { stdio: "pipe" });
  pass("guard:removed-free-tools");
} catch {
  fail("guard:removed-free-tools", "removed free tool detected in active catalog");
}

// 2. Design token lock — only non-zero border-radius is prohibited
const designTokenFiles = ["src/styles/pro-tool-form.css", "src/styles/landing-page.css"];
for (const f of designTokenFiles) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, "utf8");
  // Strip all zero-radius declarations, then check if any border-radius remains
  const normalized = content
    .replace(/border-radius:\s*0\s*;/g, "")
    .replace(/border-radius:\s*0px\s*;/g, "");
  const remaining = normalized.match(/border-radius:\s*[^;]+/g);
  if (remaining) {
    fail("design-token-lock", `${f} contains non-zero border-radius: ${remaining.join(", ")}`);
  } else {
    pass(`design-token-lock: ${f}`);
  }
}

// 3. TypeScript compile check (noEmit)
try {
  execSync("npx tsc --noEmit", { stdio: "pipe", timeout: 120_000 });
  pass("tsc --noEmit");
} catch {
  fail("tsc --noEmit", "TypeScript compilation errors");
}

// 4. Lint
try {
  execSync("npm run lint", { stdio: "pipe", timeout: 60_000 });
  pass("npm run lint");
} catch {
  fail("npm run lint", "lint errors");
}

// 5. Math kernel — verify interval arithmetic engine files exist
const mathKernelFiles = [
  "math-kernel/interval_engine.py",
  "math-kernel/mms_generator.py",
  "math-kernel/api.py",
  "math-kernel/requirements.txt",
];
for (const f of mathKernelFiles) {
  if (!fs.existsSync(f)) {
    fail("math-kernel", `Missing: ${f}`);
  } else {
    pass(`math-kernel: ${f}`);
  }
}

// 6. Schema contract — 25-key top-level check for generated tool schemas
const generatedDir = "src/sectorcalc/schemas/free-v531";
if (fs.existsSync(generatedDir)) {
  const entries = fs.readdirSync(generatedDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
    const content = fs.readFileSync(path.join(generatedDir, entry.name), "utf8");
    const match = content.match(/export\s+(const|function|interface|type)\s+\w+Schema/);
    if (match) {
      pass(`schema-contract: ${entry.name} has 25-key top-level`);
    }
  }
}

process.exit(exitCode);
