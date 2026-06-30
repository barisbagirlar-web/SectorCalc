import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlatformFeatureIcon } from "@/components/ui/PlatformFeatureIcon";

const PRIMARY_FEATURES = [
  {
    icon: "engine" as const,
    title: "Structured Calculation Engine",
    description:
      "Reusable tool definitions, validated inputs and transparent formulas across sectors.",
  },
  {
    icon: "report" as const,
    title: "Decision Report Layer",
    description:
      "Each premium tool turns outputs into executive summaries, risk levels, scenarios and recommendations.",
  },
  {
    icon: "architecture" as const,
    title: "Sector Architecture",
    description:
      "Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing share one scalable tool engine.",
  },
] as const;

const SECONDARY_FEATURES = [
  {
    icon: "locale" as const,
    title: "Global Localization Ready",
    description:
      "English-first architecture with planned Turkish, German, Arabic, Portuguese, Spanish and French support.",
  },
  {
    icon: "security" as const,
    title: "Secure Validation Flow",
    description:
      "Lead intent capture is designed for controlled MVP validation before payment and export are enabled.",
  },
] as const;

export function PlatformArchitectureSection() {
  return (
    <section className="border-b border-technical-gray bg-industrial-matte py-8">
      <Container>
        <SectionHeader
          eyebrow="Platform"
          title="Built as a sector decision platform"
          subtitle="SectorCalc is not a loose collection of calculators. It is a structured engine for cost, margin, capacity and pricing decisions — with a report layer for stakeholders who need more than a single number."
          align="center"
        />

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {PRIMARY_FEATURES.map((feature) => (
            <article key={feature.title} className="text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                <PlatformFeatureIcon variant={feature.icon} />
              </div>
              <h3 className="font-display mt-6 text-xl font-semibold text-premium-velvet">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-body-charcoal md:text-base">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 border-t border-technical-gray pt-16 md:grid-cols-2 md:gap-12">
          {SECONDARY_FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6"
            >
              <PlatformFeatureIcon variant={feature.icon} />
              <div>
                <h3 className="font-display text-lg font-semibold text-premium-velvet">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-body-charcoal">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
