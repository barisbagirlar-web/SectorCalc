export const DOMAIN_IDS = [
  "CNC_MACHINING",
  "WELDING",
  "STEEL_CONSTRUCTION",
  "CONCRETE",
  "ELECTRICAL",
  "MECHANICAL",
  "LOGISTICS",
  "FACILITY",
  "AGRICULTURE",
  "TEXTILE",
  "WAREHOUSE",
  "RESTAURANT",
] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export const CORE_DOMAINS: readonly DomainId[] = [
  "CNC_MACHINING",
  "WELDING",
  "STEEL_CONSTRUCTION",
  "CONCRETE",
  "ELECTRICAL",
  "MECHANICAL",
] as const;

export const ADVISORY_DOMAINS: readonly DomainId[] = [
  "LOGISTICS",
  "FACILITY",
  "AGRICULTURE",
  "TEXTILE",
  "WAREHOUSE",
  "RESTAURANT",
] as const;

export function isCoreDomain(id: string): id is DomainId {
  return (CORE_DOMAINS as readonly string[]).includes(id);
}

export function isAdvisoryDomain(id: string): id is DomainId {
  return (ADVISORY_DOMAINS as readonly string[]).includes(id);
}

export function assertValidDomainId(id: string): asserts id is DomainId {
  if (!(DOMAIN_IDS as readonly string[]).includes(id)) {
    throw new Error(`Invalid domain ID: "${id}". Must be one of: ${DOMAIN_IDS.join(", ")}`);
  }
}

export interface DomainDescriptor {
  id: DomainId;
  label: string;
  description: string;
  category: "core" | "advisory";
}

export const DOMAIN_REGISTRY: Record<DomainId, DomainDescriptor> = {
  CNC_MACHINING: {
    id: "CNC_MACHINING",
    label: "CNC Machining",
    description: "Precision machining operations including milling, turning, and multi-axis CNC processes",
    category: "core",
  },
  WELDING: {
    id: "WELDING",
    label: "Welding",
    description: "Fusion and solid-state welding processes, joint integrity assessment",
    category: "core",
  },
  STEEL_CONSTRUCTION: {
    id: "STEEL_CONSTRUCTION",
    label: "Steel Construction",
    description: "Structural steel fabrication, erection, and connection quality",
    category: "core",
  },
  CONCRETE: {
    id: "CONCRETE",
    label: "Concrete",
    description: "Concrete mix design, placement, curing, and structural assessment",
    category: "core",
  },
  ELECTRICAL: {
    id: "ELECTRICAL",
    label: "Electrical",
    description: "Industrial electrical systems, motor control, and power distribution",
    category: "core",
  },
  MECHANICAL: {
    id: "MECHANICAL",
    label: "Mechanical",
    description: "General mechanical systems, rotating equipment, and pressure vessels",
    category: "core",
  },
  LOGISTICS: {
    id: "LOGISTICS",
    label: "Logistics",
    description: "Supply chain, material handling, and transportation operations",
    category: "advisory",
  },
  FACILITY: {
    id: "FACILITY",
    label: "Facility",
    description: "Facility maintenance, HVAC, and building systems management",
    category: "advisory",
  },
  AGRICULTURE: {
    id: "AGRICULTURE",
    label: "Agriculture",
    description: "Agricultural equipment, irrigation, and crop processing systems",
    category: "advisory",
  },
  TEXTILE: {
    id: "TEXTILE",
    label: "Textile",
    description: "Textile manufacturing, dyeing, and finishing processes",
    category: "advisory",
  },
  WAREHOUSE: {
    id: "WAREHOUSE",
    label: "Warehouse",
    description: "Warehouse operations, racking systems, and inventory management",
    category: "advisory",
  },
  RESTAURANT: {
    id: "RESTAURANT",
    label: "Restaurant",
    description: "Commercial kitchen equipment, food safety, and service operations",
    category: "advisory",
  },
};
