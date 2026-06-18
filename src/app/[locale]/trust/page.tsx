import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trustPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/trust",
    locale: locale as AppLocale,
  });
}

export default async function TrustPage({ params }: PageProps) {
  const { locale } = await params;
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
