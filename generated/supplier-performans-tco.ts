// Auto-generated from supplier-performans-tco-schema.json
import * as z from 'zod';

export interface Supplier_performans_tcoInput {
  teklifFiyati: number;
  siparisNakliyeMaliyeti: number;
  hataOraniPPM: number;
  hataMaliyeti: number;
  leadTimeGun: number;
  guvenlikStoguGun: number;
  kesintiOlasiligi: number;
  etkiMaliyeti: number;
  dataConfidence?: number;
}

export const Supplier_performans_tcoInputSchema = z.object({
  teklifFiyati: z.number().min(0).default(0),
  siparisNakliyeMaliyeti: z.number().min(0).default(0),
  hataOraniPPM: z.number().min(0).default(0),
  hataMaliyeti: z.number().min(0).default(0),
  leadTimeGun: z.number().min(0).default(0),
  guvenlikStoguGun: z.number().min(0).default(0),
  kesintiOlasiligi: z.number().min(0).default(0),
  etkiMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(_input: Supplier_performans_tcoInput): Record<string, number> {
  return {};
}


export function calculateSupplier_performans_tco(input: Supplier_performans_tcoInput): Supplier_performans_tcoOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
  const breakdown = {

  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Supplier_performans_tcoOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Supplier_performans_tcoOutputMeta = {
  primaryKey: "total",
  unit: "%",
  breakdownKeys: [],
} as const;

