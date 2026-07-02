type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "trustPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/trust",
    locale: locale as AppLocale,
  });
}

export default async function TrustPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("trustPage");

  return (
    <ManifestoPageContent
      variant="trust"
      headline={t("headline")}
      lead={t("lead")}
      locale={locale}
    />
  );
}
