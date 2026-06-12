import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FreeToolPage } from "@/components/tools/FreeToolPage";
import { FreeTrafficToolPage } from "@/components/tools/FreeTrafficToolPage";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildFAQJsonLd } from "@/lib/seo/schema-mesh";
import { assertSemanticToolContract } from "@/lib/semantic/semantic-tool-reader";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import {
  resolveFreeToolLocalizedCopy,
} from "@/lib/i18n/free-tool-i18n";
import {
  localizeFreeTrafficToolInputs,
  localizeRevenueToolInputs,
} from "@/lib/i18n/free-tool-form-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";

function buildFeaturedAnswer(description: string): string {
  const words = description.trim().split(/\s+/);
  if (words.length <= 60) {
    return description.trim();
  }
  return `${words.slice(0, 58).join(" ")}…`;
}

type MigratedFreePremiumToolSurfaceProps = {
  readonly slug: string;
  readonly locale: string;
};

export async function MigratedFreePremiumToolSurface({
  slug,
  locale,
}: MigratedFreePremiumToolSurfaceProps) {
  const revenueTool = getRevenueToolByFreeSlug(slug);

  if (revenueTool) {
    const localizedTitle = getLocalizedRevenueToolTitle(
      slug,
      "free",
      locale,
      revenueTool.freeTitle,
    );
    const tFreeToolUi = await getTranslations("freeToolUi");
    const tAuthority = await getTranslations("contentAuthority.freeTool");
    const featuredAnswer = (
      <FeaturedAnswerBlock
        question={tFreeToolUi("whatIs", { title: localizedTitle })}
        answer={tAuthority("faqUseAnswer", { title: localizedTitle })}
      />
    );
    const semanticTool = assertSemanticToolContract({ slug, tier: "premium" });
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
  const localizedCopy = resolveFreeToolLocalizedCopy(slug, locale);
  const localizedTitle = localizedCopy.title ?? trafficTool.title;
  const localizedDescription = localizedCopy.description ?? trafficTool.description;
  const localizedInfoBoxTitle = localizedCopy.infoBoxTitle;
  const localizedInfoBoxContent = localizedCopy.infoBoxContent;
  const featuredQuestion = tFreeToolUi("whatIs", { title: localizedTitle });
  const featuredAnswer = buildFeaturedAnswer(localizedDescription);
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
  const semanticTool = assertSemanticToolContract({ slug, tier: "premium" });
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
          inputs: localizeFreeTrafficToolInputs(trafficTool.slug, locale, trafficTool.inputs),
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

export async function resolveMigratedPremiumToolMetadata(
  slug: string,
  locale: string,
): Promise<{ title: string; description: string } | null> {
  const revenueTool = getRevenueToolByFreeSlug(slug);
  if (revenueTool) {
    const localizedTitle = getLocalizedRevenueToolTitle(
      slug,
      "free",
      locale,
      revenueTool.freeTitle,
    );
    const localizedDescription =
      locale === "tr"
        ? `${localizedTitle} — premium sektör hesaplayıcısı.`
        : `${revenueTool.freeValue} Premium sector calculator on SectorCalc.`;
    return { title: localizedTitle, description: localizedDescription };
  }

  const trafficTool = getFreeTrafficToolBySlug(slug);
  if (!trafficTool) {
    return null;
  }

  const localizedCopy = resolveFreeToolLocalizedCopy(slug, locale);
  return {
    title: localizedCopy.title ?? trafficTool.title,
    description: localizedCopy.description ?? trafficTool.description,
  };
}
