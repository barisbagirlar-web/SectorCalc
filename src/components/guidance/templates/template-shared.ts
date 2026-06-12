export const GUIDANCE_COLORS = {
  surface: "#ffffff",
  border: "#cbd5e1",
  mutedLine: "#94a3b8",
  line: "#0f172a",
  active: "#4a5cf5",
  accent: "#c2410c",
  softFill: "rgba(74, 92, 245, 0.08)",
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

function rgClass(base: string, active: boolean, pulse = false): string {
  return [base, active ? "is-active" : null, active && pulse ? "rg-pulse" : null]
    .filter(Boolean)
    .join(" ");
}

export function rgLine(canonicalId: string, active: boolean): { className: string; "data-field": string } {
  return {
    "data-field": canonicalId,
    className: rgClass("rg-line grg-dim", active),
  };
}

export function rgShape(canonicalId: string, active: boolean): { className: string; "data-field": string } {
  return {
    "data-field": canonicalId,
    className: rgClass("rg-shape grg-region", active),
  };
}

export function rgLabel(canonicalId: string, active: boolean): { className: string; "data-field": string } {
  return {
    "data-field": canonicalId,
    className: rgClass("rg-label grg-label", active),
  };
}

export function dimClass(active: boolean): string {
  return active ? "rg-line grg-dim grg-dim--active is-active" : "rg-line grg-dim";
}

export function labelClass(active: boolean): string {
  return active ? "rg-label grg-label grg-label--active is-active" : "rg-label grg-label";
}

export function shapeClass(active: boolean): string {
  return active ? "rg-shape grg-region grg-region--active is-active" : "rg-shape grg-region";
}
