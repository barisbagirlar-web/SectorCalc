import ProToolsPage from "@/components/pages/ProToolsPage";
import translations from "@/i18n/pricing-translations.json";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const data = translations as unknown as Record<string, { dir: string; pro_tools: Record<string, string> }>;
  const t = data[locale]?.pro_tools || data["en"]?.pro_tools || {};

  const title = t.hero_title
    ? `Pro Calculators — SectorCalc`
    : "Pro Calculators — SectorCalc";
  const description = t.hero_sub || "161 professional industrial calculators. PDF reports. Industrial standards. From $1.99 per calculation.";

  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <ProToolsPage locale={locale} translations={translations} />;
}
