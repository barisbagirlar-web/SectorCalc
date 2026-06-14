#!/usr/bin/env node
/**
 * DeepSeek schema scan for regeneration slugs (premium-slugs.json + free-slugs.json).
 * Does not modify existing app code — only writes generated/schemas/*.json.
 *
 * Usage:
 *   node scripts/generate-fresh-schemas.js
 *   node scripts/generate-fresh-schemas.js --limit 5
 *   node scripts/generate-fresh-schemas.js --dry-run
 *   node scripts/generate-fresh-schemas.js --slug welding-cost-estimator
 */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PREMIUM_SLUGS_PATH = path.join(PROJECT_ROOT, "premium-slugs.json");
const FREE_SLUGS_PATH = path.join(PROJECT_ROOT, "free-slugs.json");

function readSlugList(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing slug list: ${filePath}`);
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${filePath}`);
  }
  return parsed.filter((entry) => typeof entry === "string" && entry.length > 0);
}

function parseArgs(argv) {
  let limit = null;
  let slug = null;
  let dryRun = false;
  let skipExisting = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--no-skip-existing") {
      skipExisting = false;
      continue;
    }
    if (arg === "--limit") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("--limit requires a number");
      }
      limit = Number(next);
      index += 1;
      continue;
    }
    if (arg === "--slug") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("--slug requires a value");
      }
      slug = next.trim();
      index += 1;
      continue;
    }
  }

  return { limit, slug, dryRun, skipExisting };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const premiumSlugs = readSlugList(PREMIUM_SLUGS_PATH);
  const freeSlugs = readSlugList(FREE_SLUGS_PATH);
  const allSlugs = [...new Set([...premiumSlugs, ...freeSlugs])].sort((a, b) =>
    a.localeCompare(b),
  );

  let selected = allSlugs;
  if (options.slug) {
    if (!allSlugs.includes(options.slug)) {
      throw new Error(`Slug not in premium-slugs.json / free-slugs.json: ${options.slug}`);
    }
    selected = [options.slug];
  } else if (options.limit !== null && Number.isFinite(options.limit)) {
    selected = allSlugs.slice(0, options.limit);
  }

  console.log(
    `Regeneration slug universe: ${allSlugs.length} (${premiumSlugs.length} premium, ${freeSlugs.length} free)`,
  );
  console.log(`Selected for scan: ${selected.length}`);
  console.log(`skipExisting=${options.skipExisting}, dryRun=${options.dryRun}`);

  if (options.dryRun) {
    for (const entry of selected) {
      console.log(`- ${entry}`);
    }
    return;
  }

  fs.mkdirSync(path.join(PROJECT_ROOT, "generated", "schemas"), { recursive: true });

  let failed = 0;
  for (let index = 0; index < selected.length; index += 1) {
    const entry = selected[index];
    console.log(`\n[${index + 1}/${selected.length}] ${entry}`);
    const skipFlag = options.skipExisting ? "--skip-existing" : "";
    try {
      execSync(
        `npx tsx scripts/deepseek/scan-tools.ts --slug ${entry} ${skipFlag} --parallel=1 --retry=3 --output=generated/schemas`,
        {
          cwd: PROJECT_ROOT,
          stdio: "inherit",
          env: process.env,
        },
      );
    } catch {
      failed += 1;
      console.error(`FAILED: ${entry}`);
    }
  }

  console.log(`\nDone. Failed: ${failed}/${selected.length}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
