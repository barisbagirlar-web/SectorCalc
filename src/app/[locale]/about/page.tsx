export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { buildAboutPageAuthorityJsonLd } from "@/lib/semantic/build-entity-authority-jsonld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return createPageMetadata({
    title: t("seoTitle"),
    description: t("seoDescription"),
    path: "/about",
    locale: locale as AppLocale,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const authorityJsonLd = buildAboutPageAuthorityJsonLd(locale as AppLocale);

  return (
    <>
      <JsonLd data={authorityJsonLd} />
      <ManifestoPageContent
        variant="about"
        headline={t("hero.title")}
        lead={t("hero.lead")}
        locale={locale}
      />
    </>
  );
}
