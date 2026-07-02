/* eslint-disable */
// @ts-nocheck

import { sectorCalcPremium152Seed } from "@/data/premium/sectorcalc-premium-152.seed";

export type Premium152SeedCategory = (typeof sectorCalcPremium152Seed.categories)[number];

/** Explicit shape - avoids TS union-size collapse on 152-item `as const` tools array. */
export type Premium152SeedTool = {
  readonly id: number;
  readonly slug: string;
  readonly trTitle: string;
  readonly categorySlug: string;
  readonly tier: "premium";
  readonly formulaNote: string;
  readonly pain: string;
  readonly formulaStatus: "source-formula-provided" | "needs-contract" | string;
  readonly publicStatus: "active" | "active-after-contract-validation" | "blocked" | string;
};

const EXPECTED_TOOL_COUNT = 152;
const EXPECTED_CATEGORY_COUNT = 20;

function expectedIdRange(count: number): readonly number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

export function validatePremium152Seed(): void {
  const errors: string[] = [];
  const { totalTools, categories, tools } = sectorCalcPremium152Seed;

  if (totalTools !== EXPECTED_TOOL_COUNT) {
    errors.push(`totalTools must be ${EXPECTED_TOOL_COUNT}, got ${totalTools}`);
  }

  if (categories.length !== EXPECTED_CATEGORY_COUNT) {
    errors.push(`categories.length must be ${EXPECTED_CATEGORY_COUNT}, got ${categories.length}`);
  }

  if (tools.length !== EXPECTED_TOOL_COUNT) {
    errors.push(`tools.length must be ${EXPECTED_TOOL_COUNT}, got ${tools.length}`);
  }

  const toolIds = tools.map((tool) => tool.id);
  const expectedIds = expectedIdRange(EXPECTED_TOOL_COUNT);
  const toolIdSet = new Set<number>(toolIds);
  for (const id of expectedIds) {
    if (!toolIdSet.has(id)) {
      errors.push(`missing tool id ${id}`);
    }
  }

  const categorySlugSet = new Set(categories.map((category) => category.slug));
  let categoryIdSum = 0;

  for (const category of categories) {
    if (category.count !== category.ids.length) {
      errors.push(
        `category ${category.slug}: count ${category.count} !== ids.length ${category.ids.length}`,
      );
    }

    categoryIdSum += category.ids.length;

    for (const id of category.ids) {
      const tool = tools.find((entry) => entry.id === id);
      if (!tool) {
        errors.push(`category ${category.slug} references missing tool id ${id}`);
        continue;
      }
      if (tool.categorySlug !== category.slug) {
        errors.push(
          `tool id ${id} categorySlug ${tool.categorySlug} !== category ${category.slug}`,
        );
      }
    }
  }

  if (categoryIdSum !== EXPECTED_TOOL_COUNT) {
    errors.push(`category ids sum must be ${EXPECTED_TOOL_COUNT}, got ${categoryIdSum}`);
  }

  const slugSet = new Set<string>();
  for (const tool of tools) {
    if (!categorySlugSet.has(tool.categorySlug)) {
      errors.push(`tool id ${tool.id} has unknown categorySlug ${tool.categorySlug}`);
    }
    if (slugSet.has(tool.slug)) {
      errors.push(`duplicate slug ${tool.slug}`);
    }
    slugSet.add(tool.slug);
  }

  const idSet = new Set<number>();
  for (const tool of tools) {
    if (idSet.has(tool.id)) {
      errors.push(`duplicate id ${tool.id}`);
    }
    idSet.add(tool.id);
  }

  if (errors.length > 0) {
    throw new Error(`Premium 152 seed validation failed:\n${errors.join("\n")}`);
  }
}

export function getPremium152Categories(): readonly Premium152SeedCategory[] {
  validatePremium152Seed();
  return sectorCalcPremium152Seed.categories;
}

export function getPremium152Tools(): readonly Premium152SeedTool[] {
  validatePremium152Seed();
  return sectorCalcPremium152Seed.tools as readonly Premium152SeedTool[];
}

export function getPremium152ToolsByCategory(
  categorySlug: string,
): readonly Premium152SeedTool[] {
  validatePremium152Seed();
  return (sectorCalcPremium152Seed.tools as readonly Premium152SeedTool[]).filter(
    (tool) => tool.categorySlug === categorySlug,
  );
}

export function getPremium152CategoryBySlug(
  categorySlug: string,
): Premium152SeedCategory | undefined {
  validatePremium152Seed();
  return sectorCalcPremium152Seed.categories.find((category) => category.slug === categorySlug);
}

export const PREMIUM_152_SEED = sectorCalcPremium152Seed;
