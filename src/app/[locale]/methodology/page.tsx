export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodologyPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/methodology",
    locale: locale as AppLocale,
  });
}

export default async function MethodologyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("methodologyPage");

  return (
    <ManifestoPageContent
      variant="methodology"
      headline={t("headline")}
      lead={t("lead")}
      locale={locale}
    />
  );
}
