// Auto-generated from iskele-kiralama-schema.json
import * as z from 'zod';

export interface Iskele_kiralamaInput {
  Perim: number;
  Height: number;
  Standoff: number;
  Dur: number;
  ErectRate: number;
  DismRate: number;
  Trips: number;
  TruckRate: number;
  CritPath: number;
  Buffer: number;
  Overlap: number;
  Actual: number;
  DailyRate: number;
  dataConfidence?: number;
}

export const Iskele_kiralamaInputSchema = z.object({
  Perim: z.number().min(0).default(0),
  Height: z.number().min(0).default(0),
  Standoff: z.number().min(0).default(0),
  Dur: z.number().min(0).default(0),
  ErectRate: z.number().min(0).default(0),
  DismRate: z.number().min(0).default(0),
  Trips: z.number().min(0).default(0),
  TruckRate: z.number().min(0).default(0),
  CritPath: z.number().min(0).default(0),
  Buffer: z.number().min(0).default(0),
  Overlap: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  DailyRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Iskele_kiralamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Perim * input.Height; results["Area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Area"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Area"])) * input.Standoff; results["Vol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Vol"] = Number.NaN; }
  results["Rental"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Area"])) * input.ErectRate; results["Lab_Erect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Lab_Erect"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Area"])) * input.DismRate; results["Lab_Dism"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Lab_Dism"] = Number.NaN; }
  try { const v = input.Trips * input.TruckRate; results["Transp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Transp"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Rental"])) + (toNumericFormulaValue(results["Lab_Erect"])) + (toNumericFormulaValue(results["Lab_Dism"])) + (toNumericFormulaValue(results["Transp"])); results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = input.CritPath + input.Buffer - input.Overlap; results["OptDur"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptDur"] = Number.NaN; }
  try { const v = Math.max(0, input.Actual - (toNumericFormulaValue(results["OptDur"]))) * input.DailyRate; results["Overrun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overrun"] = Number.NaN; }
  return results;
}


export function calculateIskele_kiralama(input: Iskele_kiralamaInput): Iskele_kiralamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Overrun"]);
  const breakdown = {
    Area: toNumericFormulaValue(values["Area"]),
    Vol: toNumericFormulaValue(values["Vol"]),
    Rental: toNumericFormulaValue(values["Rental"]),
    Lab_Erect: toNumericFormulaValue(values["Lab_Erect"]),
    Lab_Dism: toNumericFormulaValue(values["Lab_Dism"]),
    Transp: toNumericFormulaValue(values["Transp"]),
    Total: toNumericFormulaValue(values["Total"]),
    OptDur: toNumericFormulaValue(values["OptDur"]),
    Overrun: toNumericFormulaValue(values["Overrun"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Iskele_kiralamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Area: number; Vol: number; Rental: number; Lab_Erect: number; Lab_Dism: number; Transp: number; Total: number; OptDur: number; Overrun: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Iskele_kiralamaOutputMeta = {
  primaryKey: "Overrun",
  unit: "USD",
  breakdownKeys: ["Area","Vol","Rental","Lab_Erect","Lab_Dism","Transp","Total","OptDur","Overrun"],
} as const;

