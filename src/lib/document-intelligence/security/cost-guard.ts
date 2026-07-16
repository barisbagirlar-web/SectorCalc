/**
 * Server-side Cost Guard
 *
 * Rejects or routes to manual review if estimated processing costs
 * exceed configured maximum. Never exposes internal cost formula publicly.
 */

export interface CostEstimate {
  estimatedProviderCostUsd: number;
  estimatedProcessingDurationMs: number;
  estimatedPages: number;
  estimatedRows: number;
}

export interface CostGuardResult {
  allowed: boolean;
  reason: string | null;
  requiresManualReview: boolean;
  estimatedCostUsd: number;
  maxAllowedCostUsd: number;
}

const DEFAULT_MAX_COST_USD = 5.0; // Max provider cost per job
const DEFAULT_MAX_PAGES = 50;
const DEFAULT_MAX_ROWS = 500;

/**
 * Estimate provider cost based on pages and rows.
 * Provider-independent: uses abstract cost units.
 */
export function estimateCost(
  pageCount: number,
  estimatedRows: number,
  costPerPage: number = 0.02,
  costPerRow: number = 0.005,
): CostEstimate {
  const estimatedProviderCostUsd = pageCount * costPerPage + estimatedRows * costPerRow;
  const estimatedProcessingDurationMs = pageCount * 500 + estimatedRows * 50; // Rough estimate
  return {
    estimatedProviderCostUsd,
    estimatedProcessingDurationMs,
    estimatedPages: pageCount,
    estimatedRows,
  };
}

/**
 * Evaluate whether a job can proceed automatically based on cost estimates.
 */
export function evaluateCostGuard(
  pageCount: number,
  estimatedRows: number,
  maxCostUsd: number = DEFAULT_MAX_COST_USD,
  maxPages: number = DEFAULT_MAX_PAGES,
  maxRows: number = DEFAULT_MAX_ROWS,
): CostGuardResult {
  const estimate = estimateCost(pageCount, estimatedRows);

  // Hard limit check
  if (pageCount > maxPages) {
    return {
      allowed: false,
      reason: `Page count (${pageCount}) exceeds maximum (${maxPages})`,
      requiresManualReview: true,
      estimatedCostUsd: estimate.estimatedProviderCostUsd,
      maxAllowedCostUsd: maxCostUsd,
    };
  }

  if (estimatedRows > maxRows) {
    return {
      allowed: false,
      reason: `Estimated rows (${estimatedRows}) exceeds maximum (${maxRows})`,
      requiresManualReview: true,
      estimatedCostUsd: estimate.estimatedProviderCostUsd,
      maxAllowedCostUsd: maxCostUsd,
    };
  }

  // Cost check
  if (estimate.estimatedProviderCostUsd > maxCostUsd) {
    return {
      allowed: false,
      reason: `Estimated cost ($${estimate.estimatedProviderCostUsd.toFixed(2)}) exceeds maximum ($${maxCostUsd.toFixed(2)})`,
      requiresManualReview: true,
      estimatedCostUsd: estimate.estimatedProviderCostUsd,
      maxAllowedCostUsd: maxCostUsd,
    };
  }

  return {
    allowed: true,
    reason: null,
    requiresManualReview: false,
    estimatedCostUsd: estimate.estimatedProviderCostUsd,
    maxAllowedCostUsd: maxCostUsd,
  };
}
