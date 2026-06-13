import {
  getShapeDimensionGuideMeta,
  listShapeDimensionGuideSlugs,
} from "@/lib/tool-guides/shape-dimension-guide-meta";
import {
  TOOL_GUIDE_QUALITY_DEFAULT,
  type ToolGuideInputMapEntry,
  type ToolGuideSpec,
  type ToolGuideVisualRole,
} from "@/lib/tool-guides/tool-guide-spec";
import { S2_LOW_RISK_ACTIVATION_GUIDE_SPECS } from "@/lib/tool-guides/s2-low-risk-activation-guide-specs";
import { S3_LOW_RISK_ACTIVATION_GUIDE_SPECS } from "@/lib/tool-guides/s3-low-risk-activation-guide-specs";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";

const PREMIUM_PILOT_SPECS: readonly ToolGuideSpec[] = [
  {
    slug: "cnc-quote-risk-analyzer",
    guideType: "quote_risk",
    titleKey: "inputGuide.tools.cncQuoteRisk.title",
    descriptionKey: "inputGuide.quoteRisk.description",
    inputMap: [
      { inputKey: "machineRate", visualRole: "driver", nodeId: "machine-rate" },
      { inputKey: "plannedHours", visualRole: "primary", nodeId: "planned-hours" },
      { inputKey: "downtimeHours", visualRole: "driver", nodeId: "downtime" },
      { inputKey: "materialCost", visualRole: "secondary", nodeId: "material" },
      { inputKey: "scrapRate", visualRole: "constraint", nodeId: "scrap" },
      { inputKey: "availability", visualRole: "driver", nodeId: "availability" },
      { inputKey: "performance", visualRole: "driver", nodeId: "performance" },
      { inputKey: "quality", visualRole: "driver", nodeId: "quality" },
      { inputKey: "quotedPrice", visualRole: "output", nodeId: "quoted-price" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
  {
    slug: "change-order-impact-analyzer",
    guideType: "cost_breakdown",
    titleKey: "inputGuide.tools.changeOrder.title",
    descriptionKey: "inputGuide.costBreakdown.description",
    inputMap: [
      { inputKey: "dailySiteCost", visualRole: "driver", nodeId: "site-cost" },
      { inputKey: "delayDays", visualRole: "primary", nodeId: "delay-days" },
      { inputKey: "laborBudget", visualRole: "secondary", nodeId: "labor-budget" },
      { inputKey: "laborOverrunPercent", visualRole: "constraint", nodeId: "labor-overrun" },
      { inputKey: "materialBudget", visualRole: "secondary", nodeId: "material-budget" },
      { inputKey: "materialOverrunPercent", visualRole: "constraint", nodeId: "material-overrun" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
  {
    slug: "office-cleaning-bid-optimizer",
    guideType: "cost_breakdown",
    titleKey: "inputGuide.tools.officeCleaning.title",
    descriptionKey: "inputGuide.costBreakdown.description",
    inputMap: [
      { inputKey: "monthlyRent", visualRole: "driver", nodeId: "rent" },
      { inputKey: "totalSqm", visualRole: "primary", nodeId: "floor-area" },
      { inputKey: "unusedSpacePercent", visualRole: "constraint", nodeId: "unused-space" },
      { inputKey: "handlingOverrunHours", visualRole: "driver", nodeId: "handling-hours" },
      { inputKey: "hourlyCost", visualRole: "secondary", nodeId: "hourly-cost" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
  {
    slug: "route-optimization-analyzer",
    guideType: "process_flow",
    titleKey: "inputGuide.tools.routeOptimization.title",
    descriptionKey: "inputGuide.processFlow.description",
    inputMap: [
      { inputKey: "distanceKm", visualRole: "primary", nodeId: "distance" },
      { inputKey: "costPerKm", visualRole: "driver", nodeId: "cost-per-km" },
      { inputKey: "emptyReturnPercent", visualRole: "constraint", nodeId: "empty-return" },
      { inputKey: "driverHours", visualRole: "driver", nodeId: "driver-hours" },
      { inputKey: "driverRate", visualRole: "secondary", nodeId: "driver-rate" },
      { inputKey: "tolls", visualRole: "secondary", nodeId: "tolls" },
      { inputKey: "quotedFreightPrice", visualRole: "output", nodeId: "quoted-price" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
  {
    slug: "logistics-route-loss",
    guideType: "process_flow",
    titleKey: "inputGuide.tools.routeOptimization.title",
    descriptionKey: "inputGuide.processFlow.description",
    inputMap: [
      { inputKey: "distanceKm", visualRole: "primary", nodeId: "distance" },
      { inputKey: "costPerKm", visualRole: "driver", nodeId: "cost-per-km" },
      { inputKey: "emptyReturnPercent", visualRole: "constraint", nodeId: "empty-return" },
      { inputKey: "driverHours", visualRole: "driver", nodeId: "driver-hours" },
      { inputKey: "driverRate", visualRole: "secondary", nodeId: "driver-rate" },
      { inputKey: "tolls", visualRole: "secondary", nodeId: "tolls" },
      { inputKey: "quotedFreightPrice", visualRole: "output", nodeId: "quoted-price" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
  {
    slug: "energy-compressor-leak-cost",
    guideType: "process_flow",
    titleKey: "inputGuide.tools.compressorLeak.title",
    descriptionKey: "inputGuide.processFlow.description",
    inputMap: [
      { inputKey: "compressorKw", visualRole: "primary", nodeId: "compressor-kw" },
      { inputKey: "leakPercent", visualRole: "driver", nodeId: "leak-percent" },
      { inputKey: "operatingHours", visualRole: "driver", nodeId: "operating-hours" },
      { inputKey: "energyRate", visualRole: "secondary", nodeId: "energy-rate" },
    ],
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  },
];

function shapeRoleForIndex(index: number): ToolGuideVisualRole {
  if (index === 0) return "primary";
  if (index < 3) return "driver";
  return "secondary";
}

function shapeGuideToSpec(slug: string): ToolGuideSpec | null {
  const shape = getShapeDimensionGuideMeta(slug);
  if (!shape) {
    return null;
  }

  const inputMap: ToolGuideInputMapEntry[] = shape.inputKeys.map((inputKey, index) => ({
    inputKey,
    visualRole: shapeRoleForIndex(index),
    nodeId: inputKey.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase(),
  }));

  return {
    slug: shape.slug,
    guideType: "shape_dimension",
    titleKey: "inputGuide.shape.title",
    descriptionKey: "inputGuide.shape.description",
    inputMap,
    quality: TOOL_GUIDE_QUALITY_DEFAULT,
  };
}

function buildSpecRegistry(): Map<string, ToolGuideSpec> {
  const registry = new Map<string, ToolGuideSpec>();

  for (const spec of PREMIUM_PILOT_SPECS) {
    registry.set(spec.slug, spec);
  }

  for (const slug of listShapeDimensionGuideSlugs()) {
    const shapeSpec = shapeGuideToSpec(slug);
    if (shapeSpec) {
      registry.set(slug, shapeSpec);
    }
  }

  for (const spec of S2_LOW_RISK_ACTIVATION_GUIDE_SPECS) {
    registry.set(spec.slug, spec);
  }

  return registry;
}

const SPEC_REGISTRY = buildSpecRegistry();

export function getToolGuideSpec(slug: string): ToolGuideSpec | null {
  const normalized = slug.trim();

  const direct = SPEC_REGISTRY.get(normalized);
  if (direct) {
    return direct;
  }

  const schema = getPremiumSchemaForPaidSlug(normalized);
  if (schema) {
    const bySchemaId = SPEC_REGISTRY.get(schema.id);
    if (bySchemaId) {
      return bySchemaId;
    }
  }

  return shapeGuideToSpec(normalized);
}

export function listToolGuideSpecSlugs(): readonly string[] {
  return [...SPEC_REGISTRY.keys()].sort((a, b) => a.localeCompare(b));
}

export function listPremiumPilotGuideSlugs(): readonly string[] {
  return PREMIUM_PILOT_SPECS.map((spec) => spec.slug);
}
