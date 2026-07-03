import { getTranslations } from "@/lib/i18n-stub";
import Link from "@/lib/ui-shared/navigation/next-link";
import PageHero from "@/components/shared/PageHero";
import { IndustryRelatedToolsPanel } from "@/components/industries/IndustryRelatedToolsPanel";
import { Container } from "@/components/ui/Container";
import type { Industry } from "@/data/industries";
import { getIndustryHubContent } from "@/data/industry-hub-content";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";

interface IndustryPageContentProps {
  industry: Industry;
  locale: string;
}

export async function IndustryPageContent({ industry, locale }: IndustryPageContentProps) {
  const t = await getTranslations({ locale, namespace: "industryPage" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });
  const baseHub = getIndustryHubContent(industry.slug);
  const localizedHub = getLocalizedIndustryHub(industry.slug, locale);
  const hub = { ...baseHub, ...localizedHub };
  const eyebrow = localizedHub?.eyebrow ?? industry.name;

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

      <section className="border-b border-border-subtle bg-white py-5 sm:py-6">
        <Container size="narrow">
          <p className="text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">{t("whoItsForLabel")}</strong> {hub.whoItsFor}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">{t("decisionLabel")}</strong> {hub.decisionHelp}
          </p>
        </Container>
      </section>

      <IndustryRelatedToolsPanel industrySlug={industry.slug} locale={locale} />

      <section className="bg-bg-subtle py-5 sm:py-6">
        <Container size="narrow">
          <p className="text-sm leading-relaxed text-text-secondary">{tLegal("disclaimer")}</p>
          <nav className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-4">
            <Link href="/industries" className="font-medium text-deep-navy hover:underline">
              {t("allIndustries")}
            </Link>
            <Link href="/calculator-library" className="font-medium text-deep-navy hover:underline">
              {t("calculatorLibraryLink")}
            </Link>
            <Link href="/free-tools" className="font-medium text-deep-navy hover:underline">
              {t("freeToolsLink")}
            </Link>
            <Link href="/free-tools" className="font-medium text-deep-navy hover:underline">
              {t("premiumToolsLink")}
            </Link>
          </nav>
        </Container>
      </section>
    </div>
  );
}
