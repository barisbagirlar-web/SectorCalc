import type { StandardSystem } from "@/lib/features/standards/engineering-standards-types";

export const STEEL_SECTION_STANDARD_MAP: Readonly<Record<StandardSystem, string>> = {
  AISC: "AISC steel section reference",
  EUROCODE: "Eurocode section reference",
  AWS: "Not applicable",
  ISO_EN: "Not applicable",
  JIS: "Not applicable",
  UNC_UNF: "Not applicable",
  ISO_METRIC: "Not applicable",
  ASME_BPVC: "Not applicable",
  PED_EN_13445: "Not applicable",
  ASTM_AISI: "Not applicable",
  EN_DIN: "Not applicable",
  ASME_Y14_5: "Not applicable",
  ISO_GPS: "Not applicable",
};
