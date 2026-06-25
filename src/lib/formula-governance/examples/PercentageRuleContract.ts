import { z } from "zod";

/**
 * SECTORCALC INDUSTRIAL VALIDATION LAYER (RULE ENGINE)
 * Tool: FIN_001 - Percentage Rule
 *
 * Transforms a simple calculation into an autonomous industrial authority
 * capable of producing decisions. Inputs, smart warnings, and tolerance
 * boundaries are secured within this layer.
 */

// 1. Zod Tolerance & Input Locks (Industrial Boundaries)
export const PercentageRuleInputSchema = z.object({
  monthly_rent: z.number().min(1, "Rent amount cannot be zero or negative."),
  property_value: z.number().min(1000, "Enter a valid property value.")
});

export type PercentageRuleInput = z.infer<typeof PercentageRuleInputSchema>;

// 2. Smart Warning Types
export type SmartWarningSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface SmartWarning {
  severity: SmartWarningSeverity;
  source: string; // e.g. ISO 9001, Big Four, Real Estate Market Standards
  message: string;
}

export interface PercentageRuleOutput {
  percentage: number; // Percentage value
  smartWarnings: SmartWarning[];
}

// 3. Formula Contract & Autonomous Decision Engine (Rule Engine)
export function executePercentageRule(input: PercentageRuleInput): PercentageRuleOutput {
  // Validate data through Zod schema (P2.4 Runtime Trust layer)
  const validData = PercentageRuleInputSchema.parse(input);

  const { monthly_rent, property_value } = validData;

  // Mathematical Formula (zero-division safe)
  const safePropertyValue = Math.max(1, property_value);
  const percentage = (monthly_rent / safePropertyValue) * 100;

  const smartWarnings: SmartWarning[] = [];

  // AUTONOMOUS ENGINEERING / FINANCE WARNINGS (Smart Warnings Integration)
  if (percentage < 0.4) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Real Estate Investment Metrics",
      message: "Warning: Rental yield is below 0.4% of property value. Amortization period (ROI) exceeds 20 years — this is a low-yield investment."
    });
  }

  if (percentage > 2.0) {
    smartWarnings.push({
      severity: "INFO",
      source: "Market Standards (Big Four)",
      message: "Note: Monthly rental yields above 2% typically apply to micro-apartments, short-term rentals, or high-risk areas. Verify the data."
    });
  }

  return {
    percentage: Number(percentage.toFixed(2)),
    smartWarnings
  };
}
