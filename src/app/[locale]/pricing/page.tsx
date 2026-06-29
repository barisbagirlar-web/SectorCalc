import PricingPage from "@/components/pages/PricingPage";
import translations from "@/i18n/pricing-translations.json";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const data = translations as unknown as Record<string, { dir: string; pricing: Record<string, string> }>;
  const t = data[locale]?.pricing || data["en"]?.pricing || {};

  const title = `SectorCalc Pro — ${(t.hero_title || "Pay only for what you use").replace(/\n/g, " ")}`;
  const description = t.hero_sub || "No subscription. No auto-renewal. Credits valid 12 months.";

  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <PricingPage locale={locale} translations={translations} />;
}
