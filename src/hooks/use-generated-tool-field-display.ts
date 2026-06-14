"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
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
 * Resolution order: schema label_i18n / businessContext_i18n → messages.freeToolInputs → glossary fallback.
 */
export function useGeneratedToolFieldDisplay(
  slug: string,
  input: GeneratedToolInput,
): GeneratedToolFieldDisplay {
  const locale = useLocale();
  const t = useTranslations("freeToolInputs");

  return useMemo(() => {
    const fieldKey = input.id.toLowerCase();
    const messagePrefix = `${slug}.${fieldKey}`;

    let label = resolveGeneratedI18nText(input.label_i18n, locale, input.label);
    let helper = resolveGeneratedI18nText(
      input.businessContext_i18n,
      locale,
      input.businessContext,
    );

    if (t.has(`${messagePrefix}.label`)) {
      label = t(`${messagePrefix}.label`);
    }
    if (t.has(`${messagePrefix}.helper`)) {
      helper = t(`${messagePrefix}.helper`);
    }

    const resolved = resolveFreeToolFieldDisplay(slug, input.id, locale, {
      label,
      placeholder: helper,
      helper,
    });

    return {
      label: resolved.label,
      placeholder: resolved.placeholder,
      helper: resolved.helper ?? helper,
    };
  }, [
    slug,
    input.id,
    input.label,
    input.label_i18n,
    input.businessContext,
    input.businessContext_i18n,
    locale,
    t,
  ]);
}
