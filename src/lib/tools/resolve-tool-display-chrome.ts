import type { LucideIcon } from "lucide-react";
import { Calculator } from "lucide-react";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveFreeToolFieldDisplay } from "@/lib/i18n/free-tool-form-i18n";
import { isSnakeCaseTechnicalKey } from "@/lib/i18n/locale-field-copy-quality";
import {
  inferFreeTrafficCategory,
  type FreeTrafficCategory,
} from "@/lib/tools/free-traffic-infer";

export type ToolDisplayChrome = {
  readonly summary: string;
  readonly keywordTags: readonly string[];
  readonly categoryId: FreeTrafficCategory;
  readonly icon: LucideIcon;
};

function resolveOneLineSummary(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): string {
  const primary = schema.outputs.primary.trim();
  if (primary.length > 0 && primary.length <= 120 && !isSnakeCaseTechnicalKey(primary)) {
    return primary;
  }

  const description = resolveGeneratedToolDescription(slug, schema, locale).trim();
  if (description.length > 0) {
    const firstSentence = description.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (firstSentence && firstSentence.length <= 160) {
      return firstSentence;
    }
    return description.length > 160 ? `${description.slice(0, 157)}…` : description;
  }

  return resolveGeneratedToolTitle(slug, schema, locale);
}

export function resolveToolKeywordTags(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
  limit = 3,
): readonly string[] {
  const tags = schema.inputs
    .map((input) => {
      const fallbackLabel = resolveGeneratedI18nText(input.label_i18n, locale, input.label).trim();
      const fallbackHelper = resolveGeneratedI18nText(
        input.businessContext_i18n,
        locale,
        input.businessContext,
      ).trim();
      return resolveFreeToolFieldDisplay(slug, input.id, locale, {
        label: fallbackLabel,
        placeholder: fallbackHelper || fallbackLabel,
        helper: fallbackHelper,
      }).label.trim();
    })
    .filter((label) => label.length > 0);

  const unique = [...new Set(tags)];
  return unique.slice(0, limit);
}

export function resolveToolDisplayChrome(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): ToolDisplayChrome {
  const categoryId = inferFreeTrafficCategory(slug);
  const icon = getCategoryCardIcon(categoryId).icon;

  return {
    summary: resolveOneLineSummary(slug, schema, locale),
    keywordTags: resolveToolKeywordTags(slug, schema, locale),
    categoryId,
    icon,
  };
}

export function fallbackToolDisplayIcon(): LucideIcon {
  return Calculator;
}
