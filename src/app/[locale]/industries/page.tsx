import IndustriesPage from "@/components/pages/IndustriesPage";
import translations from "@/i18n/pricing-translations.json";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const data = translations as unknown as Record<string, { dir: string; industries: Record<string, string> }>;
  const t = data[locale]?.industries || data["en"]?.industries || {};

  const title = t.meta_title || "Industries — SectorCalc";
  const description = t.meta_description || "Manufacturing, construction, energy, logistics — industrial calculators for every sector.";

  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <IndustriesPage locale={locale} translations={translations} />;
}
