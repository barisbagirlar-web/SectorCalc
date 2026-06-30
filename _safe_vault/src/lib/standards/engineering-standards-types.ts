export type EngineeringStandardFamily =
  | "welding"
  | "thread"
  | "pressure-vessel"
  | "material"
  | "gdt"
  | "steel-section";

export type StandardSystem =
  | "AWS"
  | "ISO_EN"
  | "JIS"
  | "UNC_UNF"
  | "ISO_METRIC"
  | "ASME_BPVC"
  | "PED_EN_13445"
  | "ASTM_AISI"
  | "EN_DIN"
  | "ASME_Y14_5"
  | "ISO_GPS"
  | "AISC"
  | "EUROCODE";

export type StandardSelection = {
  readonly family: EngineeringStandardFamily;
  readonly system: StandardSystem;
  readonly labelKey: string;
};

export type StandardResolverInput = {
  readonly region: string;
  readonly toolSlug: string;
  readonly family?: EngineeringStandardFamily;
};
