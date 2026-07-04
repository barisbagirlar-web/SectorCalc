import type { Metadata } from "next";
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
export const metadata: Metadata = {
  title: "Free Industrial Calculators | SectorCalc",
  description: "Access free industrial calculators for structural, manufacturing, energy, quality, logistics, and food service decision support. Deterministic, auditable, server-side execution.",
  robots: { index: true, follow: true },
};

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveFreeSectorKey(toolKey: string): string {
  const tokens = toolKey.replace(/_calculator$/, "").split("_");
  for (const token of tokens) {
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint && TAXONOMY_SECTOR_IDS.has(hint)) return hint;
  }
  return "diger";
}

function freeSchemaToToolListItem(toolKey: string, schema: any): ToolListItem {
  const sectorKey = resolveFreeSectorKey(toolKey);
  return { slug: toolKey, name: schema.tool_name, title: schema.tool_name, tier: "free", href: "/tools/free/" + toolKey, isPremium: false, categorySlug: "free-tools", sectorKey };
}

export default async function FreeToolsCatalogPage() {
  const locale = "en";
  const freeEntries = getAllFreeToolSchemas();
  const count = freeEntries.length;
  const tools: ToolListItem[] = freeEntries.map(({ toolKey, schema }) => freeSchemaToToolListItem(toolKey, schema));
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, { allLabel: "All Free Tools" }),
    (tc: number) => tc + " tools",
  );
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd([{ key: "home", path: "/" }, { name: "Free Tools", path: "/free-tools" }], locale),
    buildItemListJsonLd(tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((t) => ({ name: t.title, path: t.href })), "Free Industrial Calculators", locale),
  ];
  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <CatalogPageShell tools={tools} sectors={taxonomySectorCards} title="Free Industrial Calculators" subtitle={count + " free industrial calculators for screening, review, and audit-ready decision support. Each calculator follows the SuperV4 V5.3.1 schema."} searchPlaceholder="Search free calculators..." categoryTitle="Industry sectors" />
      </section>
    </PageLayout>
  );
}
