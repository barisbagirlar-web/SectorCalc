/** Status accent classes - use ONLY for data signals, never decoration */
export type StatusLevel = "critical" | "warning" | "safe" | "neutral";

export const STATUS_TEXT_CLASS: Record<StatusLevel, string> = {
  critical: "status-crit text-crit-red",
  warning: "status-warn text-warn-amber",
  safe: "status-safe text-safe-green",
  neutral: "text-slate-gray",
};

export const STATUS_BG_CLASS: Record<Exclude<StatusLevel, "neutral">, string> = {
  critical: "status-crit-bg",
  warning: "status-warn-bg",
  safe: "status-safe-bg",
};

export function riskLevelToStatus(level: string): StatusLevel {
  const normalized = level.toUpperCase();
  if (normalized === "HIGH" || normalized === "CRITICAL" || normalized === "DANGER") {
    return "critical";
  }
  if (normalized === "MEDIUM" || normalized === "WATCH" || normalized === "WARNING") {
    return "warning";
  }
  if (normalized === "LOW" || normalized === "SAFE") {
    return "safe";
  }
  return "neutral";
}
