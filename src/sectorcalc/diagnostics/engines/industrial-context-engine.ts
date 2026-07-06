import type { DomainId, IndustrialContext } from "../diagnostic-types";
import { DOMAIN_REGISTRY } from "../domain-taxonomy";

const CONTEXT_MAP: Record<DomainId, Omit<IndustrialContext, "domain_id">> = {
  CNC_MACHINING: {
    process_description: "CNC machining operations including milling, turning, drilling, and multi-axis machining of metal and plastic components to tight dimensional tolerances",
    typical_tolerances: "±0.01 mm to ±0.10 mm for general machining; ±0.005 mm for precision grinding",
    common_defect_modes: ["Dimensional deviation beyond tolerance", "Surface finish degradation", "Tool wear-induced taper", "Chatter marks", "Thermal expansion errors"],
  },
  WELDING: {
    process_description: "Fusion welding processes (GMAW, GTAW, SMAW, FCAW) for joining metal components in structural, pressure vessel, and piping applications",
    typical_tolerances: "±1.0 mm to ±3.0 mm for fit-up; weld leg length ±0.5 mm",
    common_defect_modes: ["Porosity", "Incomplete fusion", "Undercut", "Excessive spatter", "Crack initiation", "Distortion beyond allowance"],
  },
  STEEL_CONSTRUCTION: {
    process_description: "Structural steel fabrication, bolted and welded connections, column/beam erection, and bracing systems for buildings and infrastructure",
    typical_tolerances: "AISC Code of Standard Practice tolerances: ±2.0 mm for member length, ±1.0 mm for bolt hole location",
    common_defect_modes: ["Bolt hole misalignment", "Connection eccentricity", "Out-of-plumb columns", "Weld discontinuity in moment connections", "Coating/paint failure"],
  },
  CONCRETE: {
    process_description: "Concrete batching, placement, consolidation, and curing for structural elements including slabs, beams, columns, and foundations",
    typical_tolerances: "±6 mm for slab thickness; ±10 mm for member alignment; slump 75-100 mm typical",
    common_defect_modes: ["Low compressive strength", "Excessive cracking", "Honeycombing", "Segregation", "Surface scaling", "Curing deficiency"],
  },
  ELECTRICAL: {
    process_description: "Industrial electrical power distribution, motor control centers, variable frequency drives, and instrumentation systems",
    typical_tolerances: "Voltage ±5%, frequency ±1%, insulation resistance >1 MΩ per kV",
    common_defect_modes: ["Insulation breakdown", "Overheating at terminations", "Phase imbalance", "Ground fault", "Component arcing"],
  },
  MECHANICAL: {
    process_description: "Rotating equipment (pumps, compressors, turbines), pressure vessels, piping systems, and mechanical power transmission",
    typical_tolerances: "Shaft alignment ±0.05 mm; bearing clearance per manufacturer specification; bolted joint torque ±10%",
    common_defect_modes: ["Shaft misalignment", "Bearing wear", "Seal leakage", "Vibration exceeding ISO 10816 limits", "Corrosion under insulation"],
  },
  LOGISTICS: {
    process_description: "Supply chain operations including inbound/outbound freight, fleet management, route optimization, and carrier performance monitoring",
    typical_tolerances: "On-time delivery ±1 day; transit time ±10% of planned",
    common_defect_modes: ["Shipment delay", "Damaged goods in transit", "Inventory discrepancy", "Carrier non-compliance", "Documentation error"],
  },
  FACILITY: {
    process_description: "Building systems management: HVAC, plumbing, fire protection, lighting, and structural maintenance for industrial and commercial facilities",
    typical_tolerances: "Temperature ±2°C; humidity ±10% RH; air flow ±15% of design",
    common_defect_modes: ["HVAC performance degradation", "Water leak detection failure", "Lighting system failure", "Fire damper stuck", "Structural sealant failure"],
  },
  AGRICULTURE: {
    process_description: "Agricultural machinery operation, irrigation systems, crop processing equipment, and storage facilities",
    typical_tolerances: "Application rate ±5%; pH ±0.5; moisture content ±2%",
    common_defect_modes: ["Equipment calibration drift", "Irrigation uniformity loss", "Engine overheating", "Hydraulic system leak", "Belt/sprocket wear"],
  },
  TEXTILE: {
    process_description: "Textile manufacturing processes including spinning, weaving, dyeing, finishing, and quality inspection",
    typical_tolerances: "Fabric GSM ±3%; color shade ΔE < 1.0; thread count ±2%",
    common_defect_modes: ["Color variation across batch", "Fabric weight deviation", "Tensile strength below spec", "Pilling", "Shrinkage beyond limit"],
  },
  WAREHOUSE: {
    process_description: "Warehouse operations: racking systems, inventory management, order picking, shipping/receiving, and material handling equipment",
    typical_tolerances: "Inventory accuracy >98%; order pick accuracy >99.5%; slot utilization ±10%",
    common_defect_modes: ["Racking damage", "Inventory misplacement", "Picking error", "Equipment collision", "Storage density inefficiency"],
  },
  RESTAURANT: {
    process_description: "Commercial kitchen operations: food preparation, cooking equipment, refrigeration, sanitation, and service systems",
    typical_tolerances: "Cooking temperature ±2°C; refrigeration 0-4°C; holding temperature >60°C",
    common_defect_modes: ["Refrigeration temperature excursion", "Cooking equipment calibration loss", "Grease trap blockage", "Ventilation hood inefficiency", "Dishwasher sanitization failure"],
  },
};

/**
 * Get industrial context for a given domain.
 *
 * Pure deterministic lookup from domain registry and context map.
 */
export function getIndustrialContext(domainId: DomainId): IndustrialContext {
  const entry = DOMAIN_REGISTRY[domainId];
  const context = CONTEXT_MAP[domainId];

  if (!entry || !context) {
    throw new Error(`No industrial context found for domain: ${domainId}`);
  }

  return {
    domain_id: domainId,
    ...context,
  };
}
