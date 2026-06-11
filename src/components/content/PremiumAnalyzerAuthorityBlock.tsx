import { Link } from "@/i18n/routing";
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import {
  getAuthorityGuideForPremiumSchema,
  getAuthorityGuideRoutePath,
  getIndustryPathForGuide,
  getSeoHubSlugForGuide,
} from "@/lib/content/authority-links";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { getToolHref } from "@/lib/tools/paths";

export interface PremiumAnalyzerAuthorityBlockProps {
  readonly schema: PremiumCalculatorSchema;
  readonly displayName?: string;
  readonly displayPain?: string;
  readonly labels: {
    readonly whenToUseTitle: string;
    readonly whenToUseBody: string;
    readonly measuresTitle: string;
    readonly promiseTitle: string;
    readonly decidesTitle: string;
    readonly decidesBody: string;
    readonly reportTitle: string;
    readonly reportBullet1: string;
    readonly reportBullet2: string;
    readonly reportBullet3: string;
    readonly reportBullet4: string;
    readonly previewExcludesTitle: string;
    readonly previewExcludesBody: string;
    readonly assumptionsTitle: string;
    readonly faqTitle: string;
    readonly faqMeasureTitle: string;
    readonly faqReportTitle: string;
    readonly faqErpTitle: string;
    readonly faqMeasureAnswer: string;
    readonly faqReportAnswer: string;
    readonly faqErpAnswer: string;
    readonly relatedGuideTitle: string;
    readonly relatedFreeTitle: string;
    readonly relatedHubTitle: string;
    readonly relatedIndustryTitle: string;
    readonly pricingCta: string;
  };
}

function resolveRelatedFreeSlug(schema: PremiumCalculatorSchema): string | null {
  const guide = getAuthorityGuideForPremiumSchema(schema.id);
  if (guide && guide.relatedFreeToolSlugs.length > 0) {
    return guide.relatedFreeToolSlugs[0] ?? null;
  }
  return null;
}

function getCalculatorPromise(schema: PremiumCalculatorSchema, displayName: string): string {
  const title = schema.reportTemplate.title.trim();
  if (title.length > 0) {
    return `${title} with threshold alerts, hidden drivers and export-ready output.`;
  }
  return `Structured hidden-loss calculation summary for ${displayName}.`;
}

export function PremiumAnalyzerAuthorityBlock({
  schema,
  displayName,
  displayPain,
  labels,
}: PremiumAnalyzerAuthorityBlockProps) {
  const resolvedName = displayName ?? schema.name;
  const resolvedPain = displayPain ?? schema.painStatement;
  const guide = getAuthorityGuideForPremiumSchema(schema.id);
  const relatedFreeSlug = resolveRelatedFreeSlug(schema);
  const relatedFreeTool = relatedFreeSlug ? getFreeTrafficToolBySlug(relatedFreeSlug) : null;
  const assumptionNotes = schema.assumptions.assumptionNotes;

  const faq = [
    { question: labels.faqMeasureTitle, answer: labels.faqMeasureAnswer.replace("{name}", resolvedName) },
    { question: labels.faqReportTitle, answer: labels.faqReportAnswer },
    { question: labels.faqErpTitle, answer: labels.faqErpAnswer },
  ];

  return (
    <section
      className="sc-authority-block sc-industrial-panel mt-6 min-w-0 p-4 sm:p-5"
      aria-labelledby="premium-analyzer-authority"
    >
      <h2 id="premium-analyzer-authority" className="sc-premium-report-section__title">
        {labels.whenToUseTitle}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{labels.whenToUseBody}</p>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-body-charcoal">
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.measuresTitle}</h3>
          <p className="mt-1">{resolvedPain}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.promiseTitle}</h3>
          <p className="mt-1">{getCalculatorPromise(schema, resolvedName)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.decidesTitle}</h3>
          <p className="mt-1">{labels.decidesBody}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.reportTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{labels.reportBullet1}</li>
            <li>{labels.reportBullet2}</li>
            <li>{labels.reportBullet3}</li>
            <li>{labels.reportBullet4}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.previewExcludesTitle}</h3>
          <p className="mt-1">{labels.previewExcludesBody}</p>
        </div>
        <div>
          <h3 className="font-semibold text-premium-velvet">{labels.assumptionsTitle}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {assumptionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-technical-gray pt-4">
        {relatedFreeTool ? (
          <Link
            href={getToolHref("free", relatedFreeTool.slug)}
            className="text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
          >
            {labels.relatedFreeTitle}: {relatedFreeTool.title}
          </Link>
        ) : null}
        {guide ? (
          <Link
            href={getAuthorityGuideRoutePath(guide.slug)}
            className="text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
          >
            {labels.relatedGuideTitle}: {guide.title}
          </Link>
        ) : null}
        {guide ? (
          <Link
            href={`/seo/${getSeoHubSlugForGuide(guide)}`}
            className="text-sm text-body-charcoal underline underline-offset-2 hover:text-premium-velvet"
          >
            {labels.relatedHubTitle}
          </Link>
        ) : null}
        {guide ? (
          <Link
            href={getIndustryPathForGuide(guide)}
            className="text-sm text-body-charcoal underline underline-offset-2 hover:text-premium-velvet"
          >
            {labels.relatedIndustryTitle}
          </Link>
        ) : null}
        <Link
          href="/pricing"
          className="text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
        >
          {labels.pricingCta}
        </Link>
      </div>

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

export function buildPremiumAnalyzerAuthorityFaq(
  schema: PremiumCalculatorSchema,
  labels: PremiumAnalyzerAuthorityBlockProps["labels"],
): readonly { readonly question: string; readonly answer: string }[] {
  return [
    { question: labels.faqMeasureTitle, answer: labels.faqMeasureAnswer.replace("{name}", schema.name) },
    { question: labels.faqReportTitle, answer: labels.faqReportAnswer },
    { question: labels.faqErpTitle, answer: labels.faqErpAnswer },
  ];
}
