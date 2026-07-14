import "server-only";

import type { DomainResult } from "@/sectorcalc/formulas/pro-v531/pro-decimal-domain";
import {
  createDecimalContext,
  err,
  ok,
} from "@/sectorcalc/formulas/pro-v531/pro-decimal-domain";
import type {
  CertifiedFreeCalculation,
  CertifiedFreeOutput,
} from "./certified-free-calculation-kernel";
import { getFreeIntervalModelContract } from "./free-interval-model-contract";
import {
  FREE_INTERVAL_ARITHMETIC_MODE,
  getFreeFormulaCertification,
} from "./free-formula-verification-manifest";

const KERNEL_TIMEOUT_MS = 3_000;
const MIN_INTERVAL_PRECISION_DIGITS = 50;
const DECIMAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const CALCULATION_STATUSES = new Set(["OK", "REVIEW", "HOLD", "REPAIR", "REPRICE"]);
const INTERVAL_STATUSES = new Set(["VERIFIED", "WIDE_INTERVAL"]);

function contractError(field: string, message: string): DomainResult<never> {
  return err({ code: "KERNEL_CONTRACT_VIOLATION", field, message });
}

function canonicalInput(
  raw: unknown,
  field: string,
): DomainResult<string> {
  if (typeof raw !== "string" && typeof raw !== "number") {
    return err({ code: "MISSING_INPUT", field, message: `${field} must be an exact decimal string or finite number.` });
  }
  if (typeof raw === "number" && !Number.isFinite(raw)) {
    return err({ code: "NON_FINITE_INPUT", field, message: `${field} must be finite.` });
  }
  const canonical = typeof raw === "string" ? raw.trim() : String(raw);
  if (!DECIMAL_PATTERN.test(canonical)) {
    return err({ code: "INVALID_DECIMAL", field, message: `${field} is not a canonical decimal value.` });
  }
  return ok(canonical);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateOutput(
  raw: unknown,
  expected: readonly [string, string, string, string],
): DomainResult<CertifiedFreeOutput> {
  if (!isRecord(raw)) return contractError(expected[0], "Kernel output must be an object.");
  const [expectedId, , expectedUnit, expectedRole] = expected;
  if (raw.id !== expectedId || raw.unit !== expectedUnit || raw.role !== expectedRole) {
    return contractError(expectedId, "Kernel output identity, unit, or role drifted from the certified contract.");
  }
  if (
    !finiteNumber(raw.value)
    || !finiteNumber(raw.lower_bound)
    || !finiteNumber(raw.upper_bound)
    || !finiteNumber(raw.ulp_error_margin)
  ) {
    return contractError(expectedId, "Kernel output contains a non-finite presentation bound.");
  }
  if (raw.lower_bound > raw.value || raw.value > raw.upper_bound || raw.ulp_error_margin < 0) {
    return contractError(expectedId, "Kernel midpoint is outside its outward bounds.");
  }
  if (typeof raw.exact_lower_bound !== "string" || typeof raw.exact_upper_bound !== "string") {
    return contractError(expectedId, "Kernel exact interval bounds are required.");
  }
  if (!INTERVAL_STATUSES.has(String(raw.status))) {
    return contractError(expectedId, "Kernel interval verification status is invalid.");
  }

  const decimalContext = createDecimalContext();
  const exactLower = decimalContext.decimal(raw.exact_lower_bound, `${expectedId}.exact_lower_bound`);
  if (!exactLower.ok) return contractError(expectedId, exactLower.error.message);
  const exactUpper = decimalContext.decimal(raw.exact_upper_bound, `${expectedId}.exact_upper_bound`);
  if (!exactUpper.ok) return contractError(expectedId, exactUpper.error.message);
  if (exactLower.value.gt(exactUpper.value)) {
    return contractError(expectedId, "Kernel exact lower bound exceeds its exact upper bound.");
  }
  const numericLower = decimalContext.decimal(String(raw.lower_bound), `${expectedId}.lower_bound`);
  const numericUpper = decimalContext.decimal(String(raw.upper_bound), `${expectedId}.upper_bound`);
  if (!numericLower.ok || !numericUpper.ok) {
    return contractError(expectedId, "Kernel presentation bounds are not canonical decimals.");
  }
  if (numericLower.value.gt(exactLower.value) || numericUpper.value.lt(exactUpper.value)) {
    return contractError(expectedId, "Kernel numeric bounds are not outward of the exact interval.");
  }

  const exactMidpoint = exactLower.value.plus(exactUpper.value).div("2").toString();
  return ok({
    id: expectedId,
    exactValue: exactMidpoint,
    value: raw.value,
    unit: expectedUnit,
    role: expectedRole as CertifiedFreeOutput["role"],
    lowerBound: raw.lower_bound,
    upperBound: raw.upper_bound,
    exactLowerBound: raw.exact_lower_bound,
    exactUpperBound: raw.exact_upper_bound,
    ulpErrorMargin: raw.ulp_error_margin,
  });
}

function validateKernelResponse(
  toolKey: string,
  payload: unknown,
  normalizedInputs: Readonly<Record<string, string>>,
): DomainResult<CertifiedFreeCalculation> {
  const certification = getFreeFormulaCertification(toolKey);
  const modelContract = getFreeIntervalModelContract(toolKey);
  if (!certification || certification.arithmeticMode !== FREE_INTERVAL_ARITHMETIC_MODE || !modelContract) {
    return contractError(toolKey, "Tool has no certified interval execution contract.");
  }
  if (!isRecord(payload)) return contractError(toolKey, "Kernel response must be an object.");
  if (payload.tool_key !== toolKey || payload.arithmetic_mode !== FREE_INTERVAL_ARITHMETIC_MODE) {
    return contractError(toolKey, "Kernel response identity or arithmetic mode does not match certification.");
  }
  if (!Number.isInteger(payload.interval_precision_digits) || Number(payload.interval_precision_digits) < MIN_INTERVAL_PRECISION_DIGITS) {
    return contractError(toolKey, "Kernel interval precision is below the certified minimum.");
  }
  if (typeof payload.status !== "string" || !CALCULATION_STATUSES.has(payload.status)) {
    return contractError(toolKey, "Kernel calculation status is invalid.");
  }
  if (!Array.isArray(payload.outputs) || payload.outputs.length !== modelContract.outputs.length) {
    return contractError(toolKey, "Kernel output cardinality drifted from the certified contract.");
  }

  const outputs: CertifiedFreeOutput[] = [];
  for (let index = 0; index < modelContract.outputs.length; index += 1) {
    const validated = validateOutput(payload.outputs[index], modelContract.outputs[index]);
    if (!validated.ok) return validated;
    outputs.push(validated.value);
  }
  if (!isRecord(payload.normalized_inputs)) {
    return contractError(toolKey, "Kernel normalized input audit is missing.");
  }
  const responseInputKeys = Object.keys(payload.normalized_inputs).sort();
  const expectedInputKeys = Object.keys(normalizedInputs).sort();
  if (JSON.stringify(responseInputKeys) !== JSON.stringify(expectedInputKeys)) {
    return contractError(toolKey, "Kernel normalized input keys drifted from the certified contract.");
  }
  for (const field of expectedInputKeys) {
    if (payload.normalized_inputs[field] !== normalizedInputs[field]) {
      return contractError(field, "Kernel normalized input differs from the submitted exact decimal.");
    }
  }
  if (!Array.isArray(payload.warnings) || payload.warnings.some((warning) => typeof warning !== "string")) {
    return contractError(toolKey, "Kernel warnings must be a string array.");
  }

  return ok({
    toolKey,
    formulaVersion: certification.formulaVersion,
    modelId: certification.modelId,
    arithmeticMode: FREE_INTERVAL_ARITHMETIC_MODE,
    status: payload.status as CertifiedFreeCalculation["status"],
    outputs: Object.freeze(outputs),
    normalizedInputs: Object.freeze({ ...normalizedInputs }),
    warnings: Object.freeze([...payload.warnings]),
  });
}

export async function executeCertifiedFreeIntervalCalculation(
  toolKey: string,
  rawInputs: Readonly<Record<string, unknown>>,
): Promise<DomainResult<CertifiedFreeCalculation>> {
  const modelContract = getFreeIntervalModelContract(toolKey);
  const certification = getFreeFormulaCertification(toolKey);
  if (!modelContract || certification?.arithmeticMode !== FREE_INTERVAL_ARITHMETIC_MODE) {
    return contractError(toolKey, "Tool has no certified interval execution contract.");
  }
  if (process.env.MATH_KERNEL_PROXY_ENABLED !== "true") {
    return err({ code: "KERNEL_UNAVAILABLE", field: toolKey, message: "Certified interval kernel execution is disabled." });
  }
  const secret = process.env.KERNEL_AUTH_SECRET?.trim() ?? "";
  if (!secret) {
    return err({ code: "KERNEL_UNAVAILABLE", field: toolKey, message: "Certified interval kernel authentication is not configured." });
  }

  const normalizedInputs: Record<string, string> = {};
  for (const inputId of modelContract.inputIds) {
    const canonical = canonicalInput(rawInputs[inputId], inputId);
    if (!canonical.ok) return canonical;
    normalizedInputs[inputId] = canonical.value;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), KERNEL_TIMEOUT_MS);
  try {
    const kernelUrl = (process.env.MATH_KERNEL_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");
    const response = await fetch(`${kernelUrl}/calculate/free-interval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": secret,
      },
      body: JSON.stringify({ tool_key: toolKey, raw_inputs: normalizedInputs }),
      signal: controller.signal,
      keepalive: true,
    });
    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 300);
      if (response.status === 422) {
        return err({ code: "DOMAIN_VIOLATION", field: toolKey, message: `Interval domain rejection: ${detail}` });
      }
      return err({ code: "KERNEL_UNAVAILABLE", field: toolKey, message: `Interval kernel HTTP ${response.status}; calculation blocked.` });
    }
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return contractError(toolKey, "Kernel returned invalid JSON.");
    }
    return validateKernelResponse(toolKey, payload, normalizedInputs);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return err({ code: "KERNEL_TIMEOUT", field: toolKey, message: "Certified interval kernel exceeded the 3 second deadline; calculation blocked." });
    }
    return err({ code: "KERNEL_UNAVAILABLE", field: toolKey, message: "Certified interval kernel is unreachable; calculation blocked." });
  } finally {
    clearTimeout(timeoutId);
  }
}
