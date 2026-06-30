import { ERT_PROBLEM_SLUG } from "@/lib/features/tools/runtime-trust-engine";
import { isGuideExplicitlyBlocked } from "@/lib/features/tools/guide/tool-guide-blocklist";
import {
  evaluateInputGuideDecision,
  wouldLegacyGenericGuideRender,
} from "@/lib/features/tool-guides/input-guide-policy";
import { resolveToolFormInputKeys } from "@/lib/features/tool-guides/resolve-tool-form-input-keys";
import { getPremiumGuideSpec } from "@/lib/features/tools/guide/tool-guide-registry";
import type {
  ToolGuideAuditDecision,
  ToolGuidePolicyDecision,
  ToolGuideSpec,
} from "@/lib/features/tools/guide/tool-guide-types";

const SUPPORTED_GUIDE_TYPES = new Set<ToolGuideSpec["guideType"]>([
  "shape_dimension",
  "cost_breakdown",
  "process_flow",
  "quote_risk",
  "carbon_flow",
  "field_map",
  "unit_conversion",
  "margin_breakdown",
  "loss_tree",
]);

function mapLegacyDecision(
  slug: string,
  formInputKeys: readonly string[],
): ToolGuidePolicyDecision {
  const spec = getPremiumGuideSpec(slug);
  const legacy = evaluateInputGuideDecision(slug, formInputKeys);
  const genericFallback =
    !spec &&
    (legacy.findings.includes("generic_fallback_detected") ||
      wouldLegacyGenericGuideRender(slug, formInputKeys));

  const hasGuideSpec = spec !== null;
  const hasInputMap = Boolean(spec && spec.inputMap.length > 0);
  const isToolSpecificGuide = hasGuideSpec && spec.isGenericFallback === false;
  const isGenericFallback = genericFallback;

  const guideEligible =
    hasGuideSpec && hasInputMap && isToolSpecificGuide && !isGenericFallback;

  let decision: ToolGuideAuditDecision = "hide_guide";

  if (slug === ERT_PROBLEM_SLUG || isGuideExplicitlyBlocked(slug) || isGenericFallback) {
    decision = "generic_blocked";
  } else if (!hasGuideSpec) {
    decision = "needs_spec";
  } else if (!hasInputMap || legacy.findings.includes("input_key_mismatch")) {
    decision = "manual_design_review";
  } else if (
    spec &&
    (!SUPPORTED_GUIDE_TYPES.has(spec.guideType) ||
      legacy.findings.includes("unsupported_tool_family"))
  ) {
    decision = "manual_design_review";
  } else if (guideEligible && legacy.shouldRender) {
    decision = "eligible";
  } else {
    decision = "hide_guide";
  }

  return {
    slug,
    decision,
    guideEligible,
    hasGuideSpec,
    hasInputMap,
    isToolSpecificGuide,
    isGenericFallback,
    guideType: spec?.guideType,
    findings: [...legacy.findings],
  };
}

export function evaluateToolGuidePolicy(
  slug: string,
  formInputKeys?: readonly string[],
): ToolGuidePolicyDecision {
  const keys = formInputKeys ?? resolveToolFormInputKeys(slug.trim());
  return mapLegacyDecision(slug.trim(), keys);
}

export function shouldRenderPremiumGuide(
  slug: string,
  formInputKeys?: readonly string[],
): boolean {
  return evaluateToolGuidePolicy(slug, formInputKeys).guideEligible;
}
