// SECTORCALC FREE V5.3.1 SERVER-ONLY FORMULA MODULE
// TOOL: Von Mises Stress Calculator
// TOOL_ID: FREE_278_VON_MISES_STRESS_CALCULATOR
// TOOL_KEY: von-mises-stress-calculator
// CATEGORY: mechanical_design_strength_analysis
// FUNNEL_TARGET: Structural Integrity PRO
// RISK_LEVEL: HIGH
// PUBLIC FORMULA EXPOSURE: FORBIDDEN
// CLIENT FORMULA EXECUTION: FORBIDDEN
// LLM RUNTIME USAGE: FORBIDDEN
// PRECISION: All stress arithmetic is performed with Big.js (CR-1 compliant).
// THEORY: Maximum Distortion Energy Theory (Hencky-von Mises Yield Criterion).
// MODEL: 2D plane-stress state (sigma_z = 0, tau_xz = 0, tau_yz = 0).
// EQUATION: sigma_vm = sqrt(sigma_x^2 - sigma_x*sigma_y + sigma_y^2 + 3*tau_xy^2)
// REFERENCE: ASME BPVC Section VIII Division 2 Part 5; ISO 12100:2010.

import Big from "big.js";
import type {
  FreeV531ExecuteResponse,
  FreeV531FormulaModule,
  FreeV531InputSpec,
  FreeV531OutputMetric,
  FreeV531Warning,
} from "./types";
import { buildAuditSeal, deriveStatus, finiteNumber, outputMetric, warning } from "./shared";

const TOOL_ID = "FREE_278_VON_MISES_STRESS_CALCULATOR";
const TOOL_KEY = "von-mises-stress-calculator";
const TOOL_NAME = "Von Mises Stress Calculator";
const CATEGORY = "mechanical_design_strength_analysis";
const FUNNEL_TARGET = "Structural Integrity PRO";
const PRIMARY_METRIC_ID = "von_mises_stress";
const DEFAULT_DECISION_STATE = "PASS" as const;
const DEFAULT_TARGET_FOS = 1.5;

export const runtimeBoundary = "SERVER_ONLY" as const;
export const publicFormulaExpressionPolicy = "FORBIDDEN" as const;
export const llmRuntimeUsage = "FORBIDDEN" as const;
export const clientFormulaExecution = "FORBIDDEN" as const;

export const inputs: readonly FreeV531InputSpec[] = [
  {
    id: "sigma_x",
    label: "Normal Stress X (sigma_x)",
    quantityKind: "stress",
    required: true,
    criticality: "HIGH",
    baseUnit: "MPa",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Normal stress component acting on the X face, in MPa. Tension positive, compression negative.",
  },
  {
    id: "sigma_y",
    label: "Normal Stress Y (sigma_y)",
    quantityKind: "stress",
    required: true,
    criticality: "HIGH",
    baseUnit: "MPa",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Normal stress component acting on the Y face, in MPa. Tension positive, compression negative.",
  },
  {
    id: "tau_xy",
    label: "Shear Stress XY (tau_xy)",
    quantityKind: "stress",
    required: true,
    criticality: "HIGH",
    baseUnit: "MPa",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "In-plane shear stress component, in MPa. Sign does not affect the equivalent stress.",
  },
  {
    id: "yield_strength",
    label: "Material Yield Strength (Re)",
    quantityKind: "stress",
    required: true,
    criticality: "HIGH",
    baseUnit: "MPa",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NO_DEFAULT_ALLOWED",
    publicHelpText: "Minimum specified yield strength of the material, in MPa (e.g. structural steel S235 = 235). Must be greater than zero.",
  },
  {
    id: "target_fos",
    label: "Target Factor of Safety",
    quantityKind: "dimensionless",
    required: true,
    criticality: "MEDIUM",
    baseUnit: "user_unit",
    sourceStatus: "USER_VERIFIED",
    defaultPolicy: "NON_CRITICAL_SAFE_DEFAULT",
    publicHelpText: "Required design factor of safety against yield. Defaults to 1.5 when left blank.",
  },
];

function readTargetFos(raw: unknown): number {
  if (raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "")) {
    return DEFAULT_TARGET_FOS;
  }
  const parsed = finiteNumber(raw, "target_fos");
  if (parsed <= 0) {
    throw new Error("BLOCKED_NON_POSITIVE_TARGET_FOS:target_fos");
  }
  return parsed;
}

