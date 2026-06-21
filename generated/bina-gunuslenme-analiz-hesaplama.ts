// Auto-generated from bina-gunuslenme-analiz-hesaplama-schema.json
import * as z from 'zod';

export interface Bina_gunuslenme_analiz_hesaplamaInput {
  enlem: number;
  gunSayisi: number;
  engelYukseklik: number;
  mesafe: number;
  dataConfidence?: number;
}

export const Bina_gunuslenme_analiz_hesaplamaInputSchema = z.object({
  enlem: z.number().min(0).default(41),
  gunSayisi: z.number().min(1).max(365).default(172),
  engelYukseklik: z.number().min(0).default(20),
  mesafe: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bina_gunuslenme_analiz_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan(input.engelYukseklik / Math.max(0.0001, input.mesafe)); results["golgeAcisi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["golgeAcisi"] = Number.NaN; }
  try { const v = (Math.atan(input.engelYukseklik / Math.max(0.0001, input.mesafe)) * 180 / Math.PI) / 15 * 2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBina_gunuslenme_analiz_hesaplama(input: Bina_gunuslenme_analiz_hesaplamaInput): Bina_gunuslenme_analiz_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bina_gunuslenme_analiz_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bina_gunuslenme_analiz_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: ["sonuc"],
} as const;

