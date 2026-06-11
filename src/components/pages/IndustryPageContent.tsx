import { getTranslations } from "next-intl/server";
import Link from "@/lib/navigation/next-link";
import PageHero from "@/components/shared/PageHero";
import { IndustryAuditModule } from "@/components/os/IndustryAuditModule";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Industry } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";
import { getIndustryRegistryEntry } from "@/lib/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import {
  getPremiumSchemasForIndustrySlug,
} from "@/lib/premium-schema/premium-schema-catalog";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import {
 getAccountHref,
 getFreeToolHref,
 getPremiumToolHref,
 getPremiumToolsHref,
 getPricingHref,
} from "@/lib/tools/tool-links";

interface IndustryPageContentProps {
 industry: Industry;
 locale: string;
}

export async function IndustryPageContent({ industry, locale }: IndustryPageContentProps) {
 const t = await getTranslations({ locale, namespace: "industryPage" });
 const baseHub = getIndustryHubContent(industry.slug);
 const localizedHub = getLocalizedIndustryHub(industry.slug, locale);
 const hub = { ...baseHub, ...localizedHub };
 const eyebrow = localizedHub?.eyebrow ?? industry.name;
 const registryEntry = getIndustryRegistryEntry(industry.slug);
 const tool = getRevenueToolBySector(industry.slug);
 const schemaAnalyzers = getPremiumSchemasForIndustrySlug(industry.slug, locale, 3);
 const mappedSchema = tool ? getPremiumSchemaForPaidSlug(tool.paidSlug) : null;
 const primaryPremiumHref = mappedSchema
   ? `/tools/premium-schema/${mappedSchema.id}`
   : tool
     ? getPremiumToolHref(tool)
     : getPremiumToolsHref();

 return (
 <div data-industry-page="true">
 <div data-industry-title="true">
 <PageHero
 eyebrow={eyebrow}
 title={hub.hubTitle}
 description={hub.painStatement}
 align="left"
 />
 </div>

 <section
 data-industry-smart-form="true"
 className="border-b border-technical-gray bg-industrial-matte py-5 sm:py-7"
 >
 <IndustryAuditModule industrySlug={industry.slug} />
 </section>

 <section className="border-b border-border-subtle bg-white py-5 sm:py-6">
 <Container size="narrow">
 <p className="text-sm leading-relaxed text-text-secondary">
 <strong className="text-text-primary">{t("whoItsForLabel")}</strong> {hub.whoItsFor}
 </p>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 <strong className="text-text-primary">{t("decisionLabel")}</strong>{" "}
 {hub.decisionHelp}
 </p>
 </Container>
 </section>

 {tool ? (
 <section
 data-free-calculator-section="true"
 className="border-b border-border-subtle bg-bg-subtle py-5 sm:py-6"
 >
 <Container>
 <h2 className="text-2xl font-bold text-text-primary">{t("freeCalculatorHeading")}</h2>
 <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
 {hub.freeToolExplanation}
 </p>
 <p className="mt-2 text-xs text-text-secondary">
 {t("freeCalculatorNote")}
 </p>
 <Button href={getFreeToolHref(tool)} size="lg" className="mt-6">
 {t("openTool", { tool: tool.freeTitle })}
 </Button>
 </Container>
 </section>
 ) : null}

 {tool ? (
 <section className="border-b border-border-subtle bg-white py-5 sm:py-6">
 <Container>
 <h2 className="text-2xl font-bold text-text-primary">{t("premiumHeading")}</h2>
 <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
 {hub.premiumToolExplanation}
 </p>
 <div className="mt-6 flex flex-col gap-3 sm:flex-row">
 <Button href={primaryPremiumHref} size="lg">
 {t("openTool", { tool: tool.paidTitle })}
 </Button>
 <Button href={getPricingHref(tool)} variant="outline" size="lg">
 {t("startPro")}
 </Button>
 </div>
 </Container>
 </section>
 ) : null}

 {schemaAnalyzers.length > 0 ? (
 <section className="border-b border-border-subtle bg-bg-subtle py-5 sm:py-6">
 <Container>
 <h2 className="text-2xl font-bold text-text-primary">{t("relatedHeading")}</h2>
 <p className="mt-2 max-w-2xl text-sm text-text-secondary">
 {t("relatedNote")}
 </p>
 <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {schemaAnalyzers.map((analyzer) => (
 <li
 key={analyzer.slug}
 className="sc-ledger-card sc-industrial-panel sc-ledger-letterpress flex h-full min-w-0 flex-col p-4"
 >
 <p className="sc-ledger-eyebrow">{analyzer.badge}</p>
 <p className="mt-1 font-semibold text-premium-velvet">{analyzer.title}</p>
 <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-body-charcoal">
 {analyzer.painStatement}
 </p>
 <p className="mt-2 font-mono text-xs text-sc-navy">{analyzer.primaryOutputLabel}</p>
 <Link
 href={analyzer.href.replace(/^\/[a-z]{2}\//, "/")}
 className="sc-craft-card__cta mt-auto pt-4"
 >
 {t("openAnalyzer")}
 </Link>
 </li>
 ))}
 </ul>
 <Link href={getPremiumToolsHref()} className="mt-6 inline-flex text-sm font-semibold text-deep-navy underline">
 {t("viewAll")}
 </Link>
 </Container>
 </section>
 ) : null}

 {registryEntry?.additionalAnalyzers &&
 registryEntry.additionalAnalyzers.length > 0 ? (
 <section className="border-b border-border-subtle bg-bg-subtle py-5 sm:py-6">
 <Container>
 <h2 className="text-2xl font-bold text-text-primary">{t("additionalHeading")}</h2>
 <p className="mt-2 text-sm text-text-secondary">
 {t("additionalNote")}
 </p>
 <ul className="mt-6 grid gap-4 sm:grid-cols-2">
 {registryEntry.additionalAnalyzers.map((analyzer) => (
 <li
 key={analyzer.title}
 className="rounded-sm border border-border-subtle bg-white px-5 py-4"
 >
 <p className="font-semibold text-text-primary">{analyzer.title}</p>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {analyzer.description}
 </p>
 </li>
 ))}
 </ul>
 </Container>
 </section>
 ) : null}

 <section className="bg-bg-subtle py-5 sm:py-6">
 <Container size="narrow">
 <p className="text-sm leading-relaxed text-text-secondary">{revenueLegalDisclaimer}</p>
 <nav className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-4">
 <Link href="/industries" className="font-medium text-deep-navy hover:underline">
 {t("allIndustries")}
 </Link>
 {tool ? (
 <>
 <Link
 href={getFreeToolHref(tool)}
 className="font-medium text-deep-navy hover:underline"
 >
 {t("freeCalculatorLink")}
 </Link>
 <Link
 href={primaryPremiumHref}
 className="font-medium text-deep-navy hover:underline"
 >
 {t("premiumAnalyzerLink")}
 </Link>
 <Link
 href={getPricingHref(tool)}
 className="font-medium text-deep-navy hover:underline"
 >
 {t("proPricing")}
 </Link>
 </>
 ) : null}
 <Link
 href={getAccountHref()}
 className="font-medium text-deep-navy hover:underline"
 >
 {t("account")}
 </Link>
 </nav>
 </Container>
 </section>
 </div>
 );
}
