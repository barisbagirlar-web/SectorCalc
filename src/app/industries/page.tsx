type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { getAllTools } from "@/lib/features/tools/all-tools-data";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";
import {
  getAllToolsGroupedByCategory,
  getOrderedCategorySlugsWithTools,
} from "@/lib/features/tools/getToolsByCategory";

type PageProps = {
  params: Promise<{  }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "industries" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/industries",
    locale: locale as AppLocale,
  });
}

/** Heavy catalog content streamed via Suspense for progressive rendering. */
async function CatalogContent() {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "industries" });
  const tCatalog = await getTranslations({ locale, namespace: "catalogExplorer" });

  const tools = getAllTools(locale);
  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: tCatalog("labels.industries.allLabel"),
    }),
    (count) => tCatalog("labels.industries.countLabel", { count }),
  );
  const groupedByCategory = getAllToolsGroupedByCategory(locale);
  const orderedCategorySlugs = getOrderedCategorySlugsWithTools(groupedByCategory);
  const allTools = orderedCategorySlugs.flatMap((slug) => groupedByCategory[slug] ?? []);

  return (
    <section className="sc-pro-section sc-pro-section--border">
      <CatalogPageShell
        tools={allTools}
        sectors={taxonomySectorCards}
        title={t("title")}
        subtitle={t("subtitle")}
        searchPlaceholder={t("searchPlaceholder")}
        categoryTitle={t("categoryTitle")}
        freeToolsHref="/free-tools"
        proToolsHref="/free-tools"
      />
    </section>
  );
}

/** Hero section renders immediately without waiting for catalog data. */
async function HeroSection() {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "industries" });
  // Minimal hero — just the breadcrumb metadata is injected via the parent.
  return null;
}

/** Skeleton shown while catalog content streams. */
function CatalogSkeleton() {
  return (
    <section className="sc-pro-section sc-pro-section--border">
      <div
        role="status"
        aria-label="Loading catalog"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            height: "2rem",
            width: "30%",
            background: "#E0DDD4",
            borderRadius: "6px",
            marginBottom: "0.75rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "1rem",
            width: "50%",
            background: "#E0DDD4",
            borderRadius: "4px",
            marginBottom: "1.5rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "3rem",
            background: "#F0EEE6",
            borderRadius: "8px",
            border: "1px solid #E0DDD4",
            marginBottom: "2rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "200px",
                background: "#F0EEE6",
                borderRadius: "8px",
                border: "1px solid #E0DDD4",
              }}
              className="skeleton-pulse"
            />
          ))}
        </div>
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .skeleton-pulse {
            animation: skeletonPulse 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
}

export default async function IndustriesPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "industries" });
  const tools = getAllTools(locale);

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "industries", path: "/industries" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
        name: tool.name,
        path: tool.href,
      })),
      t("title"),
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent />
      </Suspense>
    </PageLayout>
  );
}
