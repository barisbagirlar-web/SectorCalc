#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/semantic/schema-types.ts",
  "src/lib/semantic/build-calculate-action-schema.ts",
  "src/lib/semantic/build-developer-showcase-schema.ts",
  "src/components/semantic/SemanticJsonLd.tsx",
  "src/app/[locale]/developer-showcase/page.tsx",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) failures.push(`missing ${rel}`);
}

const forbidden = ["example.com", "localhost", "your-domain", "TODO"];
const semanticFiles = [
  "src/lib/semantic/build-calculate-action-schema.ts",
  "src/lib/semantic/build-developer-showcase-schema.ts",
];

for (const rel of semanticFiles) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      failures.push(`${rel} contains forbidden placeholder ${token}`);
    }
  }
}

const home = readFileSync(join(ROOT, "src/app/[locale]/page.tsx"), "utf8");
if (!home.includes("buildWebsiteJsonLd") || !home.includes("buildOrganizationJsonLd")) {
  failures.push("home page missing core JSON-LD builders");
}

const freePage = readFileSync(join(ROOT, "src/app/[locale]/tools/free/[slug]/page.tsx"), "utf8");
if (!freePage.includes("buildCalculateActionSchema")) {
  failures.push("free tool page missing CalculateAction JSON-LD");
}

console.log("audit:semantic-jsonld");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — semantic JSON-LD architecture present");
process.exit(0);
