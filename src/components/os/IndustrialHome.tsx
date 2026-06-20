import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { HubLink } from "@/components/layout/HubLink";
import { AuditArchiveSection } from "@/components/os/AuditArchiveSection";
import { QuickAccessModules } from "@/components/os/QuickAccessModules";
import { SystemStatusWidget } from "@/components/os/SystemStatusWidget";
import { ProductScreenMockup } from "@/components/ui/ProductScreenMockup";
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
    <div className="sc-pro-page ind-os-page">
      <div className="sc-pro-container ind-os-container">
        <section className="sc-pro-hero-compact" aria-labelledby="home-hero">
          <div className="sc-pro-hero-compact__copy">
            <p className="sc-pro-eyebrow ind-os-eyebrow">{tHome("brand")}</p>
            <h1 id="home-hero" className="sc-pro-title sc-pro-title--compact ind-os-headline">
              {tHome("headline")}
              {tHome("headlineAccent") ? ` ${tHome("headlineAccent")}` : ""}
            </h1>
            <p className="sc-pro-lead ind-os-lead">{tHome("lead")}</p>
            <div className="sc-pro-hero-compact__actions">
              <Link href="/free-tools" className="sc-cta-primary">
                Free calculators
              </Link>
              <Link href="/pro-tools" className="sc-cta-secondary">
                Premium analyzers
              </Link>
            </div>
          </div>
          <ProductScreenMockup className="sc-pro-hero-compact__mockup" />
        </section>

        <hr className="sc-ledger-separator" />

        <section className="sc-pro-section ind-os-section" aria-labelledby="loss-dimensions-heading">
          <h2 id="loss-dimensions-heading" className="sc-pro-eyebrow ind-os-section-title">
            {tHome("lossDimensions.title")}
          </h2>
          <div className="ind-os-module-grid">
            {(["money", "material", "time", "energy"] as const).map((key) => (
              <div key={key} className="sc-pro-card ind-os-module ind-os-module--static">
                <span className="ind-os-module__title">{tHome(`lossDimensions.${key}`)}</span>
              </div>
            ))}
          </div>
        </section>

        <SystemStatusWidget />
        <QuickAccessModules />

        <section className="sc-pro-section ind-os-section" aria-labelledby="sector-modules-heading">
          <h2 id="sector-modules-heading" className="sc-pro-eyebrow ind-os-section-title">
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

        <section className="sc-pro-section ind-os-section" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="sc-pro-eyebrow ind-os-section-title">
            {tHome("quickAccess.modules.archive")}
          </h2>
          <div className="sc-pro-panel sc-pro-letterpress ind-os-panel">
            <AuditArchiveSection maxRecords={5} />
          </div>
        </section>
      </div>
    </div>
  );
}
