// Auto-generated from concrete-volume-calculator-schema.json
import * as z from 'zod';

export interface Concrete_volume_calculatorInput {
  length: number;
  width: number;
  depth: number;
  shape: string;
  wasteFactor: number;
  compressionStrength: string;
  reinforcementRatio: number;
  laborRate: number;
  materialCostPerM3: number;
  usePump: boolean;
}

export const Concrete_volume_calculatorInputSchema = z.object({
  length: z.number().min(0.1).max(1000).default(10),
  width: z.number().min(0.1).max(500).default(5),
  depth: z.number().min(0.05).max(5).default(0.15),
  shape: z.enum(['rectangular', 'circular', 'L-shaped', 'trapezoidal']).default('rectangular'),
  wasteFactor: z.number().min(0).max(25).default(5),
  compressionStrength: z.enum(['C20/25', 'C25/30', 'C30/37', 'C35/45', 'C40/50']).default('C25/30'),
  reinforcementRatio: z.number().min(0).max(5).default(1.5),
  laborRate: z.number().min(15).max(150).default(45),
  materialCostPerM3: z.number().min(50).max(500).default(120),
  usePump: z.boolean().default(false),
});

function evaluateAllFormulas(input: Concrete_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["baseVolume"] = 0;
  try { results["adjustedVolume"] = (results["baseVolume"] ?? 0) * (1 + input.wasteFactor / 100); } catch { results["adjustedVolume"] = 0; }
  try { results["steelVolume"] = (results["adjustedVolume"] ?? 0) * (input.reinforcementRatio / 100); } catch { results["steelVolume"] = 0; }
  try { results["netConcreteVolume"] = (results["adjustedVolume"] ?? 0) - (results["steelVolume"] ?? 0); } catch { results["netConcreteVolume"] = 0; }
  try { results["materialCost"] = (results["netConcreteVolume"] ?? 0) * input.materialCostPerM3; } catch { results["materialCost"] = 0; }
  try { results["laborHours"] = (results["netConcreteVolume"] ?? 0) * 1.2 + (input.usePump ? 2 : 0); } catch { results["laborHours"] = 0; }
  try { results["totalCost"] = (results["materialCost"] ?? 0) + ((results["laborHours"] ?? 0) * input.laborRate) + (input.usePump ? 250 : 0); } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateConcrete_volume_calculator(input: Concrete_volume_calculatorInput): Concrete_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
  const breakdown = {
    baseVolume: values["baseVolume"] ?? 0,
    adjustedVolume: values["adjustedVolume"] ?? 0,
    steelVolume: values["steelVolume"] ?? 0,
    netConcreteVolume: values["netConcreteVolume"] ?? 0,
    materialCost: values["materialCost"] ?? 0,
    laborHours: values["laborHours"] ?? 0,
    totalCost: values["totalCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Waste Factor","Reinforcement Ratio","Shape Complexity"];
  const suggestedActions: string[] = ["Implement lean construction techniques to reduce waste factor below 3%.","Review structural design to minimize reinforcement ratio without compromising strength.","Use concrete pump for complex shapes to reduce placement waste.","Order concrete in full truck batches (6 m³) to minimize leftover and cost."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-project comparison","Real-time cost escalation modeling"],
  };
}


export interface Concrete_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: { baseVolume: number; adjustedVolume: number; steelVolume: number; netConcreteVolume: number; materialCost: number; laborHours: number; totalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
