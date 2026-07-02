import Link from "next/link";
import { getFreeToolAuthorityCopy } from "@/lib/content/free-tool-authority";
import { translateCalculatorPhrase } from "@/lib/infrastructure/i18n/calculator-phrase-translate";
import {
  getAuthorityGuideForFreeTool,
  getAuthorityGuideRoutePath,
  getIndustryPathForGuide,
  getSeoHubSlugForGuide,
} from "@/lib/content/authority-links";
import { resolvePremiumAnalyzerHref } from "@/lib/features/premium-schema/premium-schema-catalog";
import type { FreeTrafficTool } from "@/lib/features/tools/free-traffic-catalog";

export interface FreeToolAuthorityBlockProps {
  readonly tool: FreeTrafficTool;
  readonly locale: string;
  readonly localizedTitle?: string;
  readonly localizedDescription?: string;
  readonly labels: {
    readonly howItWorksTitle: string;
    readonly descriptionTitle: string;
    readonly formulaTitle: string;
    readonly inputsTitle: string;
    readonly includesTitle: string;
    readonly includes1: string;
    readonly includes2: string;
    readonly includes3: string;
    readonly estimateMissesTitle: string;
    readonly estimateMissesBody: string;
    readonly faqTitle: string;
    readonly faqUseTitle: string;
    readonly faqFreeTitle: string;
    readonly faqPremiumTitle: string;
    readonly faqUseAnswer: string;
    readonly faqFreeAnswer: string;
    readonly faqPremiumAnswer: string;
    readonly relatedGuideTitle: string;
    readonly relatedHubTitle: string;
    readonly relatedPremiumTitle: string;
    readonly relatedPremiumCta: string;
  };
}

export function FreeToolAuthorityBlock({
  tool,
  locale,
  localizedTitle,
  localizedDescription,
  labels,
}: FreeToolAuthorityBlockProps) {
  const copy = getFreeToolAuthorityCopy(tool);
  const guide = getAuthorityGuideForFreeTool(tool.slug);
  const premiumHref = tool.relatedPremiumSlug
    ? resolvePremiumAnalyzerHref(tool.relatedPremiumSlug)
    : null;

  const displayTitle = localizedTitle ?? tool.title;
  const displayDescription = localizedDescription ?? copy.description;
  const displayFormulaSummary =
    locale === "en" ? copy.formulaSummary : translateCalculatorPhrase(copy.formulaSummary, locale);

  const faq = [
    { question: labels.faqUseTitle, answer: labels.faqUseAnswer.replace("{title}", displayTitle) },
    { question: labels.faqFreeTitle, answer: labels.faqFreeAnswer },
    { question: labels.faqPremiumTitle, answer: labels.faqPremiumAnswer },
  ];

  return (
    <section className="sc-authority-block sc-industrial-panel mt-4 min-w-0 p-4 sm:p-5" aria-labelledby="free-tool-authority">
      <h2 id="free-tool-authority" className="sc-premium-report-section__title">
        {labels.howItWorksTitle}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-body-charcoal">
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.descriptionTitle}</h3>
          <p className="mt-1">{displayDescription}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.inputsTitle}</h3>
          <p className="mt-1 break-words">{copy.inputsMeaning}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.formulaTitle}</h3>
          <p className="mt-1">{displayFormulaSummary}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.includesTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{labels.includes1}</li>
            <li>{labels.includes2}</li>
            <li>{labels.includes3}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.estimateMissesTitle}</h3>
          <p className="mt-1">{labels.estimateMissesBody}</p>
        </div>
      </div>

      {premiumHref ? (
        <div className="mt-4 border-t border-technical-gray pt-4">
          <h3 className="font-semibold text-premium-velvet">{labels.relatedPremiumTitle}</h3>
          <Link
            href={premiumHref}
            className="mt-2 inline-block text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
          >
            {labels.relatedPremiumCta}
          </Link>
        </div>
      ) : null}

      {guide && locale === "en" ? (
        <div className="mt-4 border-t border-technical-gray pt-4">
          <h3 className="font-semibold text-premium-velvet">{labels.relatedGuideTitle}</h3>
          <Link
            href={getAuthorityGuideRoutePath(guide.slug)}
            className="mt-2 inline-block text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
          >
            {guide.title}
          </Link>
          <p className="mt-2">
            <Link
              href={`/seo/${getSeoHubSlugForGuide(guide)}`}
              className="text-sm text-body-charcoal underline underline-offset-2 hover:text-premium-velvet"
            >
              {labels.relatedHubTitle}
            </Link>
            {" · "}
            <Link
              href={getIndustryPathForGuide(guide)}
              className="text-sm text-body-charcoal underline underline-offset-2 hover:text-premium-velvet"
            >
              {guide.category.replace("-", " ")}
            </Link>
          </p>
        </div>
      ) : null}

      <div className="mt-4 border-t border-technical-gray pt-4">
        <h3 className="font-semibold text-premium-velvet">{labels.faqTitle}</h3>
        <dl className="mt-3 space-y-3">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-premium-velvet">{item.question}</dt>
              <dd className="mt-1 text-sm text-body-charcoal">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function buildFreeToolAuthorityFaq(
  tool: FreeTrafficTool,
  labels: FreeToolAuthorityBlockProps["labels"],
): readonly { readonly question: string; readonly answer: string }[] {
  return [
    { question: labels.faqUseTitle, answer: labels.faqUseAnswer.replace("{title}", tool.title) },
    { question: labels.faqFreeTitle, answer: labels.faqFreeAnswer },
    { question: labels.faqPremiumTitle, answer: labels.faqPremiumAnswer },
  ];
}
