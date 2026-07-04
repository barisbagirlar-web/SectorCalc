/* eslint-disable */
// @ts-nocheck

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolsIconTileGrid } from "@/components/tools/ToolsIconTileGrid";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import {
  getFreeTrafficCategoryLanding,
  listFreeTrafficCategorySlugs,
} from "@/lib/infrastructure/seo/free-traffic-category-landing";
import {
  getTaxonomyCategoryLanding,
  listTaxonomyCategorySlugs,
  resolveTaxonomyCategoryTitle,
} from "@/lib/infrastructure/seo/taxonomy-category-landing";

type PageProps = {
  params: Promise<{  category: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  const taxonomy = listTaxonomyCategorySlugs().map((category) => ({ category }));
  const freeTraffic = listFreeTrafficCategorySlugs().map((category) => ({ category }));
  const seen = new Set<string>();
  const params = [...taxonomy, ...freeTraffic].filter((entry) => {
    if (seen.has(entry.category)) {
      return false;
    }
    seen.add(entry.category);
    return true;
  });
  return limitStaticParamsForPreview(params, {
    family: "free-tools-category",
    slugKey: "category",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const locale = "en";
  const taxonomyLanding = getTaxonomyCategoryLanding(category, locale);
  if (taxonomyLanding) {
    const title = resolveTaxonomyCategoryTitle(taxonomyLanding, locale, category);
    return createPageMetadata({
      title: `${title} | SectorCalc`,
      description: `${title} - ${taxonomyLanding.tools.length} calculators and decision tools.`,
      path: `/tools/category/${category}`,
      locale: locale as AppLocale,
    });
  }

  const landing = getFreeTrafficCategoryLanding(category, locale);
  if (!landing) {
    return {};
  }

  const tCatalog = await getTranslations({ locale, namespace: "freeTrafficCatalog" });
  const title = tCatalog(landing.meta.labelKey);

  return createPageMetadata({
    title: `${title} | SectorCalc`,
    description: tCatalog(landing.meta.descriptionKey),
    path: `/tools/category/${category}`,
    locale: locale as AppLocale,
  });
}

export default async function ToolsCategoryLandingPage({ params }: PageProps) {
  const { category } = await params;
  const locale = "en";
  setRequestLocale(locale);

  const taxonomyLanding = getTaxonomyCategoryLanding(category, locale);
  if (taxonomyLanding) {
    const t = await getTranslations("generatedToolCatalog");
    const categoryTitle = resolveTaxonomyCategoryTitle(taxonomyLanding, locale, category);
    const categoryDescription = `${categoryTitle} - ${taxonomyLanding.tools.length} calculators.`;

    const jsonLd = [
      await buildLocalizedBreadcrumbJsonLd(
        [
          { key: "home", path: "/" },
          { key: "generatedTools", path: "/tools/generated" },
          { name: categoryTitle, path: `/tools/category/${category}` },
        ],
        locale,
      ),
      buildItemListJsonLd(
        taxonomyLanding.tools.map((tool) => ({
          name: tool.name,
          path: tool.href,
        })),
        categoryTitle,
        locale,
      ),
    ];

    return (
      <PageLayout>
        <JsonLd data={jsonLd} />
        <section className="sc-pro-section sc-pro-section--border">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0 pb-12 pt-8">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-body-charcoal">
              <Link href="/tools/generated" prefetch={false} className="hover:underline">
                {t("title")}
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span>{categoryTitle}</span>
            </nav>

            <header className="mb-8 max-w-3xl">
              <h1 className="text-2xl font-semibold text-premium-velvet sm:text-3xl">{categoryTitle}</h1>
              <p className="tool-description mt-3 text-sm text-body-charcoal sm:text-base">
                {categoryDescription}
              </p>
            </header>

            <article aria-label={categoryTitle}>
              <p className="mb-4 text-sm text-body-charcoal" role="status">
                {t("resultsCount", { count: taxonomyLanding.tools.length })}
              </p>

              {taxonomyLanding.tools.length === 0 ? (
                <p className="rounded-lg border border-dashed border-technical-gray bg-surface-cream px-4 py-10 text-center text-sm text-body-charcoal">
                  {t("noResults")}
                </p>
              ) : (
                <ToolsIconTileGrid
                  tools={taxonomyLanding.tools.map((tool) => ({
                    slug: tool.slug,
                    name: tool.name,
                    shortDescription: tool.name,
                    description: tool.name,
                    tier: tool.premiumRequired ? "premium" : "free",
                    industrySlug: tool.sectorKey,
                    href: tool.href,
                  }))}
                />
              )}
            </article>
          </Container>
        </section>
      </PageLayout>
    );
  }

  const landing = getFreeTrafficCategoryLanding(category, locale);
  if (!landing) {
    notFound();
  }

  const tCatalog = await getTranslations("freeTrafficCatalog");
  const t = await getTranslations("generatedToolCatalog");
  const categoryTitle = tCatalog(landing.meta.labelKey);
  const categoryDescription = tCatalog(landing.meta.descriptionKey);

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "generatedTools", path: "/tools/generated" },
        { name: categoryTitle, path: `/tools/category/${category}` },
      ],
      locale,
    ),
    buildItemListJsonLd(
      landing.tools.map((tool) => ({
        name: tool.name,
        path: tool.href,
      })),
      categoryTitle,
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0 pb-12 pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-body-charcoal">
            <Link href="/tools/generated" prefetch={false} className="hover:underline">
              {t("title")}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span>{categoryTitle}</span>
          </nav>

          <header className="mb-8 max-w-3xl">
            <h1 className="text-2xl font-semibold text-premium-velvet sm:text-3xl">{categoryTitle}</h1>
            <p className="tool-description mt-3 text-sm text-body-charcoal sm:text-base">
              {categoryDescription}
            </p>
          </header>

          <article aria-label={categoryTitle}>
            <p className="mb-4 text-sm text-body-charcoal" role="status">
              {t("resultsCount", { count: landing.tools.length })}
            </p>

            {landing.tools.length === 0 ? (
              <p className="rounded-lg border border-dashed border-technical-gray bg-surface-cream px-4 py-10 text-center text-sm text-body-charcoal">
                {t("noResults")}
              </p>
            ) : (
              <ToolsIconTileGrid tools={landing.tools} />
            )}
          </article>
        </Container>
      </section>
    </PageLayout>
  );
}
