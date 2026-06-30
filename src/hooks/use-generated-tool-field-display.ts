"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";
import { resolveGeneratedFieldDisplay } from "@/lib/infrastructure/i18n/generated-field-display";

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

  return useMemo(
    () => resolveGeneratedFieldDisplay(slug, input, locale),
    [
      slug,
      input.id,
      input.label,
      input.label_i18n,
      input.businessContext,
      input.businessContext_i18n,
      locale,
    ],
  );
}
