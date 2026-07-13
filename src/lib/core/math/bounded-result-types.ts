/**
 * SectorCalc — Bounded Result Types
 *
 * TypeScript mirror of the Python math kernel's BoundedResult dataclass.
 * Contract: lower_bound and upper_bound are REQUIRED in every metric response.
 * No bare float is ever returned without error bounds.
 */

// ── Bounded Metric (5-field contract) ─────────────────────────────────────

export interface BoundedMetric {
  /** Best estimate (midpoint of verified interval). */
  value: number;
  /** Guaranteed lower bound of the true mathematical result. */
  lower_bound: number;
  /** Guaranteed upper bound of the true mathematical result. */
  upper_bound: number;
  /** Half-width of interval = maximum ULP error (± uncertainty). */
  ulp_error_margin: number;
  /** "VERIFIED" | "WIDE_INTERVAL" | "ERROR: <message>" */
  status: string;
}

// ── NPV Analysis Output ───────────────────────────────────────────────────

export interface NpvBoundedOutput {
  npv: BoundedMetric;
  irr: BoundedMetric;
  payback_years: BoundedMetric;
  profitability_index: BoundedMetric;
  expanded_uncertainty: BoundedMetric;
  decision: BoundedMetric;
  warnings: string[];
}

// ── MMS Test Result ───────────────────────────────────────────────────────

export interface MmsRunResult {
  test_name: string;
  passed: boolean;
  inputs: Record<string, number>;
  computed_value: number;
  lower_bound: number;
  upper_bound: number;
  exact_analytical: number | null;
  within_bounds: boolean;
  interval_width: number;
  tolerance: number;
  error_message: string;
}

export interface MmsRunResponse {
  total: number;
  passed: number;
  failed: number;
  results: MmsRunResult[];
}

// ── Batch Calculation ─────────────────────────────────────────────────────

export interface NpvBatchRequest {
  base: {
    I: number;
    CF: number;
    r: number;
    n: number;
    RV: number;
  };
  scenarios: Array<Partial<{
    I: number;
    CF: number;
    r: number;
    n: number;
    RV: number;
  }>>;
}

// ── Health ────────────────────────────────────────────────────────────────

export interface MathKernelHealth {
  status: string;
  version: string;
  precision_digits: number;
}

// ── API Response Envelope ─────────────────────────────────────────────────

export interface MathKernelResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  kernel_available: boolean;
}
