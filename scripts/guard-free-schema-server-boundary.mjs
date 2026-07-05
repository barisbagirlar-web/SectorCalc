#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET = "free-schema-loader";

const ACTIVE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  "out",
  "dist",
  "build",
  "coverage",
  ".local-free-tools-quarantine",
  "backup",
]);

function toRel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }

    if (!entry.isFile()) continue;

    if (ACTIVE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }

  return out;
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function hasUseClient(source) {
  return /^["']use client["'];?/.test(source.trimStart().slice(0, 500));
}

function importsFreeLoader(source) {
  const clean = stripComments(source);
  return (
    clean.includes("free-schema-loader") &&
    /(?:import|export|require\s*\(|import\s*\()/.test(clean)
  );
}

function isServerRoute(rel) {
  return /^src\/app\/.+\/(?:page|route)\.(?:ts|tsx|js|jsx)$/.test(rel);
}

function isRuntimeModule(rel) {
  return /^src\/sectorcalc\/runtime\/.+\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(rel);
}

function isNodeScript(rel) {
  return /^scripts\/.+\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(rel);
}

function classify(rel, source) {
  if (hasUseClient(source)) return { allowed: false, zone: "client" };
  if (rel.startsWith("src/lib/infrastructure/seo/")) return { allowed: false, zone: "seo" };
  if (rel.startsWith("src/components/")) return { allowed: false, zone: "component" };

  if (isServerRoute(rel)) return { allowed: true, zone: "server route" };
  if (isRuntimeModule(rel)) return { allowed: true, zone: "runtime module" };
  if (isNodeScript(rel)) return { allowed: true, zone: "node script" };

  return { allowed: false, zone: "unknown" };
}

const files = walk(ROOT);
const imports = [];

for (const file of files) {
  const source = read(file);
  if (!source) continue;
  if (!importsFreeLoader(source)) continue;

  const rel = toRel(file);
  imports.push({
    file: rel,
    ...classify(rel, source),
  });
}

const loaderExists = fs.existsSync(path.join(ROOT, "src/sectorcalc/runtime/free-schema-loader.ts"));
const allowed = imports.filter((item) => item.allowed);
const forbidden = imports.filter((item) => !item.allowed);

console.log("═══════════════════════════════════════════════════════");
console.log("  Free Schema Server Boundary Guard");
console.log("═══════════════════════════════════════════════════════");
console.log("");

if (forbidden.length === 0) {
  console.log("  ✅ No imports in shared SEO modules");
  console.log("  ✅ No imports in React components");
  console.log('  ✅ No "use client" files import free-schema-loader');
} else {
  console.log("  ❌ Forbidden imports:");
  for (const item of forbidden) {
    console.log(`     - ${item.file} [${item.zone}]`);
  }
}

console.log("");
console.log("  Verifying allowed import zones...");

for (const zone of ["server route", "runtime module", "node script"]) {
  const items = allowed.filter((item) => item.zone === zone);
  if (items.length === 0) {
    console.log(`  ⚠️  No imports in ${zone}s`);
  } else {
    console.log(`  ✅ ${items.length} import(s) in ${zone}s`);
    for (const item of items) {
      console.log(`     - ${item.file}`);
    }
  }
}

let failureCount = forbidden.length;

if (loaderExists && allowed.length === 0) {
  console.log("");
  console.log("  ❌ free-schema-loader exists but is not imported by any approved server/runtime/script zone.");
  failureCount += 1;
}

if (!loaderExists && imports.length > 0) {
  console.log("");
  console.log("  ❌ free-schema-loader imports exist but the loader file is missing.");
  failureCount += 1;
}

console.log("");
console.log("───────────────────────────────────────────────────────");

if (failureCount > 0) {
  console.log("  ❌ FREE_SCHEMA_SERVER_BOUNDARY=FAIL");
  console.log(`  failure_count=${failureCount}`);
  process.exit(1);
}

console.log("  ✅ FREE_SCHEMA_SERVER_BOUNDARY=PASS");
console.log(`  allowed_imports=${allowed.length}`);
console.log("═══════════════════════════════════════════════════════");
