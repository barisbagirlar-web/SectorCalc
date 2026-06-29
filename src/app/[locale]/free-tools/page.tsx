import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustriesTaxonomyGrid } from "@/components/industries/IndustriesTaxonomyGrid";
import { FreeToolCardGrid } from "@/components/free-tools/FreeToolCardGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeTools } from "@/lib/tools/all-tools-data";
import { buildTaxonomySectorCards, withTaxonomyCountLabels } from "@/lib/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/tools/filter-catalog-hub-tools";
import { SECTORS } from "@/lib/tools/taxonomy";
import { resolveTaxonomySectorDisplayLabel } from "@/lib/i18n/taxonomy-display-labels";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "freeTools" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/free-tools",
    locale: locale as AppLocale,
  });
}

export default async function FreeToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });
  const tPage = await getTranslations({ locale, namespace: "freeTools" });

  const tools = getFreeTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.free-tools.allLabel"),
    }),
    (count) => tCatalog("labels.free-tools.countLabel", { count }),
  );

  // ── Sector tabs: only sectors that actually have free tools ──
  const sectorsWithTools = new Set(tools.map((t) => t.sectorKey));
  const sectorTabs = SECTORS.filter((s) => sectorsWithTools.has(s.id)).map((s) => ({
    id: s.id,
    label:
      resolveTaxonomySectorDisplayLabel(s.id, locale) ??
      (locale.startsWith("en") ? s.labelEn : s.label),
  }));

  // ── Card data: pass only what the client component needs ──
  const cardTools = tools.map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    href: tool.href,
    sectorKey: tool.sectorKey,
    premiumRequired: tool.premiumRequired,
  }));

  // ── RTL direction ──
  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "freeTools", path: "/free-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
        name: tool.name,
        path: tool.href,
      })),
      tPage("title"),
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-6" dir={dir}>
          <h1 className="text-3xl font-bold text-gray-900">{tPage("title")}</h1>
          <p className="mt-1 text-base text-gray-500">{tPage("subtitle")}</p>
        </div>

        {/* ── Sector cards grid ────────────────────────────────────── */}
        <div className="mb-8 px-4">
          <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
            <IndustriesTaxonomyGrid
              basePath="/free-tools"
              sectors={taxonomySectorCards}
              variant="free"
            />
          </Suspense>
        </div>

        {/* ── Search + filter tabs + card grid ─────────────────────── */}
        <div className="px-4 pb-12">
          <Suspense fallback={<div className="min-h-[20rem]" aria-hidden="true" />}>
            <FreeToolCardGrid
              tools={cardTools}
              sectorTabs={sectorTabs}
              dir={dir}
              t={{
                searchPlaceholder: tPage("searchPlaceholder"),
                badgeFree: tPage("badgeFree"),
                badgePro: tPage("badgePro"),
                toolsCount: tPage("toolsCount"),
                allSectors: tPage("allSectors"),
                showAll: tPage("showAll"),
                noResults: tPage("noResults"),
                proUpsellTitle: tPage("proUpsellTitle"),
                proUpsellBody: tPage("proUpsellBody"),
                proUpsellCta: tPage("proUpsellCta"),
                creditHint: tPage("creditHint"),
              }}
            />
          </Suspense>
        </div>
      </section>
    </PageLayout>
  );
}
