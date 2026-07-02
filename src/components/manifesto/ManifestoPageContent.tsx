import { getTranslations } from "@/lib/i18n-stub";
import { AcademicAdvisoryBoardSection } from "@/components/about/AcademicAdvisoryBoardSection";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { PageLayout } from "@/components/layout/PageLayout";
import { Target, Eye, Users } from "lucide-react";

export type ManifestoPageVariant = "manifesto" | "about" | "methodology" | "trust";

type Section = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly bullets?: readonly string[];
};

const VARIANT_SECTION_IDS: Record<ManifestoPageVariant, readonly string[]> = {
  manifesto: ["who", "what", "for-whom", "replaces", "losses", "dual-intelligence", "trust-trace", "responsibility"],
  about: ["who", "what", "for-whom", "replaces"],
  methodology: ["dual-intelligence", "trust-trace", "losses", "responsibility"],
  trust: ["trust-trace", "dual-intelligence", "responsibility"],
};

type ManifestoPageContentProps = {
  readonly variant: ManifestoPageVariant;
  readonly headline: string;
  readonly lead: string;
  readonly locale: string;
};

export async function ManifestoPageContent({ variant, headline, lead, locale }: ManifestoPageContentProps) {
  const t = await getTranslations({ locale, namespace: "manifestoComponent" });

  const sectionData = t.raw("allSections") as Array<{
    id: string;
    titleKey: string;
    bodyKey: string;
    bulletKeys: string[];
  }>;
  const cardsData = t.raw("aboutCards") as Array<{
    id: string;
    titleKey: string;
    bodyKey: string;
  }>;

  const ABOUT_CARDS = cardsData.map((card) => ({
    id: card.id,
    title: t(card.titleKey),
    body: t(card.bodyKey),
    icon: card.id === "mission" ? Target : card.id === "vision" ? Eye : Users,
  }));

  const ALL_SECTIONS: Section[] = sectionData.map((section) => ({
    id: section.id,
    title: t(section.titleKey),
    body: t(section.bodyKey),
    bullets: section.bulletKeys.map((key: string) => t(key)),
  }));

  const sectionIds = new Set(VARIANT_SECTION_IDS[variant]);
  const sections = ALL_SECTIONS.filter((section) => sectionIds.has(section.id));

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-craft-headline">{headline}</h1>
          <p className="sc-craft-lead max-w-3xl">{lead}</p>
        </Container>
      </section>

      <section className="sc-craft-section overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0 space-y-8">
          {variant === "about" ? (
            <div className="grid gap-6 md:grid-cols-3">
              {ABOUT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.id}
                    className="rounded-xl border border-gray-100 bg-kil-surface p-6"
                  >
                    <Icon className="mx-auto h-12 w-12 text-gray-700 text-center" strokeWidth={1.5} aria-hidden="true" />
                    <h2 className="mt-2 text-center text-lg font-semibold text-navy">{card.title}</h2>
                    <p className="mt-2 text-left text-sm text-body-charcoal">{card.body}</p>
                  </article>
                );
              })}
            </div>
          ) : (
            sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="sc-industrial-panel sc-ledger-panel p-4 sm:p-6 min-w-0"
              >
                <h2 className="text-lg font-semibold text-navy sm:text-xl">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-body-charcoal sm:text-base">{section.body}</p>
                {section.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-body-charcoal">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))
          )}

          <DecisionToolLegalDisclaimer />
        </Container>
      </section>

      {variant === "about" ? <AcademicAdvisoryBoardSection /> : null}
    </PageLayout>
  );
}
