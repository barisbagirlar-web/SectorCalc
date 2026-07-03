// SectorCalc SuperV4 V5.3.1 — Public Response Redactor
// Removes exact formula expressions, proprietary coefficients, internal traces from public responses.
// Location: pro-form/ (per Section 11 module map)

import type { ExecuteResponse, RedactionStatus } from "./contract-types";

export interface RedactionResult {
  response: ExecuteResponse;
  status: RedactionStatus;
}

const SENSITIVE_KEYS = [
  "exact_formula_expression",
  "private_formula_registry",
  "internal_checker_trace",
  "intermediate_steps",
  "restricted_standard_table_values",
  "proprietary_coefficients",
  "raw_internal_execution_sequence",
  "private_formula_nodes",
  "exact_expression",
  "internal_trace_policy",
];

function deepRemoveKeys(obj: Record<string, unknown>, keys: string[]): void {
  for (const key of Object.keys(obj)) {
    if (keys.includes(key)) {
      delete obj[key];
      continue;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      deepRemoveKeys(obj[key] as Record<string, unknown>, keys);
    }
  }
}

const FORBIDDEN_PUBLIC_PATTERNS = [
  /\bNaN\b/,
  /\bInfinity\b/,
  /expression\s*[:=]\s*["']/i,
  /Math\.\w+/,
  /private_registry/i,
  /registry_hash/,
];

function scanForForbiddenContent(obj: unknown, path: string, errors: string[]): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "string") {
    for (const pattern of FORBIDDEN_PUBLIC_PATTERNS) {
      if (pattern.test(obj)) {
        errors.push(`Forbidden content pattern at ${path}: "${obj.slice(0, 120)}"`);
        return;
      }
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanForForbiddenContent(item, `${path}[${i}]`, errors));
    return;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      scanForForbiddenContent(value, `${path}.${key}`, errors);
    }
  }
}

export function redactPublicResponse(
  response: ExecuteResponse,
): RedactionResult {
  try {
    const safeResponse = JSON.parse(JSON.stringify(response)) as ExecuteResponse;

    // 1. Remove sensitive keys from response body
    deepRemoveKeys(safeResponse as unknown as Record<string, unknown>, SENSITIVE_KEYS);

    // 2. Scan for forbidden content patterns
    const errors: string[] = [];
    scanForForbiddenContent(safeResponse, "response", errors);

    if (errors.length > 0) {
      return {
        response: {
          ...safeResponse,
          status: "BLOCKED",
          pipeline_state: "REDACTION_FAILED",
          warnings: [
            ...safeResponse.warnings,
            {
              id: "redaction_warning",
              severity: "CRITICAL",
              message: "Public response redaction detected forbidden content.",
              why_it_matters: "Sensitive data may have been exposed.",
              suggested_action: "Contact system administrator.",
            },
          ],
          redaction_status: "REDACTION_FAILED_BLOCKED",
        },
        status: "REDACTION_FAILED_BLOCKED",
      };
    }

    // 3. Sanitize output descriptions
    if (safeResponse.outputs) {
      for (const output of safeResponse.outputs) {
        if (output.public_explanation) {
          output.public_explanation = output.public_explanation.replace(
            /FORMULA|EXPRESSION|CALCULATION_STEP/gi,
            (match) => match.toLowerCase(),
          );
        }
      }
    }

    return {
      response: {
        ...safeResponse,
        redaction_status: "PUBLIC_SAFE_REDACTED",
      },
      status: "PUBLIC_SAFE_REDACTED",
    };
  } catch {
    return {
      response: {
        ...response,
        redaction_status: "REDACTION_FAILED_BLOCKED",
      },
      status: "REDACTION_FAILED_BLOCKED",
    };
  }
}

/**
 * Check if a response is safe for public export (PDF, JSON audit).
 */
export function isPublicExportSafe(response: ExecuteResponse): boolean {
  return response.redaction_status === "PUBLIC_SAFE_REDACTED";
}
