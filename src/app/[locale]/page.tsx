import type { Metadata } from "next";
import { getTranslations, setRequestLocale, getMessages } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { LandingContent } from "@/types/landing";
import "../../styles/landing-page.css";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepageHybrid" });

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/",
    locale: locale as AppLocale,
  });
}

async function getLandingContent(locale: string): Promise<LandingContent> {
  const messages = await getMessages({ locale });
  const lp = (messages as Record<string, unknown>).landingPage as
    | LandingContent
    | undefined;
  if (lp) return lp;
  // Fallback: load English
  const enMsgs = await getMessages({ locale: "en" });
  return ((enMsgs as Record<string, unknown>).landingPage ?? {}) as LandingContent;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = await getLandingContent(locale);

  return (
    <PageLayout>
      <LandingPageContent content={content} />
    </PageLayout>
  );
}
