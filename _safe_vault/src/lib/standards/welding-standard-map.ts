import type { StandardSystem } from "@/lib/standards/engineering-standards-types";

export const WELDING_STANDARD_MAP: Readonly<Record<StandardSystem, string>> = {
  AWS: "AWS D1.1 reference context",
  ISO_EN: "ISO 5817 / EN reference context",
  JIS: "JIS Z reference context",
  UNC_UNF: "Not applicable",
  ISO_METRIC: "Not applicable",
  ASME_BPVC: "Not applicable",
  PED_EN_13445: "Not applicable",
  ASTM_AISI: "Not applicable",
  EN_DIN: "Not applicable",
  ASME_Y14_5: "Not applicable",
  ISO_GPS: "Not applicable",
  AISC: "Not applicable",
  EUROCODE: "Not applicable",
};
