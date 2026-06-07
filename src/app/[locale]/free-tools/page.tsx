import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCatalogByCategory } from "@/components/tools/ToolCatalogByCategory";
import { FreeTrafficCatalogSection } from "@/components/tools/FreeTrafficCatalogSection";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { Container } from "@/components/ui/Container";
import { IconListItem } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import { Button } from "@/components/ui/Button";
import { FREE_TOOLS } from "@/data/tools";
import { FREE_TRAFFIC_CATEGORIES, FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { industryRegistry } from "@/lib/tools/industry-registry";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("freeTrafficCatalog");
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
  const t = await getTranslations("freeTrafficCatalog");

  return (
    <PageLayout>
      <section className="border-b border-border-subtle bg-bg-subtle py-4 sm:py-6">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            {t("lead")}
          </p>
          <p className="mt-3 text-sm font-medium text-text-primary">
            {t("totalCount", {
              traffic: FREE_TRAFFIC_TOOLS.length,
              sectors: FREE_TOOLS.length,
              categories: FREE_TRAFFIC_CATEGORIES.length,
            })}
          </p>
          <nav className="mt-4 flex flex-wrap gap-2" aria-label={t("categoryNavLabel")}>
            <Link
              href="#featured"
              className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-deep-navy"
            >
              {t("featuredTitle")}
            </Link>
            {FREE_TRAFFIC_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`#${category}`}
                className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-deep-navy"
              >
                {t(`categories.${category}`)}
              </Link>
            ))}
            <Link
              href="#sector-tools"
              className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-deep-navy"
            >
              {t("sectorToolsTitle")}
            </Link>
          </nav>
        </Container>
      </section>

      <section className="border-b border-border-subtle bg-white py-4 sm:py-6">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-text-primary">{t("includesTitle")}</h2>
              <ul className="mt-4 space-y-2.5">
                {[t("includes1"), t("includes2"), t("includes3"), t("includes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.check} iconClassName="text-deep-navy">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{t("excludesTitle")}</h2>
              <ul className="mt-4 space-y-2.5">
                {[t("excludes1"), t("excludes2"), t("excludes3"), t("excludes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.exclude} iconClassName="text-text-secondary">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <FreeToolPrivacyNote />
          </div>
        </Container>
      </section>

      <FreeTrafficCatalogSection />

      <section
        id="sector-tools"
        className="border-b border-border-subtle bg-white py-4 sm:py-6"
      >
        <Container size="wide">
          <h2 className="text-xl font-bold text-text-primary">{t("sectorToolsTitle")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">{t("sectorToolsLead")}</p>
          <p className="mt-2 text-sm text-text-secondary">
            {t("sectorToolsCount", {
              count: FREE_TOOLS.length,
              industries: industryRegistry.length,
            })}
          </p>
          <div className="mt-6">
            <ToolCatalogByCategory tools={FREE_TOOLS} />
          </div>
        </Container>
      </section>

      <section className="bg-bg-subtle py-4 sm:py-6">
        <Container>
          <div className="border border-border-subtle bg-white p-4 sm:p-6">
            <h2 className="text-xl font-bold text-text-primary">{t("premiumUpsellTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              {t("premiumUpsellBody")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={getPremiumToolsHref()} variant="primary" size="lg">
                {t("premiumUpsellCta")}
              </Button>
              <Link
                href="/industries"
                className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
              >
                {t("premiumUpsellIndustries")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
