import {
  getToolGuideSpec as getLegacyToolGuideSpec,
  listToolGuideSpecSlugs,
} from "@/lib/features/tool-guides/premium-input-guide-specs";
import type { ToolGuideSpec as LegacyToolGuideSpec } from "@/lib/features/tool-guides/tool-guide-spec";
import type { ToolGuideSpec } from "@/lib/features/tools/guide/tool-guide-types";

function toPremiumGuideSpec(spec: LegacyToolGuideSpec): ToolGuideSpec {
  return {
    slug: spec.slug,
    guideType: spec.guideType,
    titleKey: spec.titleKey,
    descriptionKey: spec.descriptionKey,
    inputMap: spec.inputMap.map((entry) => ({
      inputKey: entry.inputKey,
      labelKey: entry.labelKey,
      visualRole: entry.visualRole,
      nodeId: entry.nodeId,
    })),
    localeKeys: [spec.titleKey, spec.descriptionKey],
    isGenericFallback: false,
  };
}

export function getPremiumGuideSpec(slug: string): ToolGuideSpec | null {
  const spec = getLegacyToolGuideSpec(slug);
  return spec ? toPremiumGuideSpec(spec) : null;
}

export function listPremiumGuideSpecSlugs(): readonly string[] {
  return listToolGuideSpecSlugs();
}

export function hasPremiumGuideSpec(slug: string): boolean {
  return getPremiumGuideSpec(slug) !== null;
}
