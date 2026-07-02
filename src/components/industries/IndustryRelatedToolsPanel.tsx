import { getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { IndustryCalculatorCardList } from "@/components/industries/IndustryCalculatorCardList";
import { EmptyIndustryToolsState } from "@/components/industries/EmptyIndustryToolsState";
import { Container } from "@/components/ui/Container";
import { resolveIndustryTools } from "@/lib/features/industries/resolve-industry-tools";
import type { IndustrySlug } from "@/lib/features/tools/industry-registry";

type IndustryRelatedToolsPanelProps = {
  readonly industrySlug: IndustrySlug;
  readonly locale: string;
};

export async function IndustryRelatedToolsPanel({
  industrySlug,
  locale,
}: IndustryRelatedToolsPanelProps) {
  const t = await getTranslations({ locale, namespace: "industries" });
  const relatedTools = resolveIndustryTools({ locale, industrySlug });

  if (!relatedTools.hasTools) {
    return (
      <section className="border-b border-border-subtle bg-white py-8 sm:py-10">
        <Container>
          <EmptyIndustryToolsState
            title={t("noToolsTitle")}
            description={t("noToolsDescription")}
            ctaLabel={t("viewAllCalculators")}
            href="/calculator-library"
          />
        </Container>
      </section>
    );
  }

  return (
    <div data-industry-related-tools="true">
      {relatedTools.free.length > 0 ? (
        <section
          data-industry-free-tools="true"
          className="border-b border-border-subtle bg-bg-subtle py-8 sm:py-10"
        >
          <Container>
            <h2 className="text-2xl font-bold text-text-primary">{t("relatedFreeTools")}</h2>
            <IndustryCalculatorCardList tools={relatedTools.free} tier="free" />
          </Container>
        </section>
      ) : null}

      {relatedTools.premium.length > 0 ? (
        <section
          data-industry-premium-tools="true"
          className="border-b border-border-subtle bg-white py-8 sm:py-10"
        >
          <Container>
            <h2 className="text-2xl font-bold text-text-primary">{t("relatedPremiumTools")}</h2>
            <IndustryCalculatorCardList tools={relatedTools.premium} tier="premium" />
          </Container>
        </section>
      ) : null}

      <section className="border-b border-border-subtle bg-bg-subtle py-6 sm:py-8">
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">{t("viewAllCalculatorsLead")}</p>
          <Link
            href="/calculator-library"
            prefetch={false}
            className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-sc-copper px-5 text-sm font-semibold text-white transition-colors hover:bg-sc-copper-hover"
          >
            {t("viewAllCalculators")}
          </Link>
        </Container>
      </section>
    </div>
  );
}
