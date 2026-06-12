import type { StandardSystem } from "@/lib/standards/engineering-standards-types";

export const MATERIAL_CROSSWALK: Readonly<Record<string, Partial<Record<StandardSystem, string>>>> = {
  "A36": { ASTM_AISI: "A36", EN_DIN: "S235JR", JIS: "SS400" },
  "304": { ASTM_AISI: "304", EN_DIN: "1.4301", JIS: "SUS304" },
  "6061": { ASTM_AISI: "6061-T6", EN_DIN: "AW-6061", JIS: "A6061" },
};
