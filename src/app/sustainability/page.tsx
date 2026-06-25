import { getLocale, getTranslations } from "next-intl/server";
// @ts-nocheck
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
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

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "Sustainability & CBAM Compliance Suite",
    description:
      "Carbon footprint tracking, CBAM import cost proxies, and EU compliance intelligence for metalworking, textile, energy, and industrial sectors.",
    path: "/sustainability",
    locale: locale as "en",
  });
}

export default async function SustainabilityHubPage({ params }: PageProps) {
  const locale = "en";
  
  const appLocale = await getLocale();
  const tSector = await getTranslations();
  const carbonSectors = listSectorRegistryKeys().filter((key) =>
    hasSectorSmartModule(SectorRegistry[key], SmartModuleIds.carbon_cbam),
  );

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="sustainability-heading">
            <SemanticSummary
              title="What is SectorCalc CBAM & Carbon tracking?"
              answer="SectorCalc Intelligence Layer applies sector emission factors to operational usage metrics, producing kg CO₂e proxies and CBAM-ready audit trails. Link industrial efficiency to sustainability compliance without separate ERP modules."
              bullets={[
                "CBAM & Carbon Tracker Smart Module",
                "Integrated with MasterOS audit pipeline",
                "Cite Hidden Loss + carbon for full margin picture",
              ]}
            />
            <p className="ind-os-eyebrow">Compliance</p>
            <h1 id="sustainability-heading" className="ind-os-headline">
              Sustainability / CBAM Suite
            </h1>
            <p className="ind-os-lead">Sectors with carbon_cbam Smart Module</p>
          </section>

          <section className="ind-os-section" aria-labelledby="carbon-sectors-heading">
            <h2 id="carbon-sectors-heading" className="ind-os-section-title">
              CBAM-enabled sectors
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
                          Audit
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
              Audit Hub →
            </HubLink>
            <HubLink
              href="/benchmarks"
              className="text-sm font-medium text-body-charcoal transition-colors hover:text-premium-velvet"
            >
              Benchmarks →
            </HubLink>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
}
