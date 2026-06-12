#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;

function run(label, cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    console.log(`PASS: ${label}`);
  } catch {
    failures += 1;
    console.error(`FAIL: ${label}`);
  }
}

const requiredPublic = [
  "llms.txt",
  "ai.txt",
  "ai-tool-index.json",
  "ai-categories.json",
  "ai-tool-routes.json",
  "ai-search-manifest.json",
  "ai-embedding-source.jsonl",
];

for (const file of requiredPublic) {
  if (existsSync(join(ROOT, "public", file))) {
    console.log(`PASS: public/${file} exists`);
  } else {
    failures += 1;
    console.error(`FAIL: public/${file} missing`);
  }
}

const llms = readFileSync(join(ROOT, "public/llms.txt"), "utf8");
for (const token of [
  "Full tool index",
  "/ai-tool-index.json",
  "categorySlug",
  "keywords",
  "intent",
  "Prefer canonicalUrl",
]) {
  if (llms.includes(token)) console.log(`PASS: llms.txt includes ${token}`);
  else {
    failures += 1;
    console.error(`FAIL: llms.txt missing ${token}`);
  }
}

const manifest = JSON.parse(readFileSync(join(ROOT, "public/ai-search-manifest.json"), "utf8"));
if (manifest.rankingWeights?.exactSlug === 100) {
  console.log("PASS: ai-search-manifest rankingWeights present");
} else {
  failures += 1;
  console.error("FAIL: ai-search-manifest rankingWeights missing");
}

if (manifest.embeddingSimilarity?.enabled === false) {
  console.log("PASS: embeddingSimilarity reserved/disabled");
} else {
  failures += 1;
  console.error("FAIL: embeddingSimilarity must be disabled");
}

run("audit:ai-tool-index", "node scripts/audit-ai-tool-index.mjs");
run("audit:ai-crawler-policy", "node scripts/audit-ai-crawler-policy.mjs");
run("audit:embedding-source", "node scripts/audit-embedding-source.mjs");
run("audit:semantic-jsonld", "node scripts/audit-semantic-jsonld.mjs");

try {
  execSync(
    `npx tsx -e "import { searchSectorCalcTools } from './src/lib/ai/search-tools.ts'; const results = searchSectorCalcTools('oee', 'tr', { limit: 5 }); if (!results.length) throw new Error('no results'); console.log(JSON.stringify({ count: results.length, top: results[0]?.slug }));"`,
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  console.log("PASS: locale-aware searchSectorCalcTools returns results");
} catch (error) {
  failures += 1;
  console.error(`FAIL: locale-aware search — ${String(error.stderr ?? error.message ?? error)}`);
}

const forbidden = ["href=\"#\"", "Faz 1", "Faz 2", "Puan", "Planlandı", "Yayında", "Stratejik yol haritası"];
for (const token of forbidden) {
  const hits = execSync(
    `rg -n ${JSON.stringify(token)} src/app src/components public --glob '!**/*.test.*' || true`,
    { cwd: ROOT, encoding: "utf8" },
  ).trim();
  if (hits) {
    failures += 1;
    console.error(`FAIL: forbidden public term found: ${token}`);
  } else {
    console.log(`PASS: forbidden term absent in public surface: ${token}`);
  }
}

const calculateActionTypeHits = execSync(
  `rg -n '"@type": "CalculateAction"|"@type":\\["CalculateAction"|"@type":"CalculateAction"' src/lib/semantic public || true`,
  { cwd: ROOT, encoding: "utf8" },
).trim();
if (calculateActionTypeHits) {
  failures += 1;
  console.error("FAIL: CalculateAction used as @type");
} else {
  console.log("PASS: CalculateAction not used as @type");
}

console.log(`\naudit:llm-seo — ${failures} failed gate(s)`);
process.exit(failures > 0 ? 1 : 0);
