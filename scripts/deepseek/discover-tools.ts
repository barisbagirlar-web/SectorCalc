import fs from "node:fs";
import path from "node:path";
import type { DiscoveredTool, ToolDiscoverySource } from "./types";
import { PROJECT_ROOT, loadEnvLocal } from "./load-env";

const REVENUE_TOOLS_PATH = path.join(PROJECT_ROOT, "src/lib/tools/revenue-tools.ts");
const INDUSTRY_REGISTRY_PATH = path.join(PROJECT_ROOT, "src/lib/tools/industry-registry.ts");
const CONTRACTS_DIR = path.join(PROJECT_ROOT, "src/lib/formula-governance/contracts");
const LOCATOR_FILES = [
  path.join(PROJECT_ROOT, "src/lib/formula-governance/oracle/production-formula-locator.ts"),
  path.join(
    PROJECT_ROOT,
    "src/lib/formula-governance/oracle/premium-schema-extended-production-locators.ts",
  ),
] as const;

const SLUG_PATTERN = /[a-z0-9]+(?:-[a-z0-9]+)+/;

function readText(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function isLikelyToolSlug(value: string): boolean {
  return SLUG_PATTERN.test(value) && value.length >= 3 && value.length <= 120;
}

function extractRevenueRoles(content: string): Map<string, "free" | "paid"> {
  const roles = new Map<string, "free" | "paid">();
  for (const match of content.matchAll(/freeSlug:\s*"([^"]+)"/g)) {
    const slug = match[1];
    if (slug && isLikelyToolSlug(slug)) {
      roles.set(slug, "free");
    }
  }
  for (const match of content.matchAll(/paidSlug:\s*"([^"]+)"/g)) {
    const slug = match[1];
    if (slug && isLikelyToolSlug(slug)) {
      roles.set(slug, "paid");
    }
  }
  return roles;
}

function isPremiumCandidate(tool: DiscoveredTool): boolean {
  if (tool.revenueRole === "paid") {
    return true;
  }
  return tool.slug.includes("premium") || tool.slug.includes("paid");
}

function extractContractSlugs(): Map<string, string> {
  const bySlug = new Map<string, string>();
  if (!fs.existsSync(CONTRACTS_DIR)) {
    return bySlug;
  }

  for (const fileName of fs.readdirSync(CONTRACTS_DIR)) {
    if (!fileName.endsWith(".ts")) {
      continue;
    }
    const filePath = path.join(CONTRACTS_DIR, fileName);
    const content = readText(filePath);
    for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      const slug = match[1];
      if (slug && isLikelyToolSlug(slug)) {
        bySlug.set(slug, content.slice(0, 4_000));
      }
    }
  }

  return bySlug;
}

function extractLocatorSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const filePath of LOCATOR_FILES) {
    const content = readText(filePath);
    for (const match of content.matchAll(/slug:\s*"([^"]+)"/g)) {
      const slug = match[1];
      if (slug && isLikelyToolSlug(slug)) {
        slugs.add(slug);
      }
    }
  }
  return slugs;
}

function extractRevenueSnippet(content: string, slug: string): string | undefined {
  const freeIndex = content.indexOf(`freeSlug: "${slug}"`);
  const paidIndex = content.indexOf(`paidSlug: "${slug}"`);
  const index = freeIndex >= 0 ? freeIndex : paidIndex;
  if (index < 0) {
    return undefined;
  }
  return content.slice(Math.max(0, index - 250), index + 1_500).trim();
}

function buildContextSnippet(input: {
  readonly slug: string;
  readonly revenueToolsText: string;
  readonly industryRegistryText: string;
  readonly contractSnippet?: string;
}): string {
  const chunks: string[] = [`slug: ${input.slug}`];

  const revenueSnippet = extractRevenueSnippet(input.revenueToolsText, input.slug);
  if (revenueSnippet) {
    chunks.push(`revenue-tools excerpt:\n${revenueSnippet}`);
  }

  if (input.contractSnippet) {
    chunks.push(`formula-governance contract excerpt:\n${input.contractSnippet.trim()}`);
  }

  const industrySlugs = [...input.industryRegistryText.matchAll(/slug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  if (industrySlugs.length > 0) {
    chunks.push(`industry-registry sectors: ${industrySlugs.slice(0, 12).join(", ")}`);
  }

  return chunks.join("\n\n").slice(0, 8_000);
}

export function discoverTools(): DiscoveredTool[] {
  const revenueToolsText = readText(REVENUE_TOOLS_PATH);
  const industryRegistryText = readText(INDUSTRY_REGISTRY_PATH);
  const contractSnippets = extractContractSlugs();
  const locatorSlugs = extractLocatorSlugs();
  const revenueRoles = extractRevenueRoles(revenueToolsText);
  const discovered = new Map<string, DiscoveredTool>();

  function upsert(slug: string, source: ToolDiscoverySource): void {
    const existing = discovered.get(slug);
    const sources = existing ? [...new Set([...existing.sources, source])] : [source];
    discovered.set(slug, {
      slug,
      sources,
      revenueRole: revenueRoles.get(slug) ?? existing?.revenueRole,
      source:
        revenueRoles.get(slug) === "paid"
          ? "paidSlug"
          : revenueRoles.get(slug) === "free"
            ? "freeSlug"
            : existing?.source,
      contextSnippet: buildContextSnippet({
        slug,
        revenueToolsText,
        industryRegistryText,
        contractSnippet: contractSnippets.get(slug),
      }),
    });
  }

  for (const slug of revenueRoles.keys()) {
    upsert(slug, "revenue-tools");
  }

  for (const slug of contractSnippets.keys()) {
    upsert(slug, "formula-governance-contract");
  }

  for (const slug of locatorSlugs) {
    upsert(slug, "formula-governance-locator");
  }

  return [...discovered.values()].sort((left, right) => left.slug.localeCompare(right.slug));
}

/** Async alias for scripts that expect Promise-based discovery. */
export async function discoverAllTools(): Promise<DiscoveredTool[]> {
  loadEnvLocal();
  return discoverTools();
}

export function discoverPremiumTools(): DiscoveredTool[] {
  return discoverTools().filter(isPremiumCandidate);
}
