// Auto-generated from atom-ekonomisi-hesaplayici-schema.json
import * as z from 'zod';

export interface Atom_ekonomisi_hesaplayiciInput {
  target_mass: number;
  total_reactant_mass: number;
  byproduct_mass: number;
  catalyst_mass: number;
  solvent_mass: number;
  recovered_mass: number;
}

export const Atom_ekonomisi_hesaplayiciInputSchema = z.object({
  target_mass: z.number().default(100),
  total_reactant_mass: z.number().default(200),
  byproduct_mass: z.number().default(50),
  catalyst_mass: z.number().default(5),
  solvent_mass: z.number().default(100),
  recovered_mass: z.number().default(30),
});

function evaluateAllFormulas(input: Atom_ekonomisi_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.target_mass / (input.total_reactant_mass + input.catalyst_mass + input.solvent_mass - input.recovered_mass) * 100; results["atom_economy"] = Number.isFinite(v) ? v : 0; } catch { results["atom_economy"] = 0; }
  try { const v = (input.total_reactant_mass + input.catalyst_mass + input.solvent_mass - input.recovered_mass - input.target_mass) / input.target_mass; results["waste_factor"] = Number.isFinite(v) ? v : 0; } catch { results["waste_factor"] = 0; }
  try { const v = (input.byproduct_mass + (input.total_reactant_mass + input.catalyst_mass + input.solvent_mass - input.recovered_mass - input.target_mass)) / input.target_mass; results["e_factor"] = Number.isFinite(v) ? v : 0; } catch { results["e_factor"] = 0; }
  return results;
}


export function calculateAtom_ekonomisi_hesaplayici(input: Atom_ekonomisi_hesaplayiciInput): Atom_ekonomisi_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["atom_economy"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Atom_ekonomisi_hesaplayiciOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
