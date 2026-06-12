import type { StandardSystem } from "@/lib/standards/engineering-standards-types";

export const GDT_STANDARD_MAP: Readonly<Record<StandardSystem, string>> = {
  ASME_Y14_5: "ASME Y14.5 GD&T reference",
  ISO_GPS: "ISO GPS (1101) reference",
  AWS: "Not applicable",
  ISO_EN: "Not applicable",
  JIS: "Not applicable",
  UNC_UNF: "Not applicable",
  ISO_METRIC: "Not applicable",
  ASME_BPVC: "Not applicable",
  PED_EN_13445: "Not applicable",
  ASTM_AISI: "Not applicable",
  EN_DIN: "Not applicable",
  AISC: "Not applicable",
  EUROCODE: "Not applicable",
};
