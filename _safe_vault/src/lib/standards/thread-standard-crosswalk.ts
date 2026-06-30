import type { StandardSystem } from "@/lib/standards/engineering-standards-types";

export const THREAD_STANDARD_CROSSWALK: Readonly<Record<string, Partial<Record<StandardSystem, string>>>> = {
  M8: { ISO_METRIC: "M8×1.25", UNC_UNF: "5/16-18", JIS: "M8×1.25" },
  M10: { ISO_METRIC: "M10×1.5", UNC_UNF: "3/8-16", JIS: "M10×1.5" },
  M12: { ISO_METRIC: "M12×1.75", UNC_UNF: "1/2-13", JIS: "M12×1.75" },
};
