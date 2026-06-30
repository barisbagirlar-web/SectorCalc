/** Premium Guide Spec Engine — tool-specific guide types (P3). */

export type ToolGuideType =
  | "shape_dimension"
  | "cost_breakdown"
  | "process_flow"
  | "quote_risk"
  | "carbon_flow"
  | "field_map"
  | "unit_conversion"
  | "margin_breakdown"
  | "loss_tree";

export type ToolGuideVisualRole =
  | "primary"
  | "secondary"
  | "driver"
  | "constraint"
  | "output";

export type ToolGuideInputMapEntry = {
  readonly inputKey: string;
  readonly labelKey?: string;
  readonly unit?: string;
  readonly visualRole: ToolGuideVisualRole;
  readonly nodeId?: string;
};

export type ToolGuideVisualBlock = {
  readonly id: string;
  readonly role: ToolGuideVisualRole;
  readonly linkedInputKeys: readonly string[];
};

export type ToolGuideSpec = {
  readonly slug: string;
  readonly guideType: ToolGuideType;
  readonly titleKey?: string;
  readonly descriptionKey?: string;
  readonly inputMap: readonly ToolGuideInputMapEntry[];
  readonly visualBlocks?: readonly ToolGuideVisualBlock[];
  readonly warnings?: readonly string[];
  readonly localeKeys?: readonly string[];
  readonly isGenericFallback: false;
};

export type ToolGuideAuditDecision =
  | "eligible"
  | "hide_guide"
  | "needs_spec"
  | "generic_blocked"
  | "manual_design_review";

export type ToolGuidePolicyDecision = {
  readonly slug: string;
  readonly decision: ToolGuideAuditDecision;
  readonly guideEligible: boolean;
  readonly hasGuideSpec: boolean;
  readonly hasInputMap: boolean;
  readonly isToolSpecificGuide: boolean;
  readonly isGenericFallback: boolean;
  readonly guideType?: ToolGuideType;
  readonly findings: readonly string[];
};
