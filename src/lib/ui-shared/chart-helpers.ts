export const WASTE_TYPE_COLORS: Readonly<Record<string, string>> = {
  overproduction: "#ef4444",
  waiting: "#f97316",
  transport: "#eab308",
  transportation: "#eab308",
  inventory: "#10b981",
  motion: "#3b82f6",
  defects: "#8b5cf6",
  defect: "#8b5cf6",
  overprocessing: "#ec4899",
  default: "#6b7280",
};

const WASTE_KEY_ALIASES: Readonly<Record<string, string>> = {
  transportation: "transport",
  defect: "defects",
  defectcost: "defects",
  overproductioncost: "overproduction",
  waitingcost: "waiting",
  transportcost: "transport",
  inventorycost: "inventory",
  motioncost: "motion",
  overprocessingcost: "overprocessing",
};

export function normalizeWasteTypeKey(key: string): string {
  const stripped = key
    .replace(/([A-Z])/g, (match) => match.toLowerCase())
    .replace(/[_\s-]+/g, "")
    .replace(/cost$/i, "")
    .replace(/co2e$/i, "")
    .toLowerCase();

  return WASTE_KEY_ALIASES[stripped] ?? stripped;
}

export function resolveBreakdownColor(key: string): string {
  const wasteKey = normalizeWasteTypeKey(key);
  return WASTE_TYPE_COLORS[wasteKey] ?? WASTE_TYPE_COLORS.default;
}

export function isKnownWasteTypeKey(key: string): boolean {
  const wasteKey = normalizeWasteTypeKey(key);
  return wasteKey in WASTE_TYPE_COLORS && wasteKey !== "default";
}
