"use server";

import { ACTIVE_FREE_TOOL_SLUGS, ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { industryRegistry } from "@/lib/features/tools/industry-registry";
import { getAllPremiumSchemas } from "@/lib/features/premium-schema/schema-registry";

export interface SearchResult {
  type: "free" | "pro" | "industry";
  label: string;
  href: string;
  description: string;
}

function slugToDisplayName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getProToolName(slug: string): string | null {
  try {
    const schema = getAllPremiumSchemas().find(
      (s) => s.id === slug || s.legacyPaidSlug === slug
    );
    if (schema?.name) return schema.name;
  } catch {
    // fallback
  }
  return null;
}

function getProToolDescription(slug: string): string {
  try {
    const schema = getAllPremiumSchemas().find(
      (s) => s.id === slug || s.legacyPaidSlug === slug
    );
    if (schema?.painStatement) return schema.painStatement;
  } catch {
    // fallback
  }
  return "Pro decision-support calculator with server-side execution and entitlement-gated access.";
}

export function buildFreeToolEntry(slug: string): SearchResult {
  return {
    type: "free",
    label: slugToDisplayName(slug),
    href: `/tools/free/${slug}`,
    description: "Free browser-first calculator for quick industrial estimates.",
  };
}

export function buildProToolEntry(slug: string): SearchResult {
  const name = getProToolName(slug) ?? slugToDisplayName(slug);
  const description = getProToolDescription(slug);
  return {
    type: "pro",
    label: name,
    href: `/tools/pro/${slug}`,
    description,
  };
}

export function buildIndustryEntry(industry: (typeof industryRegistry)[number]): SearchResult {
  return {
    type: "industry",
    label: industry.name,
    href: `/industries/${industry.slug}`,
    description: industry.description,
  };
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const slug of ACTIVE_FREE_TOOL_SLUGS) {
    results.push(buildFreeToolEntry(slug));
  }

  for (const slug of ACTIVE_PRO_TOOL_SLUGS) {
    results.push(buildProToolEntry(slug));
  }

  for (const ind of industryRegistry) {
    results.push(buildIndustryEntry(ind));
  }

  return results;
}

export function searchTools(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const index = buildSearchIndex();

  return index.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}
