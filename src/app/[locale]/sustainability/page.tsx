export const dynamic = "force-dynamic";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { HubLink } from "@/components/layout/HubLink";
import { PageLayout } from "@/components/layout/PageLayout";
import { SemanticSummary } from "@/components/seo/SemanticSummary";
import { createPageMetadata } from "@/lib/metadata";
import {
  listSectorRegistryKeys,
  MANUFACTURING_OS_I18N_NS,
  resolveSectorTitle,
  SectorRegistry,
  hasSectorSmartModule,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { SmartModuleIds } from "@/lib/os/registry/smart-modules";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainabilityPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/sustainability",
    locale: locale as AppLocale,
  });
}

export default async function SustainabilityHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sustainabilityPage");
  const appLocale = await getLocale();
  const tSector = await getTranslations(MANUFACTURING_OS_I18N_NS);
  const carbonSectors = listSectorRegistryKeys().filter((key) =>
    hasSectorSmartModule(SectorRegistry[key], SmartModuleIds.carbon_cbam),
  );

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="sustainability-heading">
            <SemanticSummary
              title={t("semanticTitle")}
              answer={t("semanticAnswer")}
              bullets={[
                t("semanticBullet1"),
                t("semanticBullet2"),
                t("semanticBullet3"),
              ]}
            />
            <p className="ind-os-eyebrow">{t("eyebrow")}</p>
            <h1 id="sustainability-heading" className="ind-os-headline">
              {t("headline")}
            </h1>
            <p className="ind-os-lead">{t("lead")}</p>
          </section>

          <section className="ind-os-section" aria-labelledby="carbon-sectors-heading">
            <h2 id="carbon-sectors-heading" className="ind-os-section-title">
              {t("sectorsTitle")}
            </h2>
            <div className="ind-os-list">
              <ul>
                {carbonSectors.map((key) => {
                  const sector = SectorRegistry[key as SectorRegistryKey];
                  const title = resolveSectorTitle(sector, tSector, appLocale);

                  return (
                    <li key={key}>
                      <HubLink href={`/audit/${key}`} className="ind-os-list-row">
                        <span className="ind-os-list-row__title">{title}</span>
                        <span className="ind-os-list-row__action">
                          {t("auditLabel")}
                          <ChevronRight className="h-3 w-3" aria-hidden />
                        </span>
                      </HubLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <nav
            className="ind-os-section flex flex-wrap gap-4 border-t border-technical-gray pt-4"
            aria-label="Related hubs"
          >
            <HubLink
              href="/audit"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("auditHub")}
            </HubLink>
            <HubLink
              href="/benchmarks"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("benchmarks")}
            </HubLink>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
}
