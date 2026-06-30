/** P81 shape guide slugs + input keys (no JSX — safe for vitest / audit runners). */
export type ShapeDimensionGuideMeta = {
  readonly slug: string;
  readonly inputKeys: readonly string[];
};

export const SHAPE_DIMENSION_GUIDE_META: readonly ShapeDimensionGuideMeta[] = [
  {
    slug: "paint-coverage-cost-check",
    inputKeys: ["paintableArea", "coveragePerUnit", "coats", "unitPrice", "wasteAllowancePct"],
  },
  {
    slug: "home-renovation-m2",
    inputKeys: ["areaM2", "unitCostPerM2", "demolitionCost", "contingencyPct"],
  },
  {
    slug: "kwh-consumption-check",
    inputKeys: [
      "powerKw",
      "runtimeHours",
      "energyConsumptionKwh",
      "tariffPerKwh",
      "peakDemandKw",
      "efficiencyPercent",
    ],
  },
  {
    slug: "plumbing-fixture-cost-check",
    inputKeys: ["fixtureCount", "unitMaterialCost", "laborHoursPerFixture", "laborRate", "overheadPct"],
  },
  {
    slug: "pressure-vessel-wall-thickness-calculator",
    inputKeys: ["designPressureBar", "diameterMm", "allowableStressMpa", "weldEfficiency"],
  },
  {
    slug: "electrical-panel-rework-cost",
    inputKeys: [
      "panelRevenue",
      "wiringHours",
      "estimatedHours",
      "laborRate",
      "inspectionFailCost",
      "testEquipmentCost",
    ],
  },
  { slug: "area-converter", inputKeys: ["value", "fromUnit"] },
  { slug: "length-converter", inputKeys: ["value", "fromUnit"] },
  { slug: "volume-converter", inputKeys: ["value", "fromUnit"] },
  { slug: "weight-converter", inputKeys: ["value", "fromUnit"] },
];

const META_BY_SLUG = new Map<string, ShapeDimensionGuideMeta>(
  SHAPE_DIMENSION_GUIDE_META.map((entry) => [entry.slug, entry]),
);

export function getShapeDimensionGuideMeta(slug: string): ShapeDimensionGuideMeta | null {
  return META_BY_SLUG.get(slug) ?? null;
}

export function listShapeDimensionGuideSlugs(): readonly string[] {
  return SHAPE_DIMENSION_GUIDE_META.map((entry) => entry.slug);
}
