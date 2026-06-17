import type { AppLocale } from "@/i18n/routing";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import { resolveBreakdownOutputUnit } from "@/lib/generated-tools/resolve-output-unit";
import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/generated-tools/types";
import type { CalculationReportRow } from "@/lib/pdf/calculation-report-types";

function resolveInputLabel(input: GeneratedToolInput, locale: string): string {
  const localized = input.label_i18n?.[locale as AppLocale];
  return localized ?? input.label_i18n?.en ?? input.label;
}

function formatInputValue(value: unknown, locale: string): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : "—";
  }
  return "—";
}

export function buildPdfExportInputRows(input: {
  readonly schema: GeneratedToolSchema;
  readonly values: Record<string, unknown>;
  readonly locale: string;
}): CalculationReportRow[] {
  return input.schema.inputs.map((field) => ({
    label: resolveInputLabel(field, input.locale),
    value: formatInputValue(input.values[field.id], input.locale),
  }));
}

export function buildPdfExportBreakdownRows(input: {
  readonly schema: GeneratedToolSchema;
  readonly breakdown: Record<string, number | undefined> | null | undefined;
  readonly locale: string;
}): CalculationReportRow[] {
  if (!input.breakdown) {
    return [];
  }

  return Object.entries(input.breakdown)
    .filter(([, value]) => typeof value === "number" && Number.isFinite(value))
    .map(([key, value]) => ({
      label: resolveGeneratedBreakdownLabel(key, input.schema.outputs.breakdown, input.locale),
      value: formatGeneratedNumericValue(
        value as number,
        key,
        input.locale,
        resolveBreakdownOutputUnit(input.schema, key) || undefined,
      ),
    }));
}
