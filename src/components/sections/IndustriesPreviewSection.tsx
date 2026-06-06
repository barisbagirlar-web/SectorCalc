import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectorCard } from "@/components/ui/SectorCard";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { Link } from "@/i18n/routing";
import { INDUSTRIES } from "@/data/industries";

export async function IndustriesPreviewSection() {
  const t = await getTranslations("home.industriesPreview");

  return (
    <section className="border-y border-slate/10 bg-white py-16 dark:border-slate-700 dark:bg-deep-navy md:py-24 lg:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          action={
            <Link
              href="/industries"
              className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-semibold text-professional-blue hover:underline dark:text-cyan"
            >
              {t("viewAll")}
            </Link>
          }
        />
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <SectorCard
              key={industry.slug}
              title={industry.name}
              description={industry.businessPain}
              icon={<SectorIcon slug={industry.slug} iconType={industry.icon} size="default" />}
              href={industry.href}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
