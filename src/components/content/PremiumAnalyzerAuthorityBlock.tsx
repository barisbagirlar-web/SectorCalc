"use client";

import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

interface PremiumAnalyzerAuthorityLabels {
  whenToUseTitle: string;
  whenToUseBody: string;
  measuresTitle: string;
  promiseTitle: string;
  promiseBody: string;
  decidesTitle: string;
  decidesBody: string;
  reportTitle: string;
  reportBullet1: string;
  reportBullet2: string;
  reportBullet3: string;
  reportBullet4: string;
  previewExcludesTitle: string;
  previewExcludesBody: string;
  assumptionsTitle: string;
  faqTitle: string;
  faqMeasureTitle: string;
  faqReportTitle: string;
  faqErpTitle: string;
  faqMeasureAnswer: string;
  faqReportAnswer: string;
  faqErpAnswer: string;
  relatedGuideTitle: string;
  relatedFreeTitle: string;
  relatedHubTitle: string;
  relatedIndustryTitle: string;
  pricingCta: string;
}

interface PremiumAnalyzerAuthorityBlockProps {
  schema: PremiumCalculatorSchema;
  locale: string;
  displayName: string;
  displayPain: string;
  labels: PremiumAnalyzerAuthorityLabels;
}

export function PremiumAnalyzerAuthorityBlock({
  schema,
  locale,
  displayName,
  displayPain,
  labels,
}: PremiumAnalyzerAuthorityBlockProps) {
  return (
    <section
      className="mt-8 rounded-lg border border-[#BD5D3A]/20 bg-[#F0EEE6] p-5"
      aria-labelledby="premium-authority-heading"
    >
      <h2
        id="premium-authority-heading"
        className="text-xs font-bold uppercase tracking-widest text-[#BD5D3A]"
      >
        {labels.whenToUseTitle}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#1A1915]/70">
        {labels.whenToUseBody}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full border border-[#BD5D3A]/20 bg-[#BD5D3A]/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#BD5D3A]">
          ISO Standards
        </span>
        <span className="inline-flex items-center rounded-full border border-[#1A1915]/15 bg-[#1A1915]/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#1A1915]/60">
          Engineering Review
        </span>
        <span className="inline-flex items-center rounded-full border border-[#1A1915]/15 bg-[#1A1915]/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#1A1915]/60">
          Decision Support
        </span>
      </div>
    </section>
  );
}

export default PremiumAnalyzerAuthorityBlock;
