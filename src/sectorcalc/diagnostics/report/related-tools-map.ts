import type { RelatedToolEntry, RelatedToolsSection } from "./diagnostic-report-types";

type ToolRef = Pick<RelatedToolEntry, "slug" | "label" | "reason">;

const ACTIVE_TOOLS = new Set<string>([
  "cnc-machining-cost-analyzer",
  "cnc-spindle-power-analyzer",
  "weld-strength-analyzer",
  "weld-volume-cost-analyzer",
  "welding-cost-per-meter",
  "beam-weight-analyzer",
  "steel-connection-capacity-check",
  "concrete-volume-cost-analyzer",
  "concrete-maturity-strength-check",
  "electrical-conductor-sizing",
  "electric-motor-running-cost",
  "bolt-torque-preload-analyzer",
  "hydraulic-cylinder-calculator",
  "asme-pressure-vessel-analyzer",
  "oee-calculator",
  "freight-cost-per-km-trip",
  "tool-hvac-capacity",
  "tool-concrete-volume-cost",
  "darcy-weisbach-pipe-flow-calculator",
  "tool-hydraulic-system-loss",
  "fabric-consumption-calculator",
  "recipe-cost-menu-price",
]);

function toEntry(ref: ToolRef): RelatedToolEntry {
  if (ACTIVE_TOOLS.has(ref.slug)) {
    return { ...ref, status: "ACTIVE" };
  }
  return { ...ref, status: "PLANNED" };
}

const DOMAIN_MAP: Record<string, ToolRef[]> = {
  CNC_MACHINING: [
    { slug: "cnc-machining-cost-analyzer", label: "CNC Machining Cost Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "cnc-spindle-power-analyzer", label: "CNC Spindle Power Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "cnc-quote-risk-tool", label: "CNC Quote Risk Tool", reason: "Planned — cost estimation extension" },
  ],
  WELDING: [
    { slug: "weld-strength-analyzer", label: "Weld Strength Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "weld-volume-cost-analyzer", label: "Weld Volume & Cost Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "welding-cost-per-meter", label: "Welding Cost Per Meter", reason: "Reference engine binding confirmed" },
    { slug: "welding-heat-input-calculator", label: "Welding Heat Input Calculator", reason: "Planned — heat input and cooling rate" },
  ],
  STEEL_CONSTRUCTION: [
    { slug: "beam-weight-analyzer", label: "Beam Weight Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "steel-connection-capacity-check", label: "Steel Connection Capacity Check", reason: "Reference engine binding confirmed" },
    { slug: "steel-quote-risk-tool", label: "Steel Quote Risk Tool", reason: "Planned — procurement risk" },
  ],
  CONCRETE: [
    { slug: "concrete-volume-cost-analyzer", label: "Concrete Volume & Cost Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "concrete-maturity-strength-check", label: "Concrete Maturity Strength Check", reason: "Reference engine binding confirmed" },
    { slug: "formwork-pressure-analyzer", label: "Formwork Lateral Pressure Analyzer", reason: "Planned — formwork design" },
  ],
  ELECTRICAL: [
    { slug: "electrical-conductor-sizing", label: "Electrical Conductor Sizing", reason: "Reference engine binding confirmed" },
    { slug: "electric-motor-running-cost", label: "Electric Motor Running Cost", reason: "Reference engine binding confirmed" },
    { slug: "power-quality-analyzer", label: "Power Quality Analyzer", reason: "Planned — harmonics and power factor" },
  ],
  MECHANICAL: [
    { slug: "bolt-torque-preload-analyzer", label: "Bolt Torque & Preload Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "hydraulic-cylinder-calculator", label: "Hydraulic Cylinder Calculator", reason: "Reference engine binding confirmed" },
    { slug: "asme-pressure-vessel-analyzer", label: "ASME Pressure Vessel Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "pipe-flow-friction-calculator", label: "Pipe Flow Friction Calculator", reason: "Planned — darcy-weisbach extension" },
  ],
  LOGISTICS: [
    { slug: "freight-cost-per-km-trip", label: "Freight Cost Per KM / Trip", reason: "Reference engine binding confirmed" },
    { slug: "logistics-dispatch-optimizer", label: "Logistics Dispatch Optimizer", reason: "Planned — route and load optimization" },
  ],
  FACILITY: [
    { slug: "tool-hvac-capacity", label: "HVAC Capacity Analyzer", reason: "Reference engine binding confirmed" },
    { slug: "facility-energy-benchmark", label: "Facility Energy Benchmark", reason: "Planned — energy audit integration" },
  ],
  AGRICULTURE: [
    { slug: "agriculture-equipment-cost-analyzer", label: "Agriculture Equipment Cost Analyzer", reason: "Planned — equipment lifecycle cost" },
  ],
  TEXTILE: [
    { slug: "fabric-consumption-calculator", label: "Fabric Consumption Calculator", reason: "Reference engine binding confirmed" },
    { slug: "textile-waste-risk-analyzer", label: "Textile Waste Risk Analyzer", reason: "Planned — waste reduction analysis" },
  ],
  WAREHOUSE: [
    { slug: "oee-calculator", label: "OEE Calculator", reason: "Reference engine binding confirmed" },
    { slug: "warehouse-utilization-analyzer", label: "Warehouse Utilization Analyzer", reason: "Planned — storage density analysis" },
  ],
  RESTAURANT: [
    { slug: "recipe-cost-menu-price", label: "Recipe Cost & Menu Price", reason: "Reference engine binding confirmed" },
    { slug: "kitchen-equipment-roi", label: "Kitchen Equipment ROI Calculator", reason: "Planned — commercial kitchen analysis" },
  ],
};

const RESOLVED_CACHE: Record<string, RelatedToolsSection> = {};

export function resolveRelatedTools(domainId: string): RelatedToolsSection {
  if (RESOLVED_CACHE[domainId]) {
    return RESOLVED_CACHE[domainId];
  }
  const refs = DOMAIN_MAP[domainId];
  if (!refs) {
    const empty: RelatedToolsSection = { tools: [] };
    RESOLVED_CACHE[domainId] = empty;
    return empty;
  }
  const section: RelatedToolsSection = {
    tools: refs.map(toEntry),
  };
  RESOLVED_CACHE[domainId] = section;
  return section;
}

export function getAllRelatedSlugs(): string[] {
  const slugs = new Set<string>();
  for (const refs of Object.values(DOMAIN_MAP)) {
    for (const ref of refs) {
      slugs.add(ref.slug);
    }
  }
  return Array.from(slugs).sort();
}
