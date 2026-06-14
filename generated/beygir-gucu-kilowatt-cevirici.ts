// Auto-generated from beygir-gucu-kilowatt-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BeygirGucuKilowattCeviriciInput {
  horsepower: number;
  horsepowerType: 'mechanical' | 'metric' | 'electric' | 'boiler';
}

export const BeygirGucuKilowattCeviriciInputSchema = z.object({
  horsepower: z.number().min(0).max(10000).default(100),
  horsepowerType: z.enum(['mechanical', 'metric', 'electric', 'boiler']).default('mechanical'),
});

export interface BeygirGucuKilowattCeviriciOutput {
  kilowatt: number;
  breakdown: {
    horsepower: number;
    horsepowerType: number;
    conversionFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BeygirGucuKilowattCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kilowatt = ((): number => { try { const __v = input.horsepower * (input.horsepowerType == 'mechanical' ? 0.7457 : input.horsepowerType == 'metric' ? 0.7355 : input.horsepowerType == 'electric' ? 0.746 : 9.8095); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBeygirGucuKilowattCevirici(input: BeygirGucuKilowattCeviriciInput): BeygirGucuKilowattCeviriciOutput {
  const results = evaluateFormulas(input);
  const kilowatt = results.kilowatt ?? 0;
  const breakdown = {
    horsepower: results.horsepower,
    horsepowerType: results.horsepowerType,
    conversionFactor: results.conversionFactor,
  };

  // rule: horsepower >= 0
  // rule: horsepower <= 10000
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.horsepower > 5000) hiddenLossDrivers.push("Yuksek guc degeri, dogrulama gerekli");

  const dataConfidenceAdjusted = (() => { try { return results.kilowatt * 1.0; } catch { return kilowatt; } })();

  return {
    kilowatt,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
