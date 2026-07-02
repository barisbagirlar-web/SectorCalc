export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { AboutDetailContent } from "@/components/about/AboutDetailContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
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
  const locale = "en";
  setRequestLocale(locale);

  return <AboutDetailContent locale={locale} />;
}
