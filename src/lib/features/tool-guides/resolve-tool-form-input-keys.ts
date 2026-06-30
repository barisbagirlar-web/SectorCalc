import { getPremiumCalculatorSchema, getPremiumSchemaForPaidSlug } from "@/lib/features/premium-schema/schema-registry";
import { getShapeDimensionGuideMeta } from "@/lib/features/tool-guides/shape-dimension-guide-meta";
import { getToolGuideSpec } from "@/lib/features/tool-guides/premium-input-guide-specs";
import { getFreeTrafficToolBySlug } from "@/lib/features/tools/free-traffic-catalog";
import {
  getRevenueToolByFreeSlug,
  getRevenueToolByPaidSlug,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/features/tools/revenue-tools";

/** Resolve production form input keys for guide policy matching. */
export function resolveToolFormInputKeys(slug: string): readonly string[] {
  const schemaById = getPremiumCalculatorSchema(slug);
  if (schemaById?.inputs?.length) {
    return schemaById.inputs.map((input) => input.id);
  }

  const premiumSchema = getPremiumSchemaForPaidSlug(slug);
  if (premiumSchema?.inputs?.length) {
    return premiumSchema.inputs.map((input) => input.id);
  }

  const revenuePaid =
    getRevenueToolByPaidSlug(slug) ?? getRevenueToolByPremiumRouteSlug(slug);
  if (revenuePaid?.paidInputs?.length) {
    return revenuePaid.paidInputs.map((input) => input.key);
  }

  const revenueFree = getRevenueToolByFreeSlug(slug);
  if (revenueFree?.freeInputs?.length) {
    return revenueFree.freeInputs.map((input) => input.key);
  }

  const traffic = getFreeTrafficToolBySlug(slug);
  if (traffic?.inputs?.length) {
    return traffic.inputs.map((input) => input.key);
  }

  const guideSpec = getToolGuideSpec(slug);
  if (guideSpec?.inputMap?.length) {
    return guideSpec.inputMap.map((entry) => entry.inputKey);
  }

  const shapeGuide = getShapeDimensionGuideMeta(slug);
  if (shapeGuide?.inputKeys?.length) {
    return shapeGuide.inputKeys;
  }

  return [];
}
