#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

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
  const data = JSON.parse(readFileSync(indexPath, "utf8"));
  pass("ai-tool-index.json exists");

  if (data.totalTools === data.tools?.length) {
    pass(`totalTools matches tools.length (${data.totalTools})`);
  } else {
    fail(`totalTools mismatch (${data.totalTools} vs ${data.tools?.length ?? 0})`);
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

  if (data.categories?.length === 20) pass("categories.length === 20");
  else fail(`categories.length expected 20, got ${data.categories?.length ?? 0}`);

  const missingCanonical = data.tools.filter((tool) => !tool.canonicalUrl);
  if (missingCanonical.length === 0) pass("all tools have canonicalUrl");
  else fail(`${missingCanonical.length} tools missing canonicalUrl`);

  const missingCategory = data.tools.filter((tool) => !tool.categorySlug);
  if (missingCategory.length === 0) pass("all tools have categorySlug");
  else fail(`${missingCategory.length} tools missing categorySlug`);

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

  const hardcoded = readFileSync(join(ROOT, "public/llms.txt"), "utf8");
  for (const token of ["280+", "300+", "352+", "280 +", "300 +"]) {
    if (hardcoded.includes(token)) fail(`hardcoded tool count copy found: ${token}`);
  }
  pass("no hardcoded total tools copy in llms.txt");
}

console.log(`\naudit:ai-tool-index — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
