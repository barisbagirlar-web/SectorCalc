"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { resolveFreeToolFieldDisplay } from "@/lib/i18n/free-tool-form-i18n";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import type { GeneratedToolInput } from "@/lib/generated-tools/types";

export type GeneratedToolFieldDisplay = {
  readonly label: string;
  readonly placeholder: string;
  readonly helper?: string;
};

/**
 * Locale-aware label + businessContext for generated schema forms.
 * Resolution order: schema label_i18n / businessContext_i18n → free-tool-inputs bundle → glossary fallback.
 */
export function useGeneratedToolFieldDisplay(
  slug: string,
  input: GeneratedToolInput,
): GeneratedToolFieldDisplay {
  const locale = useLocale();

  return useMemo(() => {
    const fallbackLabel = resolveGeneratedI18nText(input.label_i18n, locale, input.label);
    const fallbackHelper = resolveGeneratedI18nText(
      input.businessContext_i18n,
      locale,
      input.businessContext,
    );

    const resolved = resolveFreeToolFieldDisplay(slug, input.id, locale, {
      label: fallbackLabel,
      placeholder: fallbackHelper,
      helper: fallbackHelper,
    });

    return {
      label: resolved.label,
      placeholder: resolved.placeholder,
      helper: resolved.helper ?? fallbackHelper,
    };
  }, [
    slug,
    input.id,
    input.label,
    input.label_i18n,
    input.businessContext,
    input.businessContext_i18n,
    locale,
  ]);
}
