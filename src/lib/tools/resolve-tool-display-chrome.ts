import type { LucideIcon } from "lucide-react";
import { Calculator } from "lucide-react";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveGeneratedFieldDisplay } from "@/lib/i18n/generated-field-display";
import { isSnakeCaseTechnicalKey } from "@/lib/i18n/locale-field-copy-quality";
import {
  inferFreeTrafficCategory,
  type FreeTrafficCategory,
} from "@/lib/tools/free-traffic-infer";

export type ToolDisplayChrome = {
  readonly summary: string;
  readonly keywordTags: readonly string[];
  readonly categoryId: string;
  readonly icon: LucideIcon;
};

function isFormulaOutputKey(value: string, schema: GeneratedToolSchema): boolean {
  const trimmed = value.trim();
  if (!trimmed || isSnakeCaseTechnicalKey(trimmed)) {
    return Boolean(trimmed);
  }

  const formulaKeys = new Set([
    ...Object.keys(schema.formulas ?? {}),
    ...Object.keys(schema.outputs.breakdown ?? {}),
  ]);
  return formulaKeys.has(trimmed);
}

function resolveOneLineSummary(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): string {
  const primary = schema.outputs.primary.trim();
  if (
    primary.length > 0 &&
    primary.length <= 120 &&
    !isSnakeCaseTechnicalKey(primary) &&
    !isFormulaOutputKey(primary, schema)
  ) {
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
    .map((input) => resolveGeneratedFieldDisplay(slug, input, locale).label.trim())
    .filter((label) => label.length > 0);

  const unique = [...new Set(tags)];
  return unique.slice(0, limit);
}

function resolveDisplayCategoryId(
  slug: string,
  schema: GeneratedToolSchema,
): FreeTrafficCategory | string {
  const catalogCategory = schema.catalogCategory?.trim();
  if (catalogCategory) {
    return catalogCategory;
  }
  return inferFreeTrafficCategory(slug);
}

export function resolveToolDisplayChrome(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): ToolDisplayChrome {
  const categoryId = resolveDisplayCategoryId(slug, schema);
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
