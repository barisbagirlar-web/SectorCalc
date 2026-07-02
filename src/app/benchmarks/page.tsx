export const dynamic = "force-dynamic";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { HubLink } from "@/components/layout/HubLink";
import { PageLayout } from "@/components/layout/PageLayout";
import { SemanticSummary } from "@/components/seo/SemanticSummary";
import { DEFAULT_INDUSTRY_BENCHMARK } from "@/lib/os/core/intel-engine";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import {
  listSectorRegistryKeys,
  MANUFACTURING_OS_I18N_NS,
  resolveSectorTitle,
  SectorRegistry,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "benchmarksPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/benchmarks",
    locale: locale as AppLocale,
  });
}

export default async function BenchmarksHubPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("benchmarksPage");
  const appLocale = await getLocale();
  const tSector = await getTranslations(MANUFACTURING_OS_I18N_NS);
  const keys = listSectorRegistryKeys();

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="benchmarks-heading">
            <SemanticSummary
              title={t("semanticTitle")}
              answer={`${t("semanticAnswer")} (${DEFAULT_INDUSTRY_BENCHMARK}/100).`}
              bullets={[
                t("semanticBullet1"),
                t("semanticBullet2"),
                t("semanticBullet3"),
              ]}
            />
            <p className="ind-os-eyebrow">{t("eyebrow")}</p>
            <h1 id="benchmarks-heading" className="ind-os-headline">
              {t("headline")}
            </h1>
          </section>

          <section className="ind-os-section" aria-labelledby="benchmark-sectors-heading">
            <h2 id="benchmark-sectors-heading" className="ind-os-section-title">
              {t("sectorsTitle")}
            </h2>
            <div className="ind-os-list">
              <ul>
                {keys.map((key) => {
                  const sector = SectorRegistry[key as SectorRegistryKey];
                  const title = resolveSectorTitle(sector, tSector, appLocale);

                  return (
                    <li key={key}>
                      <HubLink href={`/audit/${key}`} className="ind-os-list-row">
                        <span className="ind-os-list-row__title">{title}</span>
                        <span className="ind-os-list-row__action">
                          {t("openLabel")}
                          <ChevronRight className="h-3 w-3" aria-hidden />
                        </span>
                      </HubLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <nav className="ind-os-section border-t border-technical-gray pt-4">
            <HubLink
              href="/audit"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("backLink")}
            </HubLink>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
}
