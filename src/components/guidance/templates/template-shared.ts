export const GUIDANCE_COLORS = {
  surface: "#ffffff",
  border: "#cbd5e1",
  mutedLine: "#94a3b8",
  line: "#0f172a",
  active: "#2563eb",
  accent: "#c2410c",
  softFill: "rgba(37, 99, 235, 0.08)",
  softOrange: "rgba(194, 65, 12, 0.10)",
} as const;

export type TemplateGraphicProps = {
  readonly fieldMap: Record<string, string>;
  readonly activeFieldKey: string | null;
  readonly labelFor: (canonicalId: string) => string;
};

export function isGraphicFieldActive(
  canonicalId: string,
  activeFieldKey: string | null,
  fieldMap: Record<string, string>,
): boolean {
  if (!activeFieldKey) {
    return false;
  }
  const mapped = fieldMap[activeFieldKey];
  return mapped === canonicalId;
}

export function dimClass(active: boolean): string {
  return active ? "grg-dim grg-dim--active" : "grg-dim";
}

export function labelClass(active: boolean): string {
  return active ? "grg-label grg-label--active" : "grg-label";
}
