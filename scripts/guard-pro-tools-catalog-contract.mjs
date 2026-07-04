#!/usr/bin/env node

/**
 * Guard: PRO Tools Catalog Contract
 * Ensures the /pro-tools page source and data pipeline are valid.
 * Must pass before deploy.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CANDIDATE_FILES = [
  "src/app/pro-tools/page.tsx",
  "src/sectorcalc/runtime/pro-schema-loader.ts",
  "src/sectorcalc/runtime/validate-pro-v531-schema.ts",
].filter((file) => existsSync(file));

const failures = [];

if (CANDIDATE_FILES.length === 0) {
  failures.push("No candidate PRO tools catalog files found.");
}

for (const file of CANDIDATE_FILES) {
  const text = readFileSync(file, "utf8");

  // Must not contain forbidden patterns
  const forbidden = [
    "Daily Renovation",
    "Not specified",
    "tools = []",
    "const tools: []",
    "const proTools = []",
  ];

  for (const token of forbidden) {
    if (text.includes(token)) {
      failures.push(`${file}: forbidden PRO catalog pattern: ${token}`);
    }
  }

  // Must not pass event handlers to Link (Server Component violation)
  if (text.includes("onMouseEnter") && text.includes("next/link")) {
    failures.push(`${file}: onMouseEnter/onMouseLeave on next/link Link from Server Component — use CSS hover instead`);
  }
}

// Also check the standalone build output for data attributes
const standalonePage = join(process.cwd(), ".next/server/app/pro-tools/page.js");
if (existsSync(standalonePage)) {
  const compiled = readFileSync(standalonePage, "utf8");

  if (!compiled.includes("data-pro-tools-count")) {
    failures.push("Compiled pro-tools page is missing data-pro-tools-count attribute — guard/smoke markers absent");
  }
  if (!compiled.includes("data-pro-category-count")) {
    failures.push("Compiled pro-tools page is missing data-pro-category-count attribute — guard/smoke markers absent");
  }
}

if (failures.length > 0) {
  console.error("PRO_TOOLS_CATALOG_CONTRACT_GUARD=FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PRO_TOOLS_CATALOG_CONTRACT_GUARD=PASS");
console.log(`checked_files=${CANDIDATE_FILES.length}`);
