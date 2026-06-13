import { resolveReferenceGraphic } from "@/lib/guidance/reference-graphic-resolver";
import type { ReferenceGraphicField } from "@/lib/guidance/reference-graphic-types";
import { ERT_PROBLEM_SLUG } from "@/lib/tools/runtime-trust-engine";
import { getToolGuideSpec } from "@/lib/tool-guides/premium-input-guide-specs";
import { resolveToolFormInputKeys } from "@/lib/tool-guides/resolve-tool-form-input-keys";
import type { ToolGuideSpec } from "@/lib/tool-guides/tool-guide-spec";

export type InputGuideStatus = "eligible" | "hidden" | "blocked";

export type InputGuideFinding =
  | "missing_guide_spec"
  | "generic_fallback_detected"
  | "missing_input_key_mapping"
  | "input_key_mismatch"
  | "irrelevant_visual_domain"
  | "low_quality_generic_copy"
  | "mobile_overflow_risk"
  | "unsupported_tool_family";

export type InputGuideDecision = {
  readonly slug: string;
  readonly status: InputGuideStatus;
  readonly shouldRender: boolean;
  readonly findings: readonly InputGuideFinding[];
  readonly guideType?: ToolGuideSpec["guideType"];
  readonly spec?: ToolGuideSpec;
};

const SUPPORTED_GUIDE_TYPES = new Set<ToolGuideSpec["guideType"]>([
  "shape_dimension",
  "cost_breakdown",
  "process_flow",
  "quote_risk",
]);

function validateInputMap(spec: ToolGuideSpec, formInputKeys: readonly string[]): InputGuideFinding[] {
  const findings: InputGuideFinding[] = [];
  const formKeySet = new Set(formInputKeys);

  if (spec.inputMap.length === 0) {
    findings.push("missing_input_key_mapping");
    return findings;
  }

  const missingKeys = spec.inputMap.filter((entry) => !formKeySet.has(entry.inputKey));
  if (missingKeys.length > 0) {
    findings.push("input_key_mismatch");
  }

  return findings;
}

/** Detect whether legacy guided-reference resolver would emit a generic fallback diagram. */
export function wouldLegacyGenericGuideRender(
  slug: string,
  formInputKeys: readonly string[],
): boolean {
  const fields: ReferenceGraphicField[] = formInputKeys.map((key) => ({
    key,
    label: key,
  }));

  const resolved = resolveReferenceGraphic({
    locale: "en",
    toolSlug: slug,
    tier: "premium",
    fields,
  });

  return resolved.template === "generic" && resolved.confidence === "fallback";
}

export function evaluateInputGuideDecision(
  slug: string,
  formInputKeys?: readonly string[],
): InputGuideDecision {
  const normalizedSlug = slug.trim();
  const keys = formInputKeys ?? resolveToolFormInputKeys(normalizedSlug);
  const spec = getToolGuideSpec(normalizedSlug);
  const findings: InputGuideFinding[] = [];

  if (!spec) {
    if (wouldLegacyGenericGuideRender(normalizedSlug, keys)) {
      findings.push("generic_fallback_detected");
    }
    findings.push("missing_guide_spec");
    return {
      slug: normalizedSlug,
      status: normalizedSlug === ERT_PROBLEM_SLUG ? "blocked" : "hidden",
      shouldRender: false,
      findings,
    };
  }

  return evaluateToolGuideSpecDecision(normalizedSlug, spec, keys);
}

/** Evaluate a concrete guide spec (audit / test hook). */
export function evaluateToolGuideSpecDecision(
  slug: string,
  spec: ToolGuideSpec,
  formInputKeys: readonly string[],
): InputGuideDecision {
  const findings: InputGuideFinding[] = [];

  if (!SUPPORTED_GUIDE_TYPES.has(spec.guideType)) {
    findings.push("unsupported_tool_family");
    return {
      slug,
      status: "blocked",
      shouldRender: false,
      findings,
      guideType: spec.guideType,
      spec,
    };
  }

  const mapFindings = validateInputMap(spec, formInputKeys);
  findings.push(...mapFindings);

  if (findings.includes("input_key_mismatch")) {
    return {
      slug,
      status: "blocked",
      shouldRender: false,
      findings,
      guideType: spec.guideType,
      spec,
    };
  }

  if (findings.length > 0) {
    return {
      slug,
      status: "hidden",
      shouldRender: false,
      findings,
      guideType: spec.guideType,
      spec,
    };
  }

  return {
    slug,
    status: "eligible",
    shouldRender: true,
    findings,
    guideType: spec.guideType,
    spec,
  };
}

export function shouldRenderInputGuide(slug: string, formInputKeys?: readonly string[]): boolean {
  return evaluateInputGuideDecision(slug, formInputKeys).shouldRender;
}

export type InputGuideTrustFinding =
  | "bad_input_guide"
  | "generic_input_guide"
  | "input_guide_mapping_mismatch";

/** Runtime Trust Engine hook — surfaces guide quality risks without rendering generic guides. */
export function collectInputGuideTrustFindings(
  slug: string,
  formInputKeys?: readonly string[],
): readonly InputGuideTrustFinding[] {
  const keys = formInputKeys ?? resolveToolFormInputKeys(slug);
  const decision = evaluateInputGuideDecision(slug, keys);
  const trustFindings: InputGuideTrustFinding[] = [];

  if (decision.findings.includes("generic_fallback_detected")) {
    trustFindings.push("generic_input_guide", "bad_input_guide");
  }

  if (decision.findings.includes("input_key_mismatch")) {
    trustFindings.push("input_guide_mapping_mismatch", "bad_input_guide");
  }

  if (
    !decision.shouldRender &&
    decision.findings.includes("missing_guide_spec") &&
    wouldLegacyGenericGuideRender(slug, keys)
  ) {
    if (!trustFindings.includes("generic_input_guide")) {
      trustFindings.push("generic_input_guide");
    }
    if (!trustFindings.includes("bad_input_guide")) {
      trustFindings.push("bad_input_guide");
    }
  }

  return trustFindings;
}
