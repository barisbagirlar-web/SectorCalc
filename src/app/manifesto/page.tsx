type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "manifestoPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/manifesto",
    locale: locale as AppLocale,
  });
}

export default async function ManifestoPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("manifestoPage");

  return (
    <ManifestoPageContent
      variant="manifesto"
      headline={t("headline")}
      lead={t("lead")}
      locale={locale}
    />
  );
}
