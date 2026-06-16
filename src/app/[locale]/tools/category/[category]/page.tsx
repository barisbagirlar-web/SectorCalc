import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolsIconTileGrid } from "@/components/tools/ToolsIconTileGrid";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import {
  getFreeTrafficCategoryLanding,
  listFreeTrafficCategorySlugs,
} from "@/lib/seo/free-traffic-category-landing";

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  return listFreeTrafficCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
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
  const { locale, category } = await params;
  setRequestLocale(locale);

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
