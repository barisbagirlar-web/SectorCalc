import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageHero } from "@/components/catalog/CatalogPageHero";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import {
  buildCalculatorFunctionGroups,
  DEFAULT_FUNCTION_CATEGORY_ID,
  type FunctionCategoryId,
} from "@/lib/catalog/calculator-function-categories";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildCoreHubCrawlGroups, buildFreeToolsCrawlGroups, buildPremiumToolsCrawlGroups } from "@/lib/seo/crawl-index";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("catalogExplorer.categories");

  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/categories",
    locale: locale as AppLocale,
  });
}

export default async function CategoriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogExplorer");
  const tFunction = await getTranslations("catalogExplorer.functionCategories");

  const groups = buildCalculatorFunctionGroups({
    locale,
    resolveGroupCopy: (id: FunctionCategoryId) => ({
      label: tFunction(`${id}.label`),
      description: tFunction(`${id}.description`),
    }),
  });

  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "By function", path: "/categories" },
      ],
      locale
    ),
    buildItemListJsonLd(
      groups.flatMap((group) =>
        group.items.map((item) => ({ name: item.title, path: item.href }))
      ),
      "Calculators by function",
      locale
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <CatalogPageHero
        eyebrow={t("categories.eyebrow")}
        title={t("categories.title")}
        subtitle={t("categories.subtitle")}
      />

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer
            groups={groups}
            variant="categories"
            defaultGroupId={DEFAULT_FUNCTION_CATEGORY_ID}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <CrawlIndexLinkList
            groups={[
              ...buildCoreHubCrawlGroups(),
              ...buildFreeToolsCrawlGroups(),
              ...buildPremiumToolsCrawlGroups(locale),
            ]}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
