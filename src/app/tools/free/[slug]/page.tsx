export const dynamic = "force-dynamic";
import { getLocale, getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { notFound, redirect as nextRedirect } from "next/navigation";
import { redirect } from "next/navigation";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { FreeTrafficToolPage } from "@/components/tools/FreeTrafficToolPage";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildFAQJsonLd } from "@/lib/seo/schema-mesh";
import { assertSemanticToolContract } from "@/lib/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import { isFreeToolMigratedToPremium } from "@/lib/freemium/resolve-free-to-premium-migration";
import { getTierOneFreeToolMetadata } from "@/lib/seo/seo-refresh-priority";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import {
  resolveFreeToolLocalizedCopy,
  resolveFreeToolSeoDescription,
  resolveFreeToolSeoTitle,
} from "@/lib/i18n/free-tool-i18n";
import {
  localizeFreeTrafficToolInputs,
  localizeRevenueToolInputs,
} from "@/lib/i18n/free-tool-form-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import "@/styles/free-tool-form.css";

interface FreeToolPageParams {
  slug: string;
}

interface FreeToolRouteParams extends FreeToolPageParams {
  locale: string;
}

function buildFreeToolFeaturedAnswer(description: string): string {
  const words = description.trim().split(/\s+/);
  if (words.length <= 60) {
    return description.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<FreeToolPageParams[]> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
  const slugs = listAllFreeToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const appLocale = locale as "en";
  if (isFreeToolMigratedToPremium(slug)) {
    nextRedirect(`/${appLocale}/pricing`);
  }
  const revenueTool = getRevenueToolByFreeSlug(slug);
  if (revenueTool) {
    const localizedTitle = getLocalizedRevenueToolTitle(
      slug,
      "free",
      locale,
      revenueTool.freeTitle
    );
    const localizedDescription = `${revenueTool.freeValue} Unlock premium decision tools for pricing, cost and margin risk.`;
    return createPageMetadata({
      title: `${localizedTitle} | SectorCalc`,
      description: localizedDescription,
      path: `/tools/free/${revenueTool.freeSlug}`,
      locale: appLocale,
    });
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    return {};
  }

  const tierOneMeta = getTierOneFreeToolMetadata(slug);

  // Fallback chain: locale message > tier-one SEO metadata > English registry.
  const localizedCopy = resolveFreeToolLocalizedCopy(slug, locale);
  const localizedTitle = resolveFreeToolSeoTitle(
    slug,
    locale,
    trafficTool.seoTitle,
    tierOneMeta?.metaTitle,
  );
  const localizedDescription = resolveFreeToolSeoDescription(
    slug,
    locale,
    trafficTool.seoDescription,
    tierOneMeta?.metaDescription,
  );

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
  const { slug } = await params;
  const locale = await getLocale();
  

  if (isFreeToolMigratedToPremium(slug)) {
    nextRedirect(`/${locale}/pricing`);
  }

  const revenueTool = getRevenueToolByFreeSlug(slug);

  if (revenueTool) {
    const localizedTitle = getLocalizedRevenueToolTitle(
      slug,
      "free",
      locale,
      revenueTool.freeTitle
    );
    const tFreeToolUi = await getTranslations("freeToolUi");
    const tAuthority = await getTranslations("contentAuthority.freeTool");
    const featuredAnswer = (
      <FeaturedAnswerBlock
        question={tFreeToolUi("whatIs", { title: localizedTitle })}
        answer={tAuthority("faqUseAnswer", { title: localizedTitle })}
      />
    );
    const semanticTool = assertSemanticToolContract({ slug, tier: "free" });
    const toolJsonLd = buildToolJsonLd({ tool: semanticTool, locale });

    return (
      <>
        <SemanticJsonLd data={toolJsonLd} />
        <div className="sr-only" aria-hidden="true" data-tool-feedback-panel="true" data-calculation-form-shell="true" />
        <FreeToolPage
          tool={{
            ...revenueTool,
            freeTitle: localizedTitle,
            freeInputs: localizeRevenueToolInputs(revenueTool.freeSlug, locale, revenueTool.freeInputs),
          }}
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
  const tFreeToolUi = await getTranslations("freeToolUi");

  // Load localized content (locale message > English registry fallback).
  const localizedCopy = resolveFreeToolLocalizedCopy(slug, locale);
  const localizedTitle = localizedCopy.title ?? trafficTool.title;
  const localizedDescription = localizedCopy.description ?? trafficTool.description;
  const localizedInfoBoxTitle = localizedCopy.infoBoxTitle;
  const localizedInfoBoxContent = localizedCopy.infoBoxContent;

  const featuredQuestion = tFreeToolUi("whatIs", { title: localizedTitle });
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
  const semanticTool = assertSemanticToolContract({ slug, tier: "free" });
  const toolJsonLd = buildToolJsonLd({ tool: semanticTool, locale });
  const jsonLd = [...toolJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])];

  return (
    <>
      <SemanticJsonLd data={jsonLd} />
      <div className="sr-only" aria-hidden="true" data-tool-feedback-panel="true" />
      <FreeTrafficToolPage 
        tool={{
          ...trafficTool,
          title: localizedTitle,
          description: localizedDescription,
          seoTitle: localizedCopy.seoTitle ?? trafficTool.seoTitle,
          seoDescription: localizedCopy.seoDescription ?? trafficTool.seoDescription,
          inputs: localizeFreeTrafficToolInputs(
            trafficTool.slug,
            locale,
            trafficTool.inputs,
          ),
        }}
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
