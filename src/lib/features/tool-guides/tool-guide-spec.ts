export type ToolGuideType =
  | "shape_dimension"
  | "cost_breakdown"
  | "process_flow"
  | "quote_risk"
  | "carbon_flow"
  | "field_map";

export type ToolGuideVisualRole =
  | "primary"
  | "secondary"
  | "driver"
  | "constraint"
  | "output";

export type ToolGuideInputMapEntry = {
  readonly inputKey: string;
  readonly labelKey?: string;
  readonly visualRole: ToolGuideVisualRole;
  readonly nodeId: string;
};

export type ToolGuideSpec = {
  readonly slug: string;
  readonly guideType: ToolGuideType;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly inputMap: readonly ToolGuideInputMapEntry[];
  readonly quality: {
    readonly allowGeneric: false;
    readonly requiresInputMapping: true;
    readonly requiresMobileCheck: true;
  };
};

export const TOOL_GUIDE_QUALITY_DEFAULT = {
  allowGeneric: false as const,
  requiresInputMapping: true as const,
  requiresMobileCheck: true as const,
};
