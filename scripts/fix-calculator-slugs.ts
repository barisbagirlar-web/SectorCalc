#!/usr/bin/env npx tsx
/**
 * Ensures every generated tool schema slug ends with `-calculator`.
 * - Renames schema / generated TS / diagram assets
 * - Merges duplicate short+calculator pairs (keeps -calculator canonical)
 * - Rewrites slug-keyed i18n bundles and message namespaces (6 locales)
 * - Writes config/generated-tool-slug-redirects.json for 301 middleware
 *
 * Usage:
 *   npx tsx scripts/fix-calculator-slugs.ts --dry-run
 *   npx tsx scripts/fix-calculator-slugs.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  CALCULATOR_SLUG_SUFFIX,
  ensureCalculatorSlug,
  isCalculatorSlug,
} from "../src/lib/tools/calculator-slug-policy";

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, "generated", "schemas");
const REDIRECTS_PATH = path.join(ROOT, "config", "generated-tool-slug-redirects.json");
const REPORT_PATH = path.join(ROOT, "scripts", ".cache", "fix-calculator-slugs-report.json");

const MESSAGE_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;
const MESSAGE_SLUG_NAMESPACES = ["freeToolInputs", "freeToolContent", "freeTools"] as const;

const SLUG_KEYED_DATA_FILES = [
  "src/data/generated-tool-titles-i18n.generated.json",
  "src/data/free-tool-inputs-i18n.generated.json",
  "src/data/free-tool-catalog-i18n.generated.json",
  "src/data/roadmap-free-batch1-i18n.generated.json",
  "src/data/roadmap-free-batch2-i18n.generated.json",
  "src/data/schema-catalog-metadata.generated.json",
  "src/data/free-traffic-slug-categories.generated.json",
  "free-slugs.json",
] as const;

type SlugAction =
  | { readonly kind: "skip"; readonly slug: string }
  | { readonly kind: "rename"; readonly from: string; readonly to: string }
  | { readonly kind: "redirect-only"; readonly from: string; readonly to: string };

const dryRun = process.argv.includes("--dry-run");

function listSchemaSlugs(): string[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

function planSlugActions(slugs: readonly string[]): SlugAction[] {
  const slugSet = new Set(slugs);
  const actions: SlugAction[] = [];

  for (const slug of slugs) {
    if (isCalculatorSlug(slug)) {
      actions.push({ kind: "skip", slug });
      continue;
    }

    const target = ensureCalculatorSlug(slug);
    if (slugSet.has(target)) {
      actions.push({ kind: "redirect-only", from: slug, to: target });
      continue;
    }

    actions.push({ kind: "rename", from: slug, to: target });
    slugSet.delete(slug);
    slugSet.add(target);
  }

  return actions;
}

function renameIfExists(fromRel: string, toRel: string): void {
  const from = path.join(ROOT, fromRel);
  const to = path.join(ROOT, toRel);
  if (!fs.existsSync(from)) {
    return;
  }
  if (fs.existsSync(to)) {
    throw new Error(`Refusing to overwrite existing file: ${toRel}`);
  }
  if (dryRun) {
    console.log(`DRY rename ${fromRel} → ${toRel}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

function deleteIfExists(rel: string): void {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    return;
  }
  if (dryRun) {
    console.log(`DRY delete ${rel}`);
    return;
  }
  fs.unlinkSync(abs);
}

function renameSlugArtifacts(from: string, to: string): void {
  renameIfExists(`generated/schemas/${from}-schema.json`, `generated/schemas/${to}-schema.json`);
  renameIfExists(`generated/schemas/${from}-diagram.svg`, `generated/schemas/${to}-diagram.svg`);
  renameIfExists(`generated/${from}.ts`, `generated/${to}.ts`);
  renameIfExists(
    `public/generated/schemas/${from}-diagram.svg`,
    `public/generated/schemas/${to}-diagram.svg`,
  );
}

function removeSlugArtifacts(slug: string): void {
  deleteIfExists(`generated/schemas/${slug}-schema.json`);
  deleteIfExists(`generated/schemas/${slug}-diagram.svg`);
  deleteIfExists(`generated/${slug}.ts`);
  deleteIfExists(`public/generated/schemas/${slug}-diagram.svg`);
}

function updateSchemaToolName(slug: string): void {
  const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  if (!fs.existsSync(schemaPath)) {
    return;
  }
  const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as Record<string, unknown>;
  if (raw.toolName === slug) {
    return;
  }
  raw.toolName = slug;
  if (dryRun) {
    console.log(`DRY schema toolName → ${slug}`);
    return;
  }
  fs.writeFileSync(schemaPath, `${JSON.stringify(raw, null, 2)}\n`);
}

function renameSlugKey(record: Record<string, unknown>, from: string, to: string): void {
  if (!(from in record)) {
    return;
  }
  if (to in record) {
    delete record[from];
    return;
  }
  record[to] = record[from];
  delete record[from];
}

function rewriteSlugKeyedObject(root: Record<string, unknown>, from: string, to: string): void {
  renameSlugKey(root, from, to);
  for (const ns of MESSAGE_SLUG_NAMESPACES) {
    const bucket = root[ns];
    if (bucket && typeof bucket === "object" && !Array.isArray(bucket)) {
      renameSlugKey(bucket as Record<string, unknown>, from, to);
    }
  }
}

function applySlugMapToObject(
  root: Record<string, unknown>,
  renameMap: Readonly<Record<string, string>>,
  removeSlugs: ReadonlySet<string>,
): void {
  for (const [from, to] of Object.entries(renameMap)) {
    rewriteSlugKeyedObject(root, from, to);
  }
  for (const slug of removeSlugs) {
    if (slug in root) {
      delete root[slug];
    }
    for (const ns of MESSAGE_SLUG_NAMESPACES) {
      const bucket = root[ns];
      if (bucket && typeof bucket === "object" && !Array.isArray(bucket) && slug in bucket) {
        delete (bucket as Record<string, unknown>)[slug];
      }
    }
  }
}

function applyBatchSlugKeyUpdates(
  renameMap: Readonly<Record<string, string>>,
  removeSlugs: ReadonlySet<string>,
): void {
  const files = [
    ...SLUG_KEYED_DATA_FILES,
    ...MESSAGE_LOCALES.map((locale) => `messages/${locale}.json`),
  ];

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      continue;
    }
    const parsed = JSON.parse(fs.readFileSync(abs, "utf-8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      continue;
    }
    applySlugMapToObject(parsed as Record<string, unknown>, renameMap, removeSlugs);
    if (dryRun) {
      continue;
    }
    fs.writeFileSync(abs, `${JSON.stringify(parsed, null, 2)}\n`);
  }
}

function loadExistingRedirects(): Record<string, string> {
  if (!fs.existsSync(REDIRECTS_PATH)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(REDIRECTS_PATH, "utf-8")) as Record<string, string>;
}

function writeRedirects(redirects: Record<string, string>): void {
  const sorted = Object.fromEntries(
    Object.entries(redirects).sort(([a], [b]) => a.localeCompare(b)),
  );
  if (dryRun) {
    console.log(`DRY write redirects (${Object.keys(sorted).length} entries)`);
    return;
  }
  fs.mkdirSync(path.dirname(REDIRECTS_PATH), { recursive: true });
  fs.writeFileSync(REDIRECTS_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}

function writeReport(report: Record<string, unknown>): void {
  if (dryRun) {
    return;
  }
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
}

function runMigrationPass(): {
  readonly renamed: number;
  readonly deduped: number;
  readonly skipped: number;
  readonly redirects: number;
  readonly remaining: string[];
} {
  const slugs = listSchemaSlugs();
  const actions = planSlugActions(slugs);
  const redirects = loadExistingRedirects();
  const renameMap: Record<string, string> = {};
  const removeSlugs = new Set<string>();

  let renamed = 0;
  let deduped = 0;
  let skipped = 0;

  for (const action of actions) {
    if (action.kind === "skip") {
      skipped += 1;
      continue;
    }

    if (action.kind === "redirect-only") {
      redirects[action.from] = action.to;
      removeSlugArtifacts(action.from);
      removeSlugs.add(action.from);
      deduped += 1;
      console.log(`🔀 redirect ${action.from} → ${action.to} (duplicate removed)`);
      continue;
    }

    renameSlugArtifacts(action.from, action.to);
    updateSchemaToolName(action.to);
    renameMap[action.from] = action.to;
    redirects[action.from] = action.to;
    renamed += 1;
    if (renamed <= 5 || renamed % 100 === 0) {
      console.log(`🔄 rename ${action.from} → ${action.to}`);
    }
  }

  if (renamed > 5) {
    console.log(`🔄 ... ${renamed} total renames`);
  }

  applyBatchSlugKeyUpdates(renameMap, removeSlugs);
  writeRedirects(redirects);

  const remaining = listSchemaSlugs().filter((slug) => !isCalculatorSlug(slug));
  return {
    renamed,
    deduped,
    skipped,
    redirects: Object.keys(redirects).length,
    remaining,
  };
}

function main(): void {
  let pass = 0;
  let lastReport: ReturnType<typeof runMigrationPass> | null = null;

  while (pass < 5) {
    pass += 1;
    lastReport = runMigrationPass();
    if (lastReport.remaining.length === 0) {
      break;
    }
    console.warn(
      `⚠️ pass ${pass}: ${lastReport.remaining.length} slug(s) still missing ${CALCULATOR_SLUG_SUFFIX}; retrying…`,
    );
  }

  const report = {
    dryRun,
    passes: pass,
    ...lastReport,
  };

  writeReport(report);

  console.log("\n✅ fix-calculator-slugs summary");
  console.log(JSON.stringify(report, null, 2));

  if (lastReport && lastReport.remaining.length > 0) {
    console.error(`❌ ${lastReport.remaining.length} slug(s) still missing ${CALCULATOR_SLUG_SUFFIX}`);
    process.exit(1);
  }
}

main();
