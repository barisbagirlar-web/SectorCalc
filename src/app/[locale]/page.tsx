import type { Metadata } from "next";
import { getTranslations, setRequestLocale, getMessages } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { LandingContent } from "@/types/landing";
import { getTotalToolCount } from "@/lib/tools/tool-counts";
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

/** Deep-replace `{toolCount}` in every string of an object. */
function replaceCount(obj: Record<string, unknown>, count: number): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      result[key] = val.replace(/\{toolCount\}/g, String(count));
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      result[key] = replaceCount(val as Record<string, unknown>, count);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [rawContent, total] = await Promise.all([
    getLandingContent(locale),
    getTotalToolCount(),
  ]);

  const content = replaceCount(rawContent as unknown as Record<string, unknown>, total) as unknown as LandingContent;

  return (
    <PageLayout>
      <LandingPageContent content={content} />
    </PageLayout>
  );
}
