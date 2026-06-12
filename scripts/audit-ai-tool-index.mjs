#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
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
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

const indexPath = join(ROOT, "public/ai-tool-index.json");
if (!existsSync(indexPath)) {
  fail("public/ai-tool-index.json missing — run npm run export:ai-index");
} else {
  const data = readPublicAiToolIndex(ROOT);
  pass("ai-tool-index.json exists");

  for (const issue of auditAiToolIndexDocument(data)) {
    fail(issue);
  }
  if (auditAiToolIndexDocument(data).length === 0) {
    pass(`totalTools matches tools.length (${data.totalTools})`);
    pass("categories.length === 20");
    pass("all tools have canonicalUrl");
    pass("all tools have categorySlug");
    pass("all tools have routeStatus");
  }

  const active = data.tools.filter((tool) => tool.routeStatus === "active-route").length;
  const categoryOnly = data.tools.filter((tool) => tool.routeStatus === "category-only").length;
  const redirected = data.tools.filter((tool) => tool.routeStatus === "redirected").length;

  if (data.totalActiveRoutes === active) pass(`totalActiveRoutes=${active}`);
  else fail(`totalActiveRoutes mismatch (${data.totalActiveRoutes} vs ${active})`);

  if (data.totalCategoryOnly === categoryOnly) pass(`totalCategoryOnly=${categoryOnly}`);
  else fail(`totalCategoryOnly mismatch (${data.totalCategoryOnly} vs ${categoryOnly})`);

  if (data.totalRedirected === redirected) pass(`totalRedirected=${redirected}`);
  else fail(`totalRedirected mismatch (${data.totalRedirected} vs ${redirected})`);

  const categoryOnlyBad = data.tools.filter(
    (tool) => tool.routeStatus === "category-only" && !String(tool.canonicalUrl).includes("#tool-"),
  );
  if (categoryOnlyBad.length === 0) pass("category-only tools use category anchor canonicalUrl");
  else fail(`${categoryOnlyBad.length} category-only tools missing anchor canonicalUrl`);

  const slugSet = new Set();
  let duplicateSlug = false;
  for (const tool of data.tools) {
    if (slugSet.has(tool.slug)) duplicateSlug = true;
    slugSet.add(tool.slug);
  }
  if (!duplicateSlug) pass("no duplicate slug in ai-tool-index");
  else fail("duplicate slug found in ai-tool-index");
}

const llms = readPublicLlmsTxt(ROOT);
const llmsIssues = auditLlmsTxtContent(llms);
for (const issue of llmsIssues) {
  fail(issue);
}
if (llmsIssues.length === 0) {
  pass("llms.txt passes P38 emergency gate patterns");
}

const migrationIssues = auditEmergencyGateMigratedSlugs(ROOT);
for (const issue of migrationIssues) {
  fail(issue);
}
if (migrationIssues.length === 0) {
  pass("P36-REV2 migrated sample slugs absent from free indexes");
}

console.log(`\naudit:ai-tool-index — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
