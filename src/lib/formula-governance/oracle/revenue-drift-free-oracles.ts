/**
 * Revenue free-tool oracle baselines aligned to live form semantics.
 * Mirrors deterministic production paths in free-tool-results / sector-formulas-b.
 */

import {
  changeOrderWastePercent,
  calculateProductMarginResult,
} from "@/lib/tools/calculation-formulas";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

const ISSA_RATE_SQFT_PER_HOUR = 2500;

export const DTC_FREE_MARGIN_DEFAULTS = {
  shippingCost: 0,
  platformFeePercent: 3,
} as const;

export type ProjectChangeOrderFreeOracleInput = {
  readonly originalBudget: number;
  readonly changeEstimate: number;
  readonly deadlinePressureWastePercent: number;
};

export type ProjectChangeOrderFreeOracleOutput = {
  readonly adjustedChange: number;
  readonly changeRatioPercent: number;
  readonly wastePercent: number;
};

export type CleaningIssaFreeOracleInput = {
  readonly areaSize: number;
  readonly staffCount: number;
  readonly visitFrequency: number;
};

export type CleaningIssaFreeOracleOutput = {
  readonly monthlyHours: number;
  readonly workloadIndex: number;
  readonly hoursPerVisit: number;
};

export type ProductMarginDtcFreeOracleInput = {
  readonly productPrice: number;
  readonly productCost: number;
  readonly returnRate?: number;
};

export type ProductMarginDtcFreeOracleOutput = {
  readonly marginPercent: number;
  readonly grossMargin: number;
  readonly totalCost: number;
};

export function mapDeadlinePressureToWastePercent(
  pressure: string | number | undefined,
): number | undefined {
  if (pressure === undefined || pressure === null || pressure === "") {
    return undefined;
  }
  if (typeof pressure === "number") {
    return Number.isFinite(pressure) ? pressure : undefined;
  }
  const trimmed = String(pressure).trim().toLowerCase();
  if (trimmed === "low" || trimmed === "medium" || trimmed === "high") {
    return changeOrderWastePercent(trimmed);
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** RSMeans-style change-order exposure — matches construction free revenue path. */
export function calculateProjectChangeOrderFreeOracle(
  input: ProjectChangeOrderFreeOracleInput,
): ProjectChangeOrderFreeOracleOutput {
  if (!Number.isFinite(input.originalBudget) || input.originalBudget <= 0) {
    throw new OracleValidationError("INVALID_PRICE", "Original budget must be a positive finite number.");
  }
  if (!Number.isFinite(input.changeEstimate) || input.changeEstimate < 0) {
    throw new OracleValidationError("INVALID_COST", "Change estimate must be a non-negative finite number.");
  }
  if (
    !Number.isFinite(input.deadlinePressureWastePercent) ||
    input.deadlinePressureWastePercent < 0 ||
    input.deadlinePressureWastePercent > 100
  ) {
    throw new OracleValidationError(
      "INVALID_PERCENT",
      "Deadline pressure waste percent must be between 0 and 100.",
    );
  }

  const wastePercent = input.deadlinePressureWastePercent;
  const adjustedChange = input.changeEstimate * (1 + wastePercent / 100);
  const changeRatioPercent = (adjustedChange / input.originalBudget) * 100;

  return {
    adjustedChange: Math.round(adjustedChange * 100) / 100,
    changeRatioPercent: Math.round(changeRatioPercent * 100) / 100,
    wastePercent,
  };
}

/** ISSA productivity benchmark — matches cleaning free revenue path. */
export function calculateCleaningIssaFreeOracle(
  input: CleaningIssaFreeOracleInput,
): CleaningIssaFreeOracleOutput {
  if (!Number.isFinite(input.areaSize) || input.areaSize <= 0) {
    throw new OracleValidationError("INVALID_AREA", "Area size must be a positive finite number.");
  }
  if (!Number.isFinite(input.staffCount) || input.staffCount <= 0) {
    throw new OracleValidationError("INVALID_CREW", "Staff count must be at least 1.");
  }
  if (!Number.isFinite(input.visitFrequency) || input.visitFrequency < 1) {
    throw new OracleValidationError("INVALID_HOURS", "Visit frequency must be at least 1.");
  }

  const hoursPerVisit = input.areaSize / (ISSA_RATE_SQFT_PER_HOUR * input.staffCount);
  const monthlyHours = hoursPerVisit * input.visitFrequency;
  const workloadIndex = input.staffCount * input.visitFrequency;

  return {
    hoursPerVisit: Math.round(hoursPerVisit * 100) / 100,
    monthlyHours: Math.round(monthlyHours * 100) / 100,
    workloadIndex,
  };
}

/** Simplified DTC margin — matches ecommerce free revenue path defaults. */
export function calculateProductMarginDtcFreeOracle(
  input: ProductMarginDtcFreeOracleInput,
): ProductMarginDtcFreeOracleOutput {
  const returnRate = input.returnRate ?? 0;
  if (!Number.isFinite(input.productPrice) || input.productPrice <= 0) {
    throw new OracleValidationError("INVALID_PRICE", "Product price must be a positive finite number.");
  }
  if (!Number.isFinite(input.productCost) || input.productCost < 0) {
    throw new OracleValidationError("INVALID_COST", "Product cost must be a non-negative finite number.");
  }
  if (!Number.isFinite(returnRate) || returnRate < 0 || returnRate > 100) {
    throw new OracleValidationError("INVALID_PERCENT", "Return rate must be between 0 and 100 percent.");
  }

  const margin = calculateProductMarginResult({
    costPrice: input.productCost,
    sellingPrice: input.productPrice,
    shippingCost: DTC_FREE_MARGIN_DEFAULTS.shippingCost,
    platformFeePercent: DTC_FREE_MARGIN_DEFAULTS.platformFeePercent,
    returnRatePercent: returnRate,
  });
  if ("error" in margin) {
    throw new OracleValidationError("INVALID_PRICE", margin.error);
  }

  return {
    marginPercent: margin.marginPercent,
    grossMargin: margin.grossMargin,
    totalCost: margin.totalCost,
  };
}

export const REVENUE_DRIFT_FREE_ORACLE_SLUGS = [
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "product-margin-calculator",
] as const;

export type RevenueDriftFreeOracleSlug = (typeof REVENUE_DRIFT_FREE_ORACLE_SLUGS)[number];

export function isRevenueDriftFreeOracleSlug(slug: string): slug is RevenueDriftFreeOracleSlug {
  return (REVENUE_DRIFT_FREE_ORACLE_SLUGS as readonly string[]).includes(slug);
}
