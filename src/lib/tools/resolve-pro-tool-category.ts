/**
 * Resolve Pro Tool Category — helper to query PRO_TOOL_CATEGORY_MAP
 */

import { PRO_TOOL_CATEGORY_MAP } from "@/data/proToolCategoryMap";
import type { ProToolCategoryAssignment } from "@/data/proToolCategoryMap";
import { getProCategoryById } from "@/config/proToolCategories";
import type { ProCategoryId, DecisionFamily, RiskClass } from "@/config/proToolCategories";

export function getProToolCategoryAssignment(
  toolId: string,
): ProToolCategoryAssignment | undefined {
  return PRO_TOOL_CATEGORY_MAP[toolId];
}

export function getProToolPrimaryCategory(toolId: string): ProCategoryId | undefined {
  const assignment = getProToolCategoryAssignment(toolId);
  return assignment?.primaryCategoryId as ProCategoryId | undefined;
}

export function getProToolSecondaryCategories(toolId: string): readonly string[] {
  const assignment = getProToolCategoryAssignment(toolId);
  return assignment?.secondaryCategoryIds ?? [];
}

export function getProToolDecisionFamily(toolId: string): DecisionFamily | undefined {
  const assignment = getProToolCategoryAssignment(toolId);
  return assignment?.decisionFamily as DecisionFamily | undefined;
}

export function getProToolProfessionalSegments(toolId: string): readonly string[] {
  const assignment = getProToolCategoryAssignment(toolId);
  return assignment?.professionalSegments ?? [];
}

export function getProToolRiskClass(toolId: string): RiskClass | undefined {
  const assignment = getProToolCategoryAssignment(toolId);
  return assignment?.riskClass as RiskClass | undefined;
}

export function getProToolsByCategory(
  categoryId: string,
): Array<{ toolId: string; assignment: ProToolCategoryAssignment }> {
  const result: Array<{ toolId: string; assignment: ProToolCategoryAssignment }> = [];
  for (const [toolId, assignment] of Object.entries(PRO_TOOL_CATEGORY_MAP)) {
    if (assignment.primaryCategoryId === categoryId) {
      result.push({ toolId, assignment });
    }
  }
  return result.sort((a, b) => a.toolId.localeCompare(b.toolId));
}

export function countProToolsByCategory(categoryId: string): number {
  let count = 0;
  for (const assignment of Object.values(PRO_TOOL_CATEGORY_MAP)) {
    if (assignment.primaryCategoryId === categoryId) {
      count++;
    }
  }
  return count;
}

export function getAllProCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const assignment of Object.values(PRO_TOOL_CATEGORY_MAP)) {
    const catId = assignment.primaryCategoryId;
    counts[catId] = (counts[catId] || 0) + 1;
  }
  return counts;
}

export function getCategoryLabel(id: string): string {
  const cat = getProCategoryById(id);
  return cat?.label ?? id;
}

export function getCategoryShortLabel(id: string): string {
  const cat = getProCategoryById(id);
  return cat?.shortLabel ?? id;
}
