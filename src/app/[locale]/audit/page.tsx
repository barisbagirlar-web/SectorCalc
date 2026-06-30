export const dynamic = "force-dynamic";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { HubLink } from "@/components/layout/HubLink";
import { PageLayout } from "@/components/layout/PageLayout";
import { SemanticSummary } from "@/components/seo/SemanticSummary";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import {
  listSectorRegistryKeys,
  MANUFACTURING_OS_I18N_NS,
  resolveSectorTitle,
  SectorRegistry,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auditPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/audit",
    locale: locale as AppLocale,
  });
}

export default async function AuditHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auditPage");
  const tHub = await getTranslations("auditHub");
  const tHome = await getTranslations("industrialHome");
  const tSector = await getTranslations(MANUFACTURING_OS_I18N_NS);
  const appLocale = await getLocale();
  const keys = listSectorRegistryKeys();

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="audit-hub-heading">
            <SemanticSummary
              title={t("semanticTitle")}
              answer={t("semanticAnswer")}
              bullets={[
                t("semanticBullet1"),
                t("semanticBullet2"),
                t("semanticBullet3"),
              ]}
            />
            <p className="ind-os-eyebrow">{tHub("eyebrow")}</p>
            <h1 id="audit-hub-heading" className="ind-os-headline">
              {tHub("title")}
            </h1>
            <p className="ind-os-lead">{tHub("subtitle")}</p>
          </section>

          <section className="ind-os-section" aria-labelledby="audit-sectors-heading">
            <h2 id="audit-sectors-heading" className="ind-os-section-title">
              {tHome("modulesTitle")}
            </h2>
            <div className="ind-os-module-grid">
              {keys.map((key) => {
                const sector = SectorRegistry[key as SectorRegistryKey];
                const title = resolveSectorTitle(sector, tSector, appLocale);

                return (
                  <HubLink key={key} href={`/audit/${key}`} className="ind-os-module">
                    <span className="ind-os-module__title">{title}</span>
                    <span className="ind-os-module__action">
                      {tHome("initializeAudit")}
                      <ChevronRight className="h-3 w-3" aria-hidden />
                    </span>
                  </HubLink>
                );
              })}
            </div>
          </section>

          <nav
            className="ind-os-section flex flex-wrap gap-4 border-t border-technical-gray pt-4"
            aria-label="Related hubs"
          >
            <HubLink
              href="/benchmarks"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("benchmarksLink")}
            </HubLink>
            <HubLink
              href="/sustainability"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              {t("cbamLink")}
            </HubLink>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
}
