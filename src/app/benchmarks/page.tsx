import { getLocale, getTranslations } from "next-intl/server";

import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { HubLink } from "@/components/layout/HubLink";
import { PageLayout } from "@/components/layout/PageLayout";
import { SemanticSummary } from "@/components/seo/SemanticSummary";
import { DEFAULT_INDUSTRY_BENCHMARK } from "@/lib/os/core/intel-engine";
import { createPageMetadata } from "@/lib/metadata";
import {
  listSectorRegistryKeys,
  MANUFACTURING_OS_I18N_NS,
  resolveSectorTitle,
  SectorRegistry,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "Industry Benchmark Intelligence",
    description:
      "Compare your operational efficiency score against anonymized sector benchmark pools. Industry average baseline and top-performer signals.",
    path: "/benchmarks",
    locale: locale as "en",
  });
}

export default async function BenchmarksHubPage({ params }: PageProps) {
  const locale = "en";
  
  const appLocale = await getLocale();
  const tSector = await getTranslations();
  const keys = listSectorRegistryKeys();

  return (
    <PageLayout>
      <div className="ind-os-page">
        <div className="ind-os-container">
          <section className="ind-os-section ind-os-section--hero" aria-labelledby="benchmarks-heading">
            <SemanticSummary
              title="What are SectorCalc industry benchmarks?"
              answer={`SectorCalc merges anonymized audit scores into per-sector pools. When your pool is empty, comparisons use a statistical default baseline (${DEFAULT_INDUSTRY_BENCHMARK}/100). No raw operational data leaves your session.`}
              bullets={[
                "Efficiency score 0–100 from U-Engine",
                "Sector-specific Smart Module context",
                "Run any audit to contribute & compare",
              ]}
            />
            <p className="ind-os-eyebrow">Intelligence Layer</p>
            <h1 id="benchmarks-heading" className="ind-os-headline">
              Industry Benchmarks
            </h1>
          </section>

          <section className="ind-os-section" aria-labelledby="benchmark-sectors-heading">
            <h2 id="benchmark-sectors-heading" className="ind-os-section-title">
              Sector pools
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
                          Open
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
              ← Master Audit Hub
            </HubLink>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
}
