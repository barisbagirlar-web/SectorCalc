import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectorCard } from "@/components/ui/SectorCard";
import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";

export async function IndustriesPreviewSection() {
  const t = await getTranslations("home.industriesPreview");

  return (
    <section className="border-b border-technical-gray bg-white py-6">
      <Container size="wide">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          action={
            <Link
              href="/industries"
              className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-semibold text-premium-velvet transition-colors hover:text-body-charcoal"
            >
              {t("viewAll")}
            </Link>
          }
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <SectorCard key={industry.slug} title={industry.name} href={industry.href} />
          ))}
        </div>
      </Container>
    </section>
  );
}
