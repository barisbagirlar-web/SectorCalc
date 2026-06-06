import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";
import {
  getAllIndustryCategories,
  INDUSTRY_CATEGORY_LABELS,
  type IndustryCategory,
} from "@/lib/tools/industry-registry";

export type ToolCategoryGroup = {
  category: IndustryCategory;
  label: string;
  tools: Tool[];
};

export function groupToolsByCategory(tools: Tool[]): ToolCategoryGroup[] {
  return getAllIndustryCategories()
    .map((category) => ({
      category,
      label: INDUSTRY_CATEGORY_LABELS[category],
      tools: tools.filter((tool) => {
        const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
        return industry?.category === category;
      }),
    }))
    .filter((group) => group.tools.length > 0);
}
