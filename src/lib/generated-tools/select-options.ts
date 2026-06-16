import type { GeneratedToolInput } from "@/lib/generated-tools/types";
import { resolveGeneratedDisplayText } from "@/lib/generated-tools/resolve-generated-display-text";

export type RawSelectOption =
  | string
  | Readonly<{ readonly value?: unknown; readonly label?: unknown }>;

export function formatSelectOptionLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeSelectOptionValue(option: RawSelectOption): string {
  if (typeof option === "string") {
    return option.trim();
  }
  if (option && typeof option === "object") {
    const value = option.value;
    if (typeof value === "string") {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return String(option).trim();
}

export function normalizeSelectOptionLabel(option: RawSelectOption, value: string): string {
  if (option && typeof option === "object" && typeof option.label === "string") {
    const label = option.label.trim();
    if (label) {
      return label;
    }
  }
  return formatSelectOptionLabel(value);
}

export function normalizeGeneratedSelectOptions(
  raw: unknown,
): { readonly values: readonly string[]; readonly labels: Readonly<Record<string, string>> } | undefined {
  if (!Array.isArray(raw) || raw.length === 0) {
    return undefined;
  }

  const values: string[] = [];
  const labels: Record<string, string> = {};

  for (const entry of raw) {
    const value = normalizeSelectOptionValue(entry as RawSelectOption);
    if (!value) {
      continue;
    }
    values.push(value);
    labels[value] = normalizeSelectOptionLabel(entry as RawSelectOption, value);
  }

  return values.length > 0 ? { values, labels } : undefined;
}

export function resolveSelectOptionDisplay(input: GeneratedToolInput, value: string): string {
  return input.optionLabels?.[value] ?? formatSelectOptionLabel(value);
}

export type GeneratedSelectOptionEntry = {
  readonly value: string;
  readonly label: string;
};

/** Safe select entries for render — accepts legacy object options from raw schemas. */
export function resolveGeneratedSelectOptions(
  input: GeneratedToolInput,
): readonly GeneratedSelectOptionEntry[] {
  const raw = input.options as readonly RawSelectOption[] | null | undefined;
  if (!Array.isArray(raw) || raw.length === 0) {
    return [];
  }

  return raw.map((entry) => {
    const value = normalizeSelectOptionValue(entry);
    const label =
      input.optionLabels?.[value] ?? normalizeSelectOptionLabel(entry, value);
    return { value, label };
  });
}

/** Select options with locale-aware display labels (value stays canonical EN/schema). */
export function resolveLocalizedGeneratedSelectOptions(
  input: GeneratedToolInput,
  locale: string,
): readonly GeneratedSelectOptionEntry[] {
  return resolveGeneratedSelectOptions(input).map((option) => ({
    value: option.value,
    label: resolveGeneratedDisplayText(option.label, locale),
  }));
}

export function firstSelectOptionValue(input: GeneratedToolInput): string | undefined {
  const first = input.options?.[0] as RawSelectOption | undefined;
  if (first === undefined || first === null) {
    return undefined;
  }
  const value = normalizeSelectOptionValue(first);
  return value || undefined;
}
