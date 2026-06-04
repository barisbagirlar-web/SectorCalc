import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { INDUSTRIES } from "@/data/industries";

export function IndustriesPreviewSection() {
  return (
    <section className="border-y border-slate/10 bg-white py-16 md:py-24 lg:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow="Industries"
          title="Sector packs for operational and commercial decisions"
          subtitle="Each industry module combines a quick estimate layer and a premium decision tool — aligned to how that sector prices work, measures margin and evaluates risk."
          action={
            <Link
              href="/industries"
              className="shrink-0 text-sm font-semibold text-professional-blue hover:underline min-h-[44px] inline-flex items-center"
            >
              View all industries →
            </Link>
          }
        />
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </section>
  );
}
