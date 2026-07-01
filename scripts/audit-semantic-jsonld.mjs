#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const failures = [];

const required = [
  "src/lib/features/semantic/site-url.ts",
  "src/lib/features/semantic/schema-types.ts",
  "src/lib/features/semantic/tool-semantic-types.ts",
  "src/lib/features/semantic/tool-semantic-registry.ts",
  "src/lib/features/semantic/semantic-tool-reader.ts",
  "src/lib/features/semantic/build-organization-schema.ts",
  "src/lib/features/semantic/build-website-schema.ts",
  "src/lib/features/semantic/build-software-application-schema.ts",
  "src/lib/features/semantic/build-financial-service-schema.ts",
  "src/lib/features/semantic/build-calculate-action-schema.ts",
  "src/lib/features/semantic/build-tool-jsonld.ts",
  "src/lib/features/semantic/build-home-jsonld.ts",
  "src/lib/features/semantic/build-developer-showcase-schema.ts",
  "src/lib/features/semantic/build-ai-tool-index.ts",
  "src/lib/features/semantic/semantic-jsonld-audit.ts",
  "src/components/semantic/SemanticJsonLd.tsx",
  "src/app/developer-showcase/page.tsx",
  "public/ai.txt",
  "public/llms.txt",
  "scripts/export-ai-index.mjs",
  "scripts/export-tool-embeddings-source.mjs",
  "scripts/audit-llm-seo.mjs",
  "scripts/audit-ai-tool-index.mjs",
  "scripts/audit-ai-crawler-policy.mjs",
  "scripts/audit-embedding-source.mjs",
  "public/ai-categories.json",
  "public/ai-tool-routes.json",
  "public/ai-search-manifest.json",
  "public/ai-embedding-source.jsonl",
];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) {
    failures.push(`missing ${rel}`);
  }
}

const siteConfig = readFileSync(join(ROOT, "src/config/site.ts"), "utf8");
if (!siteConfig.includes('const DEFAULT_SITE_URL = "https://sectorcalc.com"')) {
  failures.push("DEFAULT_SITE_URL is not https://sectorcalc.com");
}
const siteUrlModule = readFileSync(join(ROOT, "src/lib/features/semantic/site-url.ts"), "utf8");
if (!siteUrlModule.includes('import { siteUrl } from "@/config/site"')) {
  failures.push("SITE_URL must re-export siteUrl from src/config/site.ts");
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
  "src/app/[locale]/tools/generated/[slug]/page.tsx",
  "src/app/[locale]/tools/premium/[slug]/page.tsx",
  "src/app/[locale]/tools/premium-schema/[slug]/page.tsx",
]) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  if (!text.includes("build") || !text.includes("JsonLd")) {
    failures.push(`${rel} missing automatic tool JSON-LD wiring`);
  }
}

const robotsPath = join(ROOT, "src/lib/infrastructure/seo/seo-indexing-control.ts");
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf8");
  for (const token of ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "Google-Extended", "ClaudeBot", "PerplexityBot", "Googlebot", "Bingbot", "verification-queue", "sitemap"]) {
    if (!robots.includes(token)) {
      failures.push(`robots.txt missing ${token} policy`);
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
  failures.push("public/ai-tool-index.json missing — run npm run export:ai-index");
}

try {
  const output = execSync(
    `npx tsx -e "import { auditSemanticJsonLdCoverage } from './src/lib/features/semantic/semantic-jsonld-audit.ts'; const r = auditSemanticJsonLdCoverage(); if (r.issues.length) { console.error(r.issues.slice(0, 20).join('\\n')); process.exit(1);} console.log(JSON.stringify(r.stats));"`,
    { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
  console.log("coverage", output.trim());
} catch (error) {
  const stderr = error instanceof Error && "stderr" in error ? String(error.stderr ?? "") : "";
  failures.push(`semantic contract coverage failed${stderr ? `: ${stderr.trim().slice(0, 400)}` : ""}`);
}

const forbidden = ["example.com", "localhost", "your-domain", "TODO"];
for (const rel of [
  "src/lib/features/semantic/build-calculate-action-schema.ts",
  "src/lib/features/semantic/build-tool-jsonld.ts",
  "src/lib/features/semantic/build-home-jsonld.ts",
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
