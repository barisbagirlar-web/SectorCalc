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
      <section className="sc-craft-section sc-craft-section--alt sc-craft-section--border">
        <Container className="sc-craft-container">
          <p className="sc-craft-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-craft-headline">{t("title")}</h1>
          <p className="sc-craft-lead">{t("lead")}</p>
          <p className="mt-3 text-sm font-medium text-premium-velvet">
            {t("totalCount", {
              traffic: FREE_TRAFFIC_TOOLS.length,
              sectors: FREE_TOOLS.length,
              categories: FREE_TRAFFIC_CATEGORIES.length,
            })}
          </p>
          <nav className="mt-4 flex flex-wrap gap-1" aria-label={t("categoryNavLabel")}>
            <Link href="#featured" className="sc-cta-secondary px-3 text-xs">
              {t("featuredTitle")}
            </Link>
            {FREE_TRAFFIC_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`#${category}`}
                className="sc-cta-secondary px-3 text-xs"
              >
                {t(`categories.${category}`)}
              </Link>
            ))}
            <Link href="#sector-tools" className="sc-cta-secondary px-3 text-xs">
              {t("sectorToolsTitle")}
            </Link>
          </nav>
        </Container>
      </section>

      <section className="sc-craft-section sc-craft-section--border">
        <Container className="sc-craft-container">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="sc-industrial-panel p-5">
              <h2 className="sc-craft-headline text-lg">{t("includesTitle")}</h2>
              <ul className="mt-4 space-y-2">
                {[t("includes1"), t("includes2"), t("includes3"), t("includes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.check} iconClassName="text-premium-velvet">
                    {item}
                  </IconListItem>
                ))}
              </ul>
            </div>
            <div className="sc-industrial-panel p-5">
              <h2 className="sc-craft-headline text-lg">{t("excludesTitle")}</h2>
              <ul className="mt-4 space-y-2">
                {[t("excludes1"), t("excludes2"), t("excludes3"), t("excludes4")].map((item) => (
                  <IconListItem key={item} icon={UI_ICON.exclude} iconClassName="text-body-charcoal">
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

      <section id="sector-tools" className="sc-craft-section sc-craft-section--alt sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide">
          <h2 className="sc-craft-headline text-xl sm:text-2xl">{t("sectorToolsTitle")}</h2>
          <p className="sc-craft-lead text-sm">{t("sectorToolsLead")}</p>
          <p className="mt-2 text-sm text-body-charcoal">
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

      <section className="sc-craft-section">
        <Container className="sc-craft-container">
          <div className="sc-decision-block">
            <h2 className="sc-craft-headline text-lg">{t("premiumUpsellTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-body-charcoal">
              {t("premiumUpsellBody")}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={getPremiumToolsHref()} className="sc-cta-primary">
                {t("premiumUpsellCta")}
              </Link>
              <Link href="/industries" className="sc-cta-secondary">
                {t("premiumUpsellIndustries")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
