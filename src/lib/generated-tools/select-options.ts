import type { GeneratedToolInput } from "@/lib/generated-tools/types";

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

export function firstSelectOptionValue(input: GeneratedToolInput): string | undefined {
  const first = input.options?.[0];
  if (typeof first !== "string" || !first.trim()) {
    return undefined;
  }
  return first;
}
