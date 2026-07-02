
export type ReferenceGraphicTemplate =
  | "box-dimension"
  | "wall-area"
  | "volume"
  | "cylinder-pipe"
  | "stair"
  | "bend-radius"
  | "compressor-leak"
  | "angle"
  | "route"
  | "energy-flow"
  | "machine-time"
  | "financial-flow"
  | "oee-flow"
  | "generic";

/** @deprecated Use wall-area */
export type LegacyAreaTemplate = "area";

export type ReferenceGraphicConfidence = "high" | "medium" | "fallback";

export type ReferenceGraphicField = {
  key: string;
  label?: string;
  unitGroup?: string;
  type?: string;
};

export type ResolveReferenceGraphicInput = {
  locale: AppLocale;
  region?: string;
  toolSlug: string;
  toolTitle?: string;
  toolCategory?: string;
  toolSector?: string;
  tier?: "free" | "premium" | "premium-schema";
  fields: readonly ReferenceGraphicField[];
};

export type ResolvedReferenceGraphic = {
  template: ReferenceGraphicTemplate;
  title: string;
  description: string;
  fieldMap: Record<string, string>;
  activeFieldIds: string[];
  confidence: ReferenceGraphicConfidence;
};

export type GuidanceTier = "free" | "premium" | "premium-schema";

export type ReferenceTemplateProps = {
  activeField?: string | null;
  locale: string;
  labels: Record<string, string>;
};
