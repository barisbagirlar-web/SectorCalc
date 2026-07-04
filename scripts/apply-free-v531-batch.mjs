#!/usr/bin/env node
// Batch apply Free V5.3.1 import — creates all architecture files and copies schemas.
// Usage: node scripts/apply-free-v531-batch.mjs <part_number>
// Example: node scripts/apply-free-v531-batch.mjs 1  (copies part_1_001_050)

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

const ROOT = resolve(import.meta.dirname, "..");
const IMPORT_PARTS = {
  1: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_1_001_050",
  2: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_2_051_100",
  3: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_3_101_150",
  4: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_4_151_200",
  5: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_5_201_250",
  6: "sectorcalc_free_tools_superv4_v5_3_1_prompt_compliant_part_6_251_294",
};

function main() {
  const partNum = parseInt(process.argv[2], 10);
  if (!partNum || partNum < 1 || partNum > 6) {
    console.error("Usage: node scripts/apply-free-v531-batch.mjs <1-6>");
    process.exit(1);
  }

  const partDir = join(ROOT, IMPORT_PARTS[partNum]);
  if (!existsSync(partDir)) {
    console.error(`Part directory not found: ${partDir}`);
    process.exit(1);
  }

  // 1. Create directories
  const dirs = [
    "src/sectorcalc/schemas/free-v531",
    "src/sectorcalc/formulas/free-v531",
    "src/app/tools/free/[slug]",
    "src/app/free-tools",
  ];
  for (const d of dirs) {
    const full = join(ROOT, d);
    if (!existsSync(full)) mkdirSync(full, { recursive: true });
  }

  // 2. Copy schemas from the imported part
  const toolsDir = join(partDir, "tools");
  let copied = 0;
  if (existsSync(toolsDir)) {
    const files = readdirSync(toolsDir).filter(f => f.endsWith(".json"));
    for (const f of files) {
      copyFileSync(join(toolsDir, f), join(ROOT, "src/sectorcalc/schemas/free-v531", f));
      copied++;
    }
  }
  console.log(`Copied ${copied} schemas from part ${partNum}`);

  // 3. Create architecture files (only if they don't exist yet)

  // free-schema-loader.ts
  const loaderPath = join(ROOT, "src/sectorcalc/runtime/free-schema-loader.ts");
  if (!existsSync(loaderPath)) {
    writeFileSync(loaderPath, `import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

interface LoadedSchema { schema: SuperV4Schema; errors: string[]; }
let loadedSchemas: Map<string, LoadedSchema> | null = null;
let loadErrors: string[] = [];

function getSchemasDir(): string {
  const cwd = process.cwd();
  const fnBundle = join(cwd, ".next/standalone/src/sectorcalc/schemas/free-v531");
  if (existsSync(fnBundle)) return fnBundle;
  const direct = join(cwd, "src/sectorcalc/schemas/free-v531");
  if (existsSync(direct)) return direct;
  return direct;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map();
  loadErrors = [];
  try {
    const schemasDir = getSchemasDir();
    if (!existsSync(schemasDir)) { loadErrors.push("Free schemas dir not found: " + schemasDir); return; }
    const files = readdirSync(schemasDir).filter((f: string) => f.endsWith(".json")).sort();
    if (files.length === 0) { loadErrors.push("No free schema files"); return; }
    for (const file of files) {
      try {
        const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8")) as SuperV4Schema;
        if (!schema.tool_key) { loadErrors.push("Missing tool_key in " + file); continue; }
        const validation = validateSuperV4Schema(schema);
        if (!validation.ok) { loadErrors.push(schema.tool_key + ": " + validation.errors.join("; ")); continue; }
        if (loadedSchemas.has(schema.tool_key)) { loadErrors.push("Duplicate: " + schema.tool_key); continue; }
        if (validation.schema) loadedSchemas.set(schema.tool_key, { schema: validation.schema, errors: [] });
      } catch (err) {
        loadErrors.push("Error " + file + ": " + (err instanceof Error ? err.message : String(err)));
      }
    }
  } catch (err) {
    loadErrors.push("Init error: " + (err instanceof Error ? err.message : String(err)));
  }
}

export function getFreeToolSchema(toolKey: string): SuperV4Schema | null {
  loadAllSchemas();
  return loadedSchemas?.get(toolKey)?.schema ?? null;
}
export function listFreeToolSchemaSlugs(): string[] {
  loadAllSchemas();
  return loadedSchemas ? [...loadedSchemas.keys()].sort() : [];
}
export function getAllFreeToolSchemas(): Array<{ toolKey: string; schema: SuperV4Schema }> {
  loadAllSchemas();
  if (!loadedSchemas) return [];
  return [...loadedSchemas.entries()].filter(([_, e]) => e.schema).map(([k, e]) => ({ toolKey: k, schema: e.schema }));
}
`);
    console.log("Created free-schema-loader.ts");
  }

  // free-v531-formula-registry.ts
  const registryPath = join(ROOT, "src/sectorcalc/formulas/free-v531/free-v531-formula-registry.ts");
  if (!existsSync(registryPath)) {
    writeFileSync(registryPath, `import "server-only";
export interface FormulaModuleConfig { toolKey: string; file: string; }
export const FREE_FORMULA_CONFIGS: FormulaModuleConfig[] = [];
// Free tool formulas are embedded in their JSON schema files.
`);
    console.log("Created free-v531-formula-registry.ts");
  }

  // route page
  const routePath = join(ROOT, "src/app/tools/free/[slug]/page.tsx");
  if (!existsSync(routePath)) {
    writeFileSync(routePath, `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return listFreeToolSchemaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);
  if (!result.ok) return {};
  return { title: result.schema.tool_name + " | SectorCalc Free Tools", description: result.schema.tool_name + " — " + result.schema.primary_operation.replace(/_/g, " ") + "." };
}

export default async function FreeToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);
  if (!result.ok) notFound();
  const schema = result.schema;
  const identityCheck = assertToolSchemaIdentity({ routeToolKey: slug, schemaToolKey: schema.tool_key, schemaToolId: schema.tool_id });
  if (!identityCheck.ok) notFound();
  return (
    <PageLayout>
      <article aria-label={schema.tool_name} className="sc-v531-shell">
        <UniversalIndustrialDecisionForm schema={schema} toolKey={slug} executeEndpoint="/api/tool-execute" initialProfileMode="engineering" accessTier="FREE" />
      </article>
    </PageLayout>
  );
}
`);
    console.log("Created free [slug] route page");
  }

  // free-tools collection page
  const collectionPath = join(ROOT, "src/app/free-tools/page.tsx");
  if (!existsSync(collectionPath)) {
    writeFileSync(collectionPath, `import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { getAllFreeToolSchemas } from "@/sectorcalc/runtime/free-schema-loader";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/features/tools/build-taxonomy-sector-cards";
import { SLUG_TOKEN_SECTOR_HINTS, SECTORS } from "@/lib/features/tools/taxonomy";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Free Industrial Calculators | SectorCalc", description: "Access free industrial calculators for structural, manufacturing, energy, quality, logistics, and food service decision support.", robots: { index: true, follow: true } };

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));
function resolveFreeSectorKey(toolKey: string): string {
  const tokens = toolKey.replace(/_calculator$/, "").split("_");
  for (const token of tokens) { const hint = SLUG_TOKEN_SECTOR_HINTS[token]; if (hint && TAXONOMY_SECTOR_IDS.has(hint)) return hint; }
  return "diger";
}

function freeSchemaToToolListItem(toolKey: string, schema: any): ToolListItem {
  return { slug: toolKey, name: schema.tool_name, title: schema.tool_name, tier: "free", href: "/tools/free/" + toolKey, isPremium: false, categorySlug: "free-tools", sectorKey: resolveFreeSectorKey(toolKey) };
}

export default async function FreeToolsCatalogPage() {
  const locale = "en";
  const freeEntries = getAllFreeToolSchemas();
  const count = freeEntries.length;
  const tools: ToolListItem[] = freeEntries.map(({ toolKey, schema }) => freeSchemaToToolListItem(toolKey, schema));
  const taxonomySectorCards = withTaxonomyCountLabels(buildTaxonomySectorCards(tools, locale, { allLabel: "All Free Tools" }), (tc: number) => tc + " tools");
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd([{ key: "home", path: "/" }, { name: "Free Tools", path: "/free-tools" }], locale),
    buildItemListJsonLd(tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((t) => ({ name: t.title, path: t.href })), "Free Industrial Calculators", locale),
  ];
  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <CatalogPageShell tools={tools} sectors={taxonomySectorCards} title="Free Industrial Calculators" subtitle={count + " free industrial calculators for screening, review, and audit-ready decision support."} searchPlaceholder="Search free calculators..." categoryTitle="Industry sectors" />
      </section>
    </PageLayout>
  );
}
`);
    console.log("Created free-tools collection page");
  }

  // Stage everything
  console.log("Staging files...");
  execSync("git add src/sectorcalc/schemas/free-v531/ src/sectorcalc/runtime/free-schema-loader.ts src/sectorcalc/formulas/free-v531/ src/app/tools/free/ src/app/free-tools/", { cwd: ROOT, stdio: "inherit" });
  console.log("Staged successfully.");
  console.log(`Batch ${partNum} applied. Ready for commit.`);
}

main();
