import { isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import {
  formValuesToLocaleContent,
  type CaseStudyLocalePack,
} from "@/lib/features/case-studies/case-study-locale-pack";
import {
  translateCaseStudyLocalePack,
} from "@/lib/features/case-studies/translate-case-study-locales";
import type { CaseStudyFormValues } from "@/lib/features/case-studies/case-study-drafts";
import { formValuesToDraft } from "@/lib/features/case-studies/case-study-drafts";

export type CaseStudyPublishErrorCode = "TRANSLATION_FAILED" | "MISSING_API_KEY";

export type CaseStudyPublishBundle = {
  readonly draft: ReturnType<typeof formValuesToDraft>;
  readonly localeContent: CaseStudyLocalePack;
};

function resolveSourceLocale(values: CaseStudyFormValues): SupportedLocale {
  const candidate = values.sourceLocale.trim();
  return isSupportedLocale(candidate) ? candidate : "en";
}

export async function buildCaseStudyPublishBundle(
  values: CaseStudyFormValues,
): Promise<
  | { readonly ok: true; readonly bundle: CaseStudyPublishBundle }
  | { readonly ok: false; readonly errorCode: CaseStudyPublishErrorCode; readonly message?: string }
> {
  const draft = formValuesToDraft(values);
  const sourceLocale = resolveSourceLocale(values);
  const sourceContent = formValuesToLocaleContent(values);

  const translation = await translateCaseStudyLocalePack(sourceContent, sourceLocale);
  if (!translation.ok) {
    return {
      ok: false,
      errorCode:
        translation.errorCode === "missing_api_key" ? "MISSING_API_KEY" : "TRANSLATION_FAILED",
      message: translation.message,
    };
  }

  const enContent = translation.pack.en;
  return {
    ok: true,
    bundle: {
      draft: {
        ...draft,
        title: enContent.title,
        subtitle: enContent.subtitle,
        industry: enContent.industry,
        challenge: enContent.challenge,
        solution: enContent.solution,
        results: enContent.results,
        testimonial: enContent.testimonial,
      },
      localeContent: translation.pack,
    },
  };
}
