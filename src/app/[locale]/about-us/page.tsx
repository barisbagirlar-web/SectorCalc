export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutDetailContent } from "@/components/about/AboutDetailContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return createPageMetadata({
    title: t("seoTitle"),
    description: t("seoDescription"),
    path: "/about-us",
    locale: locale as AppLocale,
  });
}

export default async function AboutUsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutDetailContent locale={locale} />;
}
