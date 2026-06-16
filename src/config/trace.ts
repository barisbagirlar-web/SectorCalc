/**
 * Trace — SectorCalc intelligent assistant brand config.
 * Customer-facing AI identity (distinct from Trust Trace™ report validation).
 */
export const TRACE_BRAND = {
  name: "Trace",
  fullTitle: "SectorCalc Calculation Trailblazer",
  tagline: "Follow me to your true cost.",
  identityLine: "I track the math behind your industry.",
  proName: "Trace Pro",
  proIdentityLine: "I pursue the mathematical proof behind your decisions.",
  avatar: "/images/trace-avatar.svg",
  colors: {
    gold: "#d4af37",
    navy: "#0F172A",
  },
} as const;

export function resolveTraceName(fromEnv?: string): string {
  const trimmed = fromEnv?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : TRACE_BRAND.name;
}

export function resolveTraceTagline(fromEnv?: string): string {
  const trimmed = fromEnv?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : TRACE_BRAND.tagline;
}
