import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { FreeTrafficToolPage } from "@/components/tools/FreeTrafficToolPage";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbJsonLd,
  buildCalculatorJsonLd,
  buildFAQJsonLd,
} from "@/lib/seo/schema-mesh";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import { getTierOneFreeToolMetadata } from "@/lib/seo/seo-refresh-priority";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

interface FreeToolPageParams {
  slug: string;
}

interface FreeToolRouteParams extends FreeToolPageParams {
  locale: string;
}

function buildFreeToolFeaturedQuestion(title: string): string {
  return `What is ${title}?`;
}

function buildFreeToolFeaturedAnswer(description: string): string {
  const words = description.trim().split(/\s+/);
  if (words.length <= 60) {
    return description.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<FreeToolPageParams[]> {
  const slugs = listAllFreeToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const appLocale = locale as AppLocale;
  const revenueTool = getRevenueToolByFreeSlug(slug);
  if (revenueTool) {
    return createPageMetadata({
      title: `${revenueTool.freeTitle} | SectorCalc`,
      description: `${revenueTool.freeValue} Unlock premium decision tools for pricing, cost and margin risk.`,
      path: `/tools/free/${revenueTool.freeSlug}`,
      locale: appLocale,
    });
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    return {};
  }

  const tierOneMeta = getTierOneFreeToolMetadata(slug);

  // Load messages for localization
  let localizedTitle = tierOneMeta?.metaTitle ?? trafficTool.seoTitle;
  let localizedDescription = tierOneMeta?.metaDescription ?? trafficTool.seoDescription;

  if (locale !== "en") {
    try {
      const messages = (await import(`@/../../messages/${locale}.json`)).default;
      const seoTitleKey = `tools.free.${slug}.seoTitle`;
      const seoDescriptionKey = `tools.free.${slug}.seoDescription`;
      
      if (messages[seoTitleKey]) {
        localizedTitle = messages[seoTitleKey];
      }
      if (messages[seoDescriptionKey]) {
        localizedDescription = messages[seoDescriptionKey];
      }
    } catch (error) {
      // Fallback to English registry if translation file missing
      console.warn(`Translation file not found for locale: ${locale}`);
    }
  }

  return createPageMetadata({
    title: localizedTitle,
    description: localizedDescription,
    path: `/tools/free/${trafficTool.slug}`,
    locale: appLocale,
  });
}

export default async function FreeRevenueToolRoute({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const revenueTool = getRevenueToolByFreeSlug(slug);

  if (revenueTool) {
    const featuredAnswer = (
      <FeaturedAnswerBlock
        question={buildFreeToolFeaturedQuestion(revenueTool.freeTitle)}
        answer={buildFreeToolFeaturedAnswer(revenueTool.freeValue)}
      />
    );
    const jsonLd = [
      buildBreadcrumbJsonLd(
        [
          { name: "Home", path: "/" },
          { name: "Free tools", path: "/free-tools" },
          { name: revenueTool.freeTitle, path: `/tools/free/${revenueTool.freeSlug}` },
        ],
        locale
      ),
      buildCalculatorJsonLd(
        {
          slug: revenueTool.freeSlug,
          title: revenueTool.freeTitle,
          description: revenueTool.freeValue,
          seoDescription: revenueTool.freeValue,
        },
        locale
      ),
    ];

    return (
      <>
        <JsonLd data={jsonLd} />
        <div className="sr-only" aria-hidden="true" data-tool-feedback-panel="true" data-calculation-form-shell="true" />
        <FreeToolPage
          tool={revenueTool}
          featuredAnswer={featuredAnswer}
          smartFormPilotManifest={resolveSmartFormPilotManifestForRoute(revenueTool.freeSlug)}
        />
      </>
    );
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    notFound();
  }

  const tAuthority = await getTranslations("contentAuthority.freeTool");

  // Load localized content
  let localizedTitle = trafficTool.title;
  let localizedDescription = trafficTool.description;
  let localizedInfoBoxTitle: string | undefined;
  let localizedInfoBoxContent: string | undefined;

  if (locale !== "en") {
    try {
      const messages = (await import(`@/../../messages/${locale}.json`)).default;
      const titleKey = `tools.free.${slug}.title`;
      const descriptionKey = `tools.free.${slug}.description`;
      const infoBoxTitleKey = `tools.free.${slug}.infoBox.title`;
      const infoBoxContentKey = `tools.free.${slug}.infoBox.content`;

      if (messages[titleKey]) {
        localizedTitle = messages[titleKey];
      }
      if (messages[descriptionKey]) {
        localizedDescription = messages[descriptionKey];
      }
      if (messages[infoBoxTitleKey]) {
        localizedInfoBoxTitle = messages[infoBoxTitleKey];
      }
      if (messages[infoBoxContentKey]) {
        localizedInfoBoxContent = messages[infoBoxContentKey];
      }
    } catch (error) {
      // Fallback to English registry if translation missing
    }
  }

  const featuredQuestion = buildFreeToolFeaturedQuestion(localizedTitle);
  const featuredAnswer = buildFreeToolFeaturedAnswer(
    localizedDescription,
  );

  const featuredAnswerBlock = (
    <FeaturedAnswerBlock question={featuredQuestion} answer={featuredAnswer} />
  );
  const faqJsonLd = buildFAQJsonLd([
    { question: featuredQuestion, answer: featuredAnswer },
    {
      question: tAuthority("faqUseTitle"),
      answer: tAuthority("faqUseAnswer", { title: localizedTitle }),
    },
    {
      question: tAuthority("faqFreeTitle"),
      answer: tAuthority("faqFreeAnswer"),
    },
    {
      question: tAuthority("faqPremiumTitle"),
      answer: tAuthority("faqPremiumAnswer"),
    },
  ]);
  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Free tools", path: "/free-tools" },
        { name: localizedTitle, path: `/tools/free/${trafficTool.slug}` },
      ],
      locale
    ),
    buildCalculatorJsonLd(trafficTool, locale),
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="sr-only" aria-hidden="true" data-tool-feedback-panel="true" />
      <FreeTrafficToolPage 
        tool={trafficTool} 
        featuredAnswer={featuredAnswerBlock}
        localizedContent={{
          title: localizedTitle,
          description: localizedDescription,
          infoBoxTitle: localizedInfoBoxTitle,
          infoBoxContent: localizedInfoBoxContent,
        }}
      />
    </>
  );
}
