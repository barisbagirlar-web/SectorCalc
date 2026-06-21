// Auto-generated from data-backup-time-calculator-schema.json
import * as z from 'zod';

export interface Data_backup_time_calculatorInput {
  veriBoyutu: number;
  sikistirmaOrani: number;
  agHizi: number;
  dataConfidence?: number;
}

export const Data_backup_time_calculatorInputSchema = z.object({
  veriBoyutu: z.number().min(0).default(5),
  sikistirmaOrani: z.number().min(0).default(3),
  agHizi: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Data_backup_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.veriBoyutu / Math.max(0.0001, input.sikistirmaOrani); results["hedefBoyut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hedefBoyut"] = Number.NaN; }
  try { const v = ((input.veriBoyutu / Math.max(0.0001, input.sikistirmaOrani)) * 8192) / Math.max(0.0001, input.agHizi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateData_backup_time_calculator(input: Data_backup_time_calculatorInput): Data_backup_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    hedefBoyut: toNumericFormulaValue(values["hedefBoyut"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Data_backup_time_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { hedefBoyut: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Data_backup_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["hedefBoyut","sonuc"],
} as const;

