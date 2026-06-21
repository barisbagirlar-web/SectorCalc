// Auto-generated from evm-maliyet-forecast-schema.json
import * as z from 'zod';

export interface Evm_maliyet_forecastInput {
  EV: number;
  AC: number;
  BAC: number;
  EAC: number;
  dataConfidence?: number;
}

export const Evm_maliyet_forecastInputSchema = z.object({
  EV: z.number().min(0).default(0),
  AC: z.number().min(0).default(0),
  BAC: z.number().min(0).default(0),
  EAC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Evm_maliyet_forecastInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["SV"] = Number.NaN;
  try { const v = input.EV - input.AC; results["CV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CV"] = Number.NaN; }
  results["SPI"] = Number.NaN;
  try { const v = input.EV / input.AC; results["CPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CPI"] = Number.NaN; }
  try { const v = input.BAC / (toNumericFormulaValue(results["CPI"])); results["EAC_CPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EAC_CPI"] = Number.NaN; }
  try { const v = input.AC + ((input.BAC - input.EV) / ((toNumericFormulaValue(results["CPI"])) * (toNumericFormulaValue(results["SPI"])))); results["EAC_CPI_SPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EAC_CPI_SPI"] = Number.NaN; }
  try { const v = input.EAC - input.AC; results["ETC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ETC"] = Number.NaN; }
  try { const v = input.BAC - input.EAC; results["VAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VAC"] = Number.NaN; }
  try { const v = (input.BAC - input.EV) / (input.BAC - input.AC); results["TCPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCPI"] = Number.NaN; }
  return results;
}


export function calculateEvm_maliyet_forecast(input: Evm_maliyet_forecastInput): Evm_maliyet_forecastOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TCPI"]);
  const breakdown = {
    SV: toNumericFormulaValue(values["SV"]),
    CV: toNumericFormulaValue(values["CV"]),
    SPI: toNumericFormulaValue(values["SPI"]),
    CPI: toNumericFormulaValue(values["CPI"]),
    EAC_CPI: toNumericFormulaValue(values["EAC_CPI"]),
    EAC_CPI_SPI: toNumericFormulaValue(values["EAC_CPI_SPI"]),
    ETC: toNumericFormulaValue(values["ETC"]),
    VAC: toNumericFormulaValue(values["VAC"]),
    TCPI: toNumericFormulaValue(values["TCPI"])
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


export interface Evm_maliyet_forecastOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { SV: number; CV: number; SPI: number; CPI: number; EAC_CPI: number; EAC_CPI_SPI: number; ETC: number; VAC: number; TCPI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Evm_maliyet_forecastOutputMeta = {
  primaryKey: "TCPI",
  unit: "USD",
  breakdownKeys: ["SV","CV","SPI","CPI","EAC_CPI","EAC_CPI_SPI","ETC","VAC","TCPI"],
} as const;

