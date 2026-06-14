// Auto-generated from newton-kilogram-kuvvet-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface NewtonKilogramKuvvetCeviriciInput {
  newtonValue: number;
  gravitationalAcceleration: number;
}

export const NewtonKilogramKuvvetCeviriciInputSchema = z.object({
  newtonValue: z.number().min(0).default(1),
  gravitationalAcceleration: z.number().min(0).default(9.80665),
});

export interface NewtonKilogramKuvvetCeviriciOutput {
  kilogramKuvvet: number;
  breakdown: {
    newtonValue: number;
    gravitationalAcceleration: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: NewtonKilogramKuvvetCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kilogramKuvvet = ((): number => { try { const __v = input.newtonValue / input.gravitationalAcceleration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateNewtonKilogramKuvvetCevirici(input: NewtonKilogramKuvvetCeviriciInput): NewtonKilogramKuvvetCeviriciOutput {
  const results = evaluateFormulas(input);
  const kilogramKuvvet = results.kilogramKuvvet ?? 0;
  const breakdown = {
    newtonValue: results.newtonValue,
    gravitationalAcceleration: results.gravitationalAcceleration,
  };

  // rule: newtonValue >= 0
  // rule: gravitationalAcceleration > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.newtonValue > 1000000) hiddenLossDrivers.push("newtonValue");

  const dataConfidenceAdjusted = (() => { try { return results.kilogramKuvvet; } catch { return kilogramKuvvet; } })();

  return {
    kilogramKuvvet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
