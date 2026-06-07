import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { HubLink } from "@/components/layout/HubLink";
import { AuditArchiveSection } from "@/components/os/AuditArchiveSection";
import { QuickAccessModules } from "@/components/os/QuickAccessModules";
import { SystemStatusWidget } from "@/components/os/SystemStatusWidget";
import {
  MANUFACTURING_OS_I18N_NS,
  SectorRegistry,
  resolveSectorTitle,
  sectorKeyToIndustrySlug,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

export async function IndustrialHome() {
  const tHome = await getTranslations("industrialHome");
  const tSector = await getTranslations(MANUFACTURING_OS_I18N_NS);
  const locale = await getLocale();

  return (
    <div className="ind-os-page">
      <div className="ind-os-container">
        <section className="ind-os-section ind-os-section--hero" aria-labelledby="home-hero">
          <p className="ind-os-eyebrow">{tHome("brand")}</p>
          <h1 id="home-hero" className="ind-os-headline">
            {tHome("headline")}
            {tHome("headlineAccent") ? ` ${tHome("headlineAccent")}` : ""}
          </h1>
          <p className="ind-os-lead">{tHome("lead")}</p>
        </section>

        <section className="ind-os-section" aria-labelledby="loss-dimensions-heading">
          <h2 id="loss-dimensions-heading" className="ind-os-section-title">
            {tHome("lossDimensions.title")}
          </h2>
          <div className="ind-os-module-grid">
            {(["money", "material", "time", "energy"] as const).map((key) => (
              <div key={key} className="ind-os-module ind-os-module--static">
                <span className="ind-os-module__title">{tHome(`lossDimensions.${key}`)}</span>
              </div>
            ))}
          </div>
        </section>

        <SystemStatusWidget />
        <QuickAccessModules />

        <section className="ind-os-section" aria-labelledby="sector-modules-heading">
          <h2 id="sector-modules-heading" className="ind-os-section-title">
            {tHome("modulesTitle")}
          </h2>
          <div className="ind-os-list">
            <ul>
              {(Object.entries(SectorRegistry) as [SectorRegistryKey, (typeof SectorRegistry)[SectorRegistryKey]][]).map(
                ([id, sector]) => {
                  const industrySlug = sectorKeyToIndustrySlug(id);
                  const href = industrySlug ? `/industries/${industrySlug}` : `/audit/${id}`;
                  const title = resolveSectorTitle(sector, tSector, locale);

                  return (
                    <li key={id}>
                      <HubLink href={href} className="ind-os-list-row">
                        <span className="ind-os-list-row__title">{title}</span>
                        <span className="ind-os-list-row__action">
                          {tHome("initializeAudit")}
                          <ChevronRight className="h-3 w-3" aria-hidden />
                        </span>
                      </HubLink>
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        </section>

        <section className="ind-os-section" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="ind-os-section-title">
            {tHome("quickAccess.modules.archive")}
          </h2>
          <div className="ind-os-panel">
            <AuditArchiveSection maxRecords={5} />
          </div>
        </section>
      </div>
    </div>
  );
}
