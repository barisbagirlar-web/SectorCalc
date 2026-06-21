// Auto-generated from robot-kol-vs-manuel-isci-schema.json
import * as z from 'zod';

export interface Robot_kol_vs_manuel_isciInput {
  Operators: number;
  HourlyRate: number;
  Hours: number;
  Burden: number;
  RobotCapex: number;
  DepreciationLife: number;
  Maintenance: number;
  Energy: number;
  ProgrammerCost: number;
  CycleTime_Robot: number;
  Uptime: number;
  CycleTime_Manual: number;
  Efficiency: number;
  ManualCost: number;
  RobotCost: number;
  dataConfidence?: number;
}

export const Robot_kol_vs_manuel_isciInputSchema = z.object({
  Operators: z.number().min(0).default(0),
  HourlyRate: z.number().min(0).default(0),
  Hours: z.number().min(0).default(0),
  Burden: z.number().min(0).default(0),
  RobotCapex: z.number().min(0).default(0),
  DepreciationLife: z.number().min(0).default(0),
  Maintenance: z.number().min(0).default(0),
  Energy: z.number().min(0).default(0),
  ProgrammerCost: z.number().min(0).default(0),
  CycleTime_Robot: z.number().min(0).default(0),
  Uptime: z.number().min(0).default(0),
  CycleTime_Manual: z.number().min(0).default(0),
  Efficiency: z.number().min(0).default(0),
  ManualCost: z.number().min(0).default(0),
  RobotCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Robot_kol_vs_manuel_isciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Operators * input.HourlyRate * input.Hours) * (1 + input.Burden); results["ManualCost_Annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ManualCost_Annual"] = Number.NaN; }
  try { const v = (input.RobotCapex / input.DepreciationLife) + input.Maintenance + input.Energy + input.ProgrammerCost; results["RobotCost_Annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RobotCost_Annual"] = Number.NaN; }
  try { const v = input.CycleTime_Robot^-1 * input.Uptime; results["RobotOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RobotOutput"] = Number.NaN; }
  try { const v = input.CycleTime_Manual^-1 * input.Efficiency; results["ManualOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ManualOutput"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ManualCost_Annual"])) / (toNumericFormulaValue(results["ManualOutput"])); results["CostPerUnit_Manual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerUnit_Manual"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RobotCost_Annual"])) / (toNumericFormulaValue(results["RobotOutput"])); results["CostPerUnit_Robot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerUnit_Robot"] = Number.NaN; }
  try { const v = (input.ManualCost - input.RobotCost) / input.RobotCapex; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  try { const v = input.RobotCapex / ((toNumericFormulaValue(results["ManualCost_Annual"])) - (toNumericFormulaValue(results["RobotCost_Annual"]))); results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  return results;
}


export function calculateRobot_kol_vs_manuel_isci(input: Robot_kol_vs_manuel_isciInput): Robot_kol_vs_manuel_isciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Payback"]);
  const breakdown = {
    ManualCost_Annual: toNumericFormulaValue(values["ManualCost_Annual"]),
    RobotCost_Annual: toNumericFormulaValue(values["RobotCost_Annual"]),
    RobotOutput: toNumericFormulaValue(values["RobotOutput"]),
    ManualOutput: toNumericFormulaValue(values["ManualOutput"]),
    CostPerUnit_Manual: toNumericFormulaValue(values["CostPerUnit_Manual"]),
    CostPerUnit_Robot: toNumericFormulaValue(values["CostPerUnit_Robot"]),
    ROI: toNumericFormulaValue(values["ROI"]),
    Payback: toNumericFormulaValue(values["Payback"])
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


export interface Robot_kol_vs_manuel_isciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ManualCost_Annual: number; RobotCost_Annual: number; RobotOutput: number; ManualOutput: number; CostPerUnit_Manual: number; CostPerUnit_Robot: number; ROI: number; Payback: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Robot_kol_vs_manuel_isciOutputMeta = {
  primaryKey: "Payback",
  unit: "USD",
  breakdownKeys: ["ManualCost_Annual","RobotCost_Annual","RobotOutput","ManualOutput","CostPerUnit_Manual","CostPerUnit_Robot","ROI","Payback"],
} as const;