export function execute(rawInputs: Readonly<Record<string, unknown>>): FreeV531ExecuteResponse {
  const sigmaX = finiteNumber(rawInputs["sigma_x"], "sigma_x");
  const sigmaY = finiteNumber(rawInputs["sigma_y"], "sigma_y");
  const tauXy = finiteNumber(rawInputs["tau_xy"], "tau_xy");
  const yieldStrength = finiteNumber(rawInputs["yield_strength"], "yield_strength");
  const targetFos = readTargetFos(rawInputs["target_fos"]);

  if (new Big(yieldStrength).lte(0)) {
    throw new Error("BLOCKED_NON_POSITIVE_YIELD_STRENGTH:yield_strength");
  }

  // Maximum Distortion Energy Theory, 2D plane stress:
  // sigma_vm = sqrt(sigma_x^2 - sigma_x*sigma_y + sigma_y^2 + 3*tau_xy^2)
  const bigSx = new Big(sigmaX);
  const bigSy = new Big(sigmaY);
  const bigTxy = new Big(tauXy);
  const distortionTerm = bigSx
    .pow(2)
    .minus(bigSx.times(bigSy))
    .plus(bigSy.pow(2))
    .plus(bigTxy.pow(2).times(3));

  if (distortionTerm.lte(0)) {
    throw new Error("BLOCKED_ZERO_EQUIVALENT_STRESS:sigma_x");
  }

  const vonMisesStress = distortionTerm.sqrt();
  const factorOfSafety = new Big(yieldStrength).div(vonMisesStress);

  const normalized: Record<string, number> = {
    n_sigma_x: sigmaX,
    n_sigma_y: sigmaY,
    n_tau_xy: tauXy,
    n_yield_strength: yieldStrength,
    n_target_fos: targetFos,
  };

  const outputs: FreeV531OutputMetric[] = [
    outputMetric(
      "von_mises_stress",
      Number(vonMisesStress),
      "MPa",
      "PRIMARY_DECISION",
      "Von Mises equivalent stress from the maximum distortion energy theory, computed by the protected server-side plane-stress kernel.",
    ),
    outputMetric(
      "factor_of_safety",
      Number(factorOfSafety),
      "ratio",
      "BUSINESS_IMPACT",
      "Factor of safety against yield is the material yield strength divided by the von Mises equivalent stress, computed by the protected server-side kernel.",
    ),
  ];

  const bigTargetFos = new Big(targetFos);
  const warnings: FreeV531Warning[] = [];

  // Decision state mapping (Hencky-von Mises criterion):
  //   SAFE                 -> FoS >= target_fos            -> status PASS
  //   MARGINAL             -> 1.0 < FoS < target_fos       -> status REVIEW
  //   YIELDING / FAILURE   -> FoS <= 1.0                    -> status REJECT
  if (factorOfSafety.lte(1)) {
    warnings.push(
      warning(
        "REJECT",
        "YIELDING / FAILURE: the von Mises equivalent stress meets or exceeds the material yield strength (factor of safety at or below 1.0).",
        "Reduce the applied load, increase the section, or select a higher-strength material; unlock the PRO target for full elastic-plastic and fatigue verification.",
      ),
    );
  } else if (factorOfSafety.lt(bigTargetFos)) {
    warnings.push(
      warning(
        "REVIEW",
        "MARGINAL: the component does not yield but the factor of safety is below the target design margin.",
        "Increase the design margin or verify the load case; unlock the PRO target for scenario, sensitivity, and proof pack.",
      ),
    );
  }

  // Plane-stress modelling assumption disclosure (INFO does not change status).
  warnings.push(
    warning(
      "INFO",
      "Assumption: results use a 2D plane-stress state (sigma_z = 0, tau_xz = 0, tau_yz = 0). For a general 3D stress state, use the full triaxial analysis.",
      "Confirm the stress state is plane before relying on this screening result.",
    ),
  );

  const auditSeal = buildAuditSeal(TOOL_ID, TOOL_KEY, normalized, outputs);
  return {
    status: deriveStatus(warnings, DEFAULT_DECISION_STATE),
    toolId: TOOL_ID,
    toolKey: TOOL_KEY,
    primaryMetricId: PRIMARY_METRIC_ID,
    outputs,
    warnings,
    hiddenRiskSummary:
      "The free result is a screening-level structural check based on the maximum distortion energy theory in a 2D plane-stress state. The hidden risk is unverified stress inputs, stress concentration and notch effects, fatigue and cyclic loading, temperature and material variability, and 3D stress components that this plane-stress screen omits.",
    nextAction:
      "Use the factor of safety to decide whether to proceed, revise the design, or escalate for detailed analysis. For certification or audit-facing evidence, unlock the linked PRO workflow.",
    proUnlockReason:
      "Unlock Structural Integrity PRO for principal-stress decomposition, triaxial and fatigue checks, material presets, PDF proof pack, audit seal export, and decision history.",
    redactionStatus: "PUBLIC_SAFE_REDACTED",
    auditSeal,
  };
}

export const vonMisesStressFormula: FreeV531FormulaModule = {
  toolId: TOOL_ID,
  toolKey: TOOL_KEY,
  toolName: TOOL_NAME,
  category: CATEGORY,
  funnelTarget: FUNNEL_TARGET,
  riskLevel: "HIGH",
  primaryMetricId: PRIMARY_METRIC_ID,
  runtimeBoundary,
  publicFormulaExpressionPolicy,
  llmRuntimeUsage,
  clientFormulaExecution,
  inputs,
  execute,
};

export default vonMisesStressFormula;
