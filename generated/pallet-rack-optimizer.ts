// Auto-generated from pallet-rack-optimizer-schema.json
import * as z from 'zod';

export interface Pallet_rack_optimizerInput {
  rack_height_mm: number;
  pallet_depth_mm: number;
  pallet_width_mm: number;
  pallet_height_mm: number;
  beam_thickness_mm: number;
  clearance_vertical_mm: number;
  aisle_width_mm: number;
  rack_length_mm: number;
  num_bays: number;
  num_levels: number;
  pallet_weight_kg: number;
  utilization_rate: number;
  storage_strategy: string;
  forklift_type: string;
  seismic_zone: string;
  include_beam_deflection_check: boolean;
}

export const Pallet_rack_optimizerInputSchema = z.object({
  rack_height_mm: z.number().min(3000).max(18000).default(12000),
  pallet_depth_mm: z.number().min(800).max(1500).default(1200),
  pallet_width_mm: z.number().min(800).max(1200).default(1000),
  pallet_height_mm: z.number().min(500).max(2500).default(1500),
  beam_thickness_mm: z.number().min(50).max(200).default(100),
  clearance_vertical_mm: z.number().min(50).max(300).default(100),
  aisle_width_mm: z.number().min(2000).max(5000).default(3000),
  rack_length_mm: z.number().min(1800).max(3600).default(2700),
  num_bays: z.number().min(1).max(100).default(10),
  num_levels: z.number().min(1).max(10).default(5),
  pallet_weight_kg: z.number().min(100).max(2000).default(800),
  utilization_rate: z.number().min(0).max(100).default(75),
  storage_strategy: z.enum(['FIFO', 'LIFO', 'Random', 'ABC']).default('FIFO'),
  forklift_type: z.enum(['Counterbalance', 'Reach', 'VNA', 'Turret']).default('Reach'),
  seismic_zone: z.enum(['Zone 0 (None)', 'Zone 1 (Low)', 'Zone 2 (Moderate)', 'Zone 3 (High)']).default('Zone 1 (Low)'),
  include_beam_deflection_check: z.boolean().default(true),
});

function evaluateAllFormulas(input: Pallet_rack_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["usable_height_per_level"] = input.rack_height_mm / input.num_levels - input.beam_thickness_mm; } catch { results["usable_height_per_level"] = 0; }
  try { results["max_pallets_per_bay"] = Math.floor(input.rack_length_mm / input.pallet_width_mm) * input.num_levels; } catch { results["max_pallets_per_bay"] = 0; }
  try { results["total_pallet_positions"] = (results["max_pallets_per_bay"] ?? 0) * input.num_bays; } catch { results["total_pallet_positions"] = 0; }
  try { results["occupied_positions"] = (results["total_pallet_positions"] ?? 0) * (input.utilization_rate / 100); } catch { results["occupied_positions"] = 0; }
  try { results["total_stored_weight_kg"] = (results["occupied_positions"] ?? 0) * input.pallet_weight_kg; } catch { results["total_stored_weight_kg"] = 0; }
  try { results["floor_space_utilization"] = ((results["total_pallet_positions"] ?? 0) * input.pallet_depth_mm * input.pallet_width_mm) / (input.rack_length_mm * input.num_bays * (rack_depth_mm + input.aisle_width_mm)); } catch { results["floor_space_utilization"] = 0; }
  results["throughput_index"] = 0;
  return results;
}


export function calculatePallet_rack_optimizer(input: Pallet_rack_optimizerInput): Pallet_rack_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overall_efficiency_score"] ?? 0;
  const breakdown = {
    space_efficiency: values["space_efficiency"] ?? 0,
    throughput_efficiency: values["throughput_efficiency"] ?? 0,
    structural_safety_margin: values["structural_safety_margin"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Vertical Air Gap Loss","Aisle Inefficiency Loss","Beam Deflection Risk"];
  const suggestedActions: string[] = ["Reduce Vertical Clearance","Optimize Aisle Width","Rebalance Utilization","Upgrade Beam Sections"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Real-time structural load monitoring"],
  };
}


export interface Pallet_rack_optimizerOutput {
  totalWasteCost: number;
  breakdown: { space_efficiency: number; throughput_efficiency: number; structural_safety_margin: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
