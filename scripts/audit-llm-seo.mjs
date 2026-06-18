#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  auditAiToolIndexDocument,
  auditEmergencyGateMigratedSlugs,
  auditLlmsTxtContent,
  readPublicAiToolIndex,
  readPublicLlmsTxt,
} from "./lib/llm-output-gate.mjs";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function run(label, cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    pass(label);
  } catch {
    fail(label);
  }
}

const requiredPublic = [
  "llms.txt",
  "ai-tool-index.json",
  "ai-categories.json",
  "ai-tool-routes.json",
  "ai-search-manifest.json",
  "ai-embedding-source.jsonl",
];

for (const file of requiredPublic) {
  if (existsSync(join(ROOT, "public", file))) {
    pass(`public/${file} exists`);
  } else {
    fail(`public/${file} missing`);
  }
}

const llms = readPublicLlmsTxt(ROOT);
const llmsIssues = auditLlmsTxtContent(llms);
for (const issue of llmsIssues) {
  fail(issue);
}
if (llmsIssues.length === 0) {
  pass("llms.txt passes P38 emergency gate patterns");
}

for (const token of ["Full tool index", "Prefer canonicalUrl", "Tool route guidance"]) {
  if (llms.includes(token)) pass(`llms.txt includes ${token}`);
  else fail(`llms.txt missing ${token}`);
}

const indexData = readPublicAiToolIndex(ROOT);
const indexIssues = auditAiToolIndexDocument(indexData);
for (const issue of indexIssues) {
  fail(issue);
}
if (indexIssues.length === 0) {
  pass("ai-tool-index.json passes canonical index gate");
}

const migrationIssues = auditEmergencyGateMigratedSlugs(ROOT);
for (const issue of migrationIssues) {
  fail(issue);
}
if (migrationIssues.length === 0) {
  pass("P36-REV2 migrated sample slugs absent from free indexes");
}

const manifest = JSON.parse(readFileSync(join(ROOT, "public/ai-search-manifest.json"), "utf8"));
if (manifest.rankingWeights?.exactSlug === 100) {
  pass("ai-search-manifest rankingWeights present");
} else {
  fail("ai-search-manifest rankingWeights missing");
}

if (manifest.embeddingSimilarity?.enabled === false) {
  pass("embeddingSimilarity reserved/disabled");
} else {
  fail("embeddingSimilarity must be disabled");
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
  pass("locale-aware searchSectorCalcTools returns results");
} catch (error) {
  fail(`locale-aware search — ${String(error.stderr ?? error.message ?? error)}`);
}

const forbidden = ["href=\"#\"", "Faz 1", "Faz 2", "Puan", "Planlandı", "Yayında", "Stratejik yol haritası"];
for (const token of forbidden) {
  const hits = execSync(
    `rg -n ${JSON.stringify(token)} src/app src/components public --glob '!**/*.test.*' || true`,
    { cwd: ROOT, encoding: "utf8" },
  ).trim();
  if (hits) {
    fail(`forbidden public term found: ${token}`);
  } else {
    pass(`forbidden term absent in public surface: ${token}`);
  }
}

const calculateActionTypeHits = execSync(
  `rg -n '"@type": "CalculateAction"|"@type":\\["CalculateAction"|"@type":"CalculateAction"' src/lib/semantic public || true`,
  { cwd: ROOT, encoding: "utf8" },
).trim();
if (calculateActionTypeHits) {
  fail("CalculateAction used as @type");
} else {
  pass("CalculateAction not used as @type");
}

console.log(`\naudit:llm-seo — ${failures} failed gate(s)`);
process.exit(failures > 0 ? 1 : 0);
