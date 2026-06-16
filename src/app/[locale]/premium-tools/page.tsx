import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { PremiumCatalogSearch } from "@/components/catalog/PremiumCatalogSearch";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildPremiumCatalogTools } from "@/lib/catalog/premium-catalog-source";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "premiumCategoryCatalog" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/premium-tools",
    locale: locale as AppLocale,
  });
}

export default async function PremiumToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("premiumCategoryCatalog");
  const catalogTools = buildPremiumCatalogTools(locale).map((tool) => ({
    ...tool,
    categorySlug: tool.categoryId,
  }));
  const activeToolCount = catalogTools.filter((tool) => tool.isActive && tool.routePath).length;
  const categories = listPremiumCatalogCategories(locale)
    .filter((category) => category.premiumToolCount > 0)
    .map((category) => ({
      slug: category.slug,
      title: category.title,
      iconKey: category.iconKey,
      count: category.premiumToolCount,
    }));

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/premium-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      catalogTools
        .filter((tool) => tool.isActive && tool.routePath)
        .map((tool) => ({
          name: tool.title,
          path: tool.routePath!,
        })),
      t("title"),
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <Suspense fallback={<div className="min-h-[12rem]" aria-hidden="true" />}>
            <PremiumCatalogSearch
              tools={catalogTools}
              categories={categories}
              totalActiveCount={activeToolCount}
            />
          </Suspense>
        </Container>
      </section>
    </PageLayout>
  );
}
