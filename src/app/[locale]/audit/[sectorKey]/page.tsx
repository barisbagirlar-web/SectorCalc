export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { OsAuditModule } from "@/components/os/OsAuditModule";
import { SchemaMesh } from "@/components/seo/SchemaMesh";
import { SectorHubCrossLinks } from "@/components/seo/SectorHubCrossLinks";
import { SemanticSummary } from "@/components/seo/SemanticSummary";
import { getSectorEntry, isSectorRegistryKey } from "@/lib/os/registry/sectors";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";

type PageProps = {
  params: Promise<{ locale: string; sectorKey: string }>;
};


export async function generateStaticParams() {
  const { listSectorRegistryKeys } = await import("@/lib/os/registry/sectors");
  const { routing } = await import("@/i18n/routing");
  const keys = listSectorRegistryKeys();

  const params = routing.locales.flatMap((locale) =>
    keys.map((sectorKey) => ({ locale, sectorKey })),
  );
  return limitStaticParamsForPreview(params, {
    family: "audit",
    slugKey: "sectorKey",
    localeKey: "locale",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, sectorKey } = await params;
  setRequestLocale(locale);

  if (!isSectorRegistryKey(sectorKey)) {
    return {};
  }

  const sector = getSectorEntry(sectorKey);

  return createPageMetadata({
    title: `${sector.name} — Operational Audit`,
    description: `Run an anonymized operational audit for ${sector.name}. U-Engine efficiency score, hidden loss detection, and industry benchmarks.`,
    path: `/audit/${sectorKey}`,
    locale: locale as AppLocale,
  });
}

export default async function OsAuditPage({ params }: PageProps) {
  const { locale, sectorKey } = await params;
  setRequestLocale(locale);

  if (!isSectorRegistryKey(sectorKey)) {
    notFound();
  }

  const sector = getSectorEntry(sectorKey);
  const t = await getTranslations("industrialHome");

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <SchemaMesh sector={sector} sectorKey={sectorKey} locale={locale} />

          <section className="ind-os-section ind-os-section--hero" aria-labelledby="sector-audit-heading">
            <SemanticSummary
              title={`What is ${sector.name} efficiency audit?`}
              answer={`${sector.name} audit compares target vs actual operational parameters through SectorCalc MasterOS: registry validation, U-Engine formula execution, hidden loss quantification, and anonymized industry benchmarking.`}
              bullets={[
                "Step 1: Enter 3 sector parameters",
                "Step 2: Receive CRITICAL / OPTIMAL prescription",
                "Step 3: Compare against industry benchmark pool",
              ]}
            />
            <p className="ind-os-eyebrow">{t("brand")}</p>
            <h1 id="sector-audit-heading" className="ind-os-headline">
              {sector.name}
            </h1>
            <p className="ind-os-lead">
              {t("activeModule")}: {sector.unitType}
            </p>
          </section>

          <section className="ind-os-section">
            <OsAuditModule sectorId={sectorKey} />
            <SectorHubCrossLinks sectorKey={sectorKey} sectorName={sector.name} />
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
