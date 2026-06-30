/**
 * RC Beam Shear & Flexure Tool Schema
 * Schema-driven definition for PRO_117
 * Transforms JSON validation/fmea/standards into the format
 * expected by the universal renderer components.
 */

import type { LegacyToolSchema, ToolSchemaValidationRule, ToolSchemaFMEAItem, ToolSchemaOutput } from "./types-legacy";
import RCBeamTool from "../../../../data/pro-tools/PRO_117.json";

const raw: any = RCBeamTool;

// Convert validation object → array format
function parseValidationRules(rules: Record<string, any> | undefined): ToolSchemaValidationRule[] {
  if (!rules) return [];
  return Object.entries(rules).map(([key, rule]: [string, any]) => ({
    id: key,
    action: rule.action || "BLOCK",
    condition: rule.condition || "",
    message: rule.error_msg || "",
    standard_ref: rule.standard_ref || "",
  }));
}

// Convert FMEA data
function parseFMEA(items: any[] | undefined): ToolSchemaFMEAItem[] {
  if (!items) return [];
  return items.map((item: any) => ({
    failureMode: item.failureMode || "",
    effect: item.effect || item.description || "",
    description: item.description || "",
    severity: item.severity || "MEDIUM",
    occurrence: item.occurrence || 3,
    likelihood: item.occurrence || 3,
    detection: item.detection || 3,
    rpn: item.rpn || item.rpn_high || 0,
    rpn_high: item.rpn_high || item.rpn || 0,
    rpn_low: item.rpn_low || 0,
    condition: item.condition || "",
    control_measure: item.control_measure || "",
  }));
}

const rcBeamToolSchema: LegacyToolSchema = {
  ...raw,
  tool_key: "rcBeam",
  title: raw.tool_name,
  standards: raw.engine_rules?.standards || ["EN 1992-1-1", "ACI 318", "ISO 9001", "GUM"],

  outputs: (raw.outputs || []).map((o: any) => ({
    id: o.id,
    name: o.name || o.id,
    unit: o.unit || "",
    group: o.group || "results",
  })),

  inputs: (raw.inputs || []).map((inp: any) => {
    const enhanced: any = { ...inp };
    if (inp.conditional_on) {
      enhanced.visibleWhen = {
        field: inp.conditional_on.field,
        equals: inp.conditional_on.value,
      };
    }
    if (!enhanced.symbol) enhanced.symbol = inp.id;
    if (inp.type === "number" && !enhanced.resolution) {
      enhanced.resolution = 0.001;
    }
    return enhanced;
  }),

  validationRules: parseValidationRules(raw.engine_rules?.validation),
  fmea: parseFMEA(raw.engine_rules?.fmea),

  engine_rules: {
    ...raw.engine_rules,
    uc_threshold: raw.engine_rules?.uc_threshold || {
      pass_max: 0.9,
      warn_max: 1.0,
      fail_min: 1.0,
    },
  },
};

export default rcBeamToolSchema;
