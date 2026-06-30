"use client";

import { useTranslations } from "next-intl";
import type {
  ResolvedToolAboutContent,
  ResolvedToolAboutExample,
  ResolvedToolAboutFaq,
} from "@/lib/generated-tools/resolve-tool-about";

export type ToolDescriptionProps = {
  readonly content: ResolvedToolAboutContent;
  readonly isPremium: boolean;
};

function ToolAboutExample({ example }: { readonly example: ResolvedToolAboutExample }) {
  const t = useTranslations("generatedTool.aboutTool");

  return (
    <section className="mt-8" aria-labelledby="tool-about-example-title">
      <h3 id="tool-about-example-title" className="text-lg font-semibold text-text-primary">
        {t("exampleTitle")}: {example.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{example.scenario}</p>
      <div className="mt-3 rounded-lg border border-border-subtle bg-surface-cream p-4">
        <p className="text-sm font-medium text-text-primary">{t("solutionSteps")}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-body-charcoal">
          {example.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="mt-3 border-l-4 border-deep-navy bg-surface-cream/80 p-4">
        <p className="text-sm font-medium text-deep-navy">{t("resultLabel")}</p>
        <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{example.result}</p>
      </div>
    </section>
  );
}

function ToolAboutFaqs({ faqs }: { readonly faqs: readonly ResolvedToolAboutFaq[] }) {
  const t = useTranslations("generatedTool.aboutTool");

  return (
    <section className="mt-8" aria-labelledby="tool-about-faq-title">
      <h3 id="tool-about-faq-title" className="text-lg font-semibold text-text-primary">
        {t("faqTitle")}
      </h3>
      <dl className="mt-4 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="border-b border-border-subtle pb-4 last:border-b-0">
            <dt className="text-sm font-medium text-text-primary">{faq.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-body-charcoal">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ToolDescription({ content, isPremium }: ToolDescriptionProps) {
  const t = useTranslations("generatedTool.aboutTool");
  const purposeTitle = isPremium ? t("purposeTitlePremium") : t("purposeTitleFree");
  const longDescription = content.description.long.trim();

  if (!longDescription && !content.example && content.faqs.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-8 border-t border-border-subtle pt-8"
      aria-label={t("sectionLabel")}
    >
      {longDescription ? (
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{purposeTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{longDescription}</p>
        </div>
      ) : null}

      {content.example ? <ToolAboutExample example={content.example} /> : null}

      {content.faqs.length > 0 ? <ToolAboutFaqs faqs={content.faqs} /> : null}
    </section>
  );
}
