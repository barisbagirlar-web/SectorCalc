#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/semantic/site-url.ts",
  "src/lib/semantic/schema-types.ts",
  "src/lib/semantic/tool-semantic-types.ts",
  "src/lib/semantic/tool-semantic-registry.ts",
  "src/lib/semantic/semantic-tool-reader.ts",
  "src/lib/semantic/build-organization-schema.ts",
  "src/lib/semantic/build-website-schema.ts",
  "src/lib/semantic/build-software-application-schema.ts",
  "src/lib/semantic/build-financial-service-schema.ts",
  "src/lib/semantic/build-calculate-action-schema.ts",
  "src/lib/semantic/build-tool-jsonld.ts",
  "src/lib/semantic/build-home-jsonld.ts",
  "src/lib/semantic/build-developer-showcase-schema.ts",
  "src/lib/semantic/build-ai-tool-index.ts",
  "src/lib/semantic/semantic-jsonld-audit.ts",
  "src/components/semantic/SemanticJsonLd.tsx",
  "src/app/[locale]/developer-showcase/page.tsx",
  "public/ai.txt",
  "public/llms.txt",
  "scripts/export-ai-tool-index.mjs",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const siteUrl = readFileSync(join(ROOT, "src/lib/semantic/site-url.ts"), "utf8");
if (!siteUrl.includes('export const SITE_URL = "https://www.sectorcalc.com"')) {
  failures.push("SITE_URL is not https://www.sectorcalc.com");
}

const semanticJsonLd = readFileSync(join(ROOT, "src/components/semantic/SemanticJsonLd.tsx"), "utf8");
if (!semanticJsonLd.includes("application/ld+json") || !semanticJsonLd.includes("JSON.stringify")) {
  failures.push("SemanticJsonLd component missing safe JSON-LD rendering");
}

const home = readFileSync(join(ROOT, "src/app/[locale]/page.tsx"), "utf8");
if (!home.includes("buildHomeJsonLd")) {
  failures.push("home page missing buildHomeJsonLd");
}

for (const rel of [
  "src/app/[locale]/tools/free/[slug]/page.tsx",
  "src/app/[locale]/tools/premium/[slug]/page.tsx",
  "src/app/[locale]/tools/premium-schema/[slug]/page.tsx",
]) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  if (!text.includes("buildToolJsonLd") || !text.includes("SemanticJsonLd")) {
    failures.push(`${rel} missing automatic tool JSON-LD wiring`);
  }
}

const robotsPath = join(ROOT, "src/app/robots.ts");
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf8");
  for (const token of ["GPTBot", "Google-Extended", "ClaudeBot", "PerplexityBot", "verification-queue", "sitemap"]) {
    if (!robots.includes(token)) {
      failures.push(`robots.ts missing ${token} policy`);
    }
  }
} else if (!existsSync(join(ROOT, "public/robots.txt"))) {
  failures.push("robots policy file missing");
}

const aiTxt = readFileSync(join(ROOT, "public/ai.txt"), "utf8");
for (const token of ["llms.txt", "developer-showcase", "verification queue", "admin routes"]) {
  if (!aiTxt.toLowerCase().includes(token.replace(/ /g, " ").toLowerCase())) {
    if (token === "verification queue" && !/verification.?queue/i.test(aiTxt)) {
      failures.push("ai.txt missing verification queue policy");
    } else if (token !== "verification queue" && !aiTxt.includes(token)) {
      failures.push(`ai.txt missing ${token}`);
    }
  }
}

if (!existsSync(join(ROOT, "public/ai-tool-index.json"))) {
  failures.push("public/ai-tool-index.json missing — run npm run export:ai-tool-index");
}

try {
  const output = execSync(
    `npx tsx -e "import { auditSemanticJsonLdCoverage } from './src/lib/semantic/semantic-jsonld-audit.ts'; const r = auditSemanticJsonLdCoverage(); if (r.issues.length) { console.error(r.issues.slice(0, 20).join('\\n')); process.exit(1);} console.log(JSON.stringify(r.stats));"`,
    { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
  console.log("coverage", output.trim());
} catch (error) {
  const stderr = error instanceof Error && "stderr" in error ? String(error.stderr ?? "") : "";
  failures.push(`semantic contract coverage failed${stderr ? `: ${stderr.trim().slice(0, 400)}` : ""}`);
}

const forbidden = ["example.com", "localhost", "your-domain", "TODO"];
for (const rel of [
  "src/lib/semantic/build-calculate-action-schema.ts",
  "src/lib/semantic/build-tool-jsonld.ts",
  "src/lib/semantic/build-home-jsonld.ts",
  "public/ai.txt",
]) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      failures.push(`${rel} contains forbidden placeholder ${token}`);
    }
  }
}

if (process.env.POST_BUILD === "1") {
  const samplePaths = [
    join(ROOT, ".next/server/app/en.html"),
    join(ROOT, ".next/server/app/tr.html"),
  ];
  const hasBuiltHtml = samplePaths.some((path) => existsSync(path));
  if (hasBuiltHtml) {
    for (const path of samplePaths) {
      if (!existsSync(path)) continue;
      const html = readFileSync(path, "utf8");
      if (!html.includes("application/ld+json")) {
        failures.push(`rendered HTML missing JSON-LD: ${path}`);
      }
    }
  }
}

console.log("audit:semantic-jsonld");
if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("PASS — auto semantic JSON-LD + AI tool index integration");
process.exit(0);
