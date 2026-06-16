import type { FreeTrafficCategory } from "@/lib/tools/free-traffic-infer";

export type FreeTrafficCategoryMeta = {
  readonly id: FreeTrafficCategory;
  readonly labelKey: `categories.${FreeTrafficCategory}`;
  readonly descriptionKey: `categoryDescriptions.${FreeTrafficCategory}`;
  readonly order: number;
};

export const FREE_TRAFFIC_CATEGORY_META: readonly FreeTrafficCategoryMeta[] = [
  {
    id: "construction-measurement",
    labelKey: "categories.construction-measurement",
    descriptionKey: "categoryDescriptions.construction-measurement",
    order: 1,
  },
  {
    id: "finance-business",
    labelKey: "categories.finance-business",
    descriptionKey: "categoryDescriptions.finance-business",
    order: 2,
  },
  {
    id: "manufacturing-workshop",
    labelKey: "categories.manufacturing-workshop",
    descriptionKey: "categoryDescriptions.manufacturing-workshop",
    order: 3,
  },
  {
    id: "energy-carbon",
    labelKey: "categories.energy-carbon",
    descriptionKey: "categoryDescriptions.energy-carbon",
    order: 4,
  },
  {
    id: "logistics-travel",
    labelKey: "categories.logistics-travel",
    descriptionKey: "categoryDescriptions.logistics-travel",
    order: 5,
  },
  {
    id: "agriculture-food",
    labelKey: "categories.agriculture-food",
    descriptionKey: "categoryDescriptions.agriculture-food",
    order: 6,
  },
  {
    id: "everyday-life",
    labelKey: "categories.everyday-life",
    descriptionKey: "categoryDescriptions.everyday-life",
    order: 7,
  },
  {
    id: "math-statistics",
    labelKey: "categories.math-statistics",
    descriptionKey: "categoryDescriptions.math-statistics",
    order: 8,
  },
  {
    id: "conversion",
    labelKey: "categories.conversion",
    descriptionKey: "categoryDescriptions.conversion",
    order: 9,
  },
  {
    id: "health-body",
    labelKey: "categories.health-body",
    descriptionKey: "categoryDescriptions.health-body",
    order: 10,
  },
  {
    id: "physics-science",
    labelKey: "categories.physics-science",
    descriptionKey: "categoryDescriptions.physics-science",
    order: 11,
  },
  {
    id: "chemistry-science",
    labelKey: "categories.chemistry-science",
    descriptionKey: "categoryDescriptions.chemistry-science",
    order: 12,
  },
  {
    id: "engineering-science",
    labelKey: "categories.engineering-science",
    descriptionKey: "categoryDescriptions.engineering-science",
    order: 13,
  },
  {
    id: "food-cooking",
    labelKey: "categories.food-cooking",
    descriptionKey: "categoryDescriptions.food-cooking",
    order: 14,
  },
  {
    id: "date-time",
    labelKey: "categories.date-time",
    descriptionKey: "categoryDescriptions.date-time",
    order: 15,
  },
  {
    id: "education-academic",
    labelKey: "categories.education-academic",
    descriptionKey: "categoryDescriptions.education-academic",
    order: 16,
  },
  {
    id: "ecology-environment",
    labelKey: "categories.ecology-environment",
    descriptionKey: "categoryDescriptions.ecology-environment",
    order: 17,
  },
  {
    id: "gaming-entertainment",
    labelKey: "categories.gaming-entertainment",
    descriptionKey: "categoryDescriptions.gaming-entertainment",
    order: 18,
  },
  {
    id: "hobbies-diy",
    labelKey: "categories.hobbies-diy",
    descriptionKey: "categoryDescriptions.hobbies-diy",
    order: 19,
  },
] as const;

export const DEFAULT_FREE_TRAFFIC_CATEGORY: FreeTrafficCategory = "construction-measurement";

export function getOrderedFreeTrafficCategories(): readonly FreeTrafficCategoryMeta[] {
  return [...FREE_TRAFFIC_CATEGORY_META].sort((a, b) => a.order - b.order);
}

export function countToolsInCategory(
  tools: readonly { category: FreeTrafficCategory }[],
  category: FreeTrafficCategory
): number {
  return tools.filter((tool) => tool.category === category).length;
}
