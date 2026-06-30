import type { StandardSystem } from "@/lib/features/standards/engineering-standards-types";

export const PRESSURE_VESSEL_STANDARD_MAP: Readonly<Record<StandardSystem, string>> = {
  ASME_BPVC: "ASME BPVC Section VIII — reference pre-check only",
  PED_EN_13445: "PED / EN 13445 — reference pre-check only",
  AWS: "Not applicable",
  ISO_EN: "Not applicable",
  JIS: "Not applicable",
  UNC_UNF: "Not applicable",
  ISO_METRIC: "Not applicable",
  ASTM_AISI: "Not applicable",
  EN_DIN: "Not applicable",
  ASME_Y14_5: "Not applicable",
  ISO_GPS: "Not applicable",
  AISC: "Not applicable",
  EUROCODE: "Not applicable",
};
