import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { PageLayout } from "@/components/layout/PageLayout";

export type ManifestoPageVariant = "manifesto" | "about" | "methodology" | "trust";

type Section = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly bullets?: readonly string[];
};

const ALL_SECTIONS: readonly Section[] = [
  {
    id: "who",
    title: "Who we are",
    body:
      "SectorCalc is an Industrial Micro-SaaS App Store for operators who need measurement, loss detection, and decision-ready reports without ERP complexity or consultant retainers.",
    bullets: [
      "Built for shop floors, field crews, and owner-operators",
      "Sector-specific calculators with governed formula contracts",
      "Browser-first tools with optional saved reports for subscribers",
    ],
  },
  {
    id: "what",
    title: "What we do",
    body:
      "We turn sector pain into structured calculation workflows: measure inputs, surface hidden loss, suggest action, and attach a trust trace to results.",
    bullets: [
      "Free checks for quick exposure signals",
      "Premium analyzers for verdict-grade outputs",
      "Export-ready decision reports with validation metadata",
    ],
  },
  {
    id: "for-whom",
    title: "Who it is for",
    body:
      "Welding shops, CNC job shops, HVAC contractors, cleaning operators, restaurants, e-commerce sellers, and other sector operators who quote, bid, or plan with tight margins.",
    bullets: [
      "Teams without dedicated pricing engineers",
      "Owners comparing quotes before signing",
      "Consultants needing repeatable sector templates",
    ],
  },
  {
    id: "replaces",
    title: "What we replace (and what we do not)",
    body:
      "SectorCalc replaces spreadsheet guesswork, notebook shortcuts, and random Google calculators — not SAP, Siemens, Oracle, or licensed engineering sign-off.",
    bullets: [
      "Not a quote-only Word template generator",
      "Not an ERP or MES replacement",
      "Not a certified compliance authority",
      "Does replace ad-hoc Excel and opaque margin leaks",
    ],
  },
  {
    id: "losses",
    title: "Losses we make visible",
    body:
      "Each sector pack targets measurable loss families: scrap, setup time, callback risk, route deadhead, food waste, return erosion, energy demand charges, and similar operating leaks.",
    bullets: [
      "Material and labor exposure",
      "Schedule and rework buffers",
      "Margin leak drivers with suggested actions",
      "Representative scenarios — not guaranteed savings",
    ],
  },
  {
    id: "dual-intelligence",
    title: "Dual-Intelligence methodology",
    body:
      "Mind 2 (Requirement Engine) resolves which inputs are missing, derivable, or blocked before calculation. Mind 1 (Validation Engine) checks dimensions, invariants, and oracle/scenario coverage after calculation. The LLM layer is interface-only — never the calculation authority.",
    bullets: [
      "Contract-driven input requirements",
      "Deterministic formula paths in production",
      "Oracle and scenario audits in governance pipeline",
      "Blocked results when validation fails",
    ],
  },
  {
    id: "trust-trace",
    title: "Trust Trace",
    body:
      "Trust Trace shows canonical inputs, assumptions, formula contract reference, validation status, and coverage notes alongside results — so operators can see why a number appeared, not just the headline.",
    bullets: [
      "Canonical input list with rejected keys",
      "Mind 2 pre-calc and Mind 1 post-calc summaries",
      "Export payload for PDF/Excel/Word (data layer)",
      "Verification seal foundation for report lookup",
    ],
  },
  {
    id: "responsibility",
    title: "Responsibility boundary",
    body:
      "SectorCalc outputs are technical decision-support simulations based on user-provided inputs and documented assumptions. They are not legal, financial, tax, or engineering advice. Verify all outputs before bids, contracts, or operational commitments.",
    bullets: [
      "User-provided inputs drive every result",
      "No guaranteed margin, savings, or approval",
      "Professional review may be required for regulated work",
      "Privacy: free-tier inputs processed in browser unless saved",
    ],
  },
];

const VARIANT_SECTION_IDS: Record<ManifestoPageVariant, readonly string[]> = {
  manifesto: ALL_SECTIONS.map((s) => s.id),
  about: ["who", "what", "for-whom", "replaces"],
  methodology: ["dual-intelligence", "trust-trace", "losses", "responsibility"],
  trust: ["trust-trace", "dual-intelligence", "responsibility"],
};

type ManifestoPageContentProps = {
  readonly variant: ManifestoPageVariant;
  readonly headline: string;
  readonly lead: string;
};

export function ManifestoPageContent({ variant, headline, lead }: ManifestoPageContentProps) {
  const sectionIds = new Set(VARIANT_SECTION_IDS[variant]);
  const sections = ALL_SECTIONS.filter((section) => sectionIds.has(section.id));

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">SectorCalc</p>
          <h1 className="sc-craft-headline">{headline}</h1>
          <p className="sc-craft-lead max-w-3xl">{lead}</p>
        </Container>
      </section>

      <section className="sc-craft-section overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0 space-y-8">
          {sections.map((section) => (
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
          ))}

          <DecisionToolLegalDisclaimer />
        </Container>
      </section>
    </PageLayout>
  );
}
