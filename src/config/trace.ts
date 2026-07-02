// LOCKED - DO NOT MODIFY without explicit user approval.

export const TRACE_BRAND = {
  name: "Trace",
  tagline: "Find the right tool for your calculation.",
  identityLine: "I help you find the right calculator.",
  proName: "Trace Pro",
  proIdentityLine: "I help Pro users get the most from their tools.",
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
