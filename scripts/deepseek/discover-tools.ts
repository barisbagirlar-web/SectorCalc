import fs from "node:fs";
import path from "node:path";
import type { DiscoveredTool, ToolDiscoverySource } from "./types";
import { PROJECT_ROOT, loadEnvLocal } from "./load-env";

const REVENUE_TOOLS_PATH = path.join(PROJECT_ROOT, "src/lib/tools/revenue-tools.ts");
const INDUSTRY_REGISTRY_PATH = path.join(PROJECT_ROOT, "src/lib/tools/industry-registry.ts");
const AI_INDEX_PATH = path.join(PROJECT_ROOT, "public/ai-tool-index.json");
const PREMIUM_SLUGS_PATH = path.join(PROJECT_ROOT, "premium-slugs.json");
const FREE_SLUGS_PATH = path.join(PROJECT_ROOT, "free-slugs.json");
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

type AiIndexToolRecord = {
  readonly slug: string;
  readonly title?: Readonly<Record<string, string>>;
  readonly description?: Readonly<Record<string, string>>;
  readonly tier?: string;
  readonly categorySlug?: string;
};

function readSlugList(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter((entry): entry is string => typeof entry === "string" && isLikelyToolSlug(entry));
}

function loadAiToolIndexMap(): Map<string, AiIndexToolRecord> {
  if (!fs.existsSync(AI_INDEX_PATH)) {
    return new Map();
  }
  const parsed = JSON.parse(fs.readFileSync(AI_INDEX_PATH, "utf8")) as { tools?: readonly AiIndexToolRecord[] };
  const map = new Map<string, AiIndexToolRecord>();
  for (const tool of parsed.tools ?? []) {
    if (tool.slug && isLikelyToolSlug(tool.slug)) {
      map.set(tool.slug, tool);
    }
  }
  return map;
}

function buildContextSnippet(input: {
  readonly slug: string;
  readonly revenueToolsText: string;
  readonly industryRegistryText: string;
  readonly contractSnippet?: string;
  readonly aiTool?: AiIndexToolRecord;
}): string {
  const chunks: string[] = [`slug: ${input.slug}`];

  if (input.aiTool) {
    const title = input.aiTool.title?.en ?? input.aiTool.title?.tr ?? input.slug;
    const description = input.aiTool.description?.en ?? input.aiTool.description?.tr ?? "";
    chunks.push(`name: ${title}`);
    if (description) {
      chunks.push(`description: ${description}`);
    }
    if (input.aiTool.tier) {
      chunks.push(`tier: ${input.aiTool.tier}`);
    }
    if (input.aiTool.categorySlug) {
      chunks.push(`category: ${input.aiTool.categorySlug}`);
    }
  }

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
  const aiToolIndex = loadAiToolIndexMap();
  const premiumSlugList = readSlugList(PREMIUM_SLUGS_PATH);
  const freeSlugList = readSlugList(FREE_SLUGS_PATH);
  const discovered = new Map<string, DiscoveredTool>();

  function upsert(slug: string, source: ToolDiscoverySource): void {
    const existing = discovered.get(slug);
    const sources = existing ? [...new Set([...existing.sources, source])] : [source];
    const aiTool = aiToolIndex.get(slug);
    discovered.set(slug, {
      slug,
      sources,
      revenueRole:
        premiumSlugList.includes(slug)
          ? "paid"
          : freeSlugList.includes(slug)
            ? "free"
            : revenueRoles.get(slug) ?? existing?.revenueRole,
      source:
        premiumSlugList.includes(slug) || revenueRoles.get(slug) === "paid"
          ? "paidSlug"
          : freeSlugList.includes(slug) || revenueRoles.get(slug) === "free"
            ? "freeSlug"
            : existing?.source,
      contextSnippet: buildContextSnippet({
        slug,
        revenueToolsText,
        industryRegistryText,
        contractSnippet: contractSnippets.get(slug),
        aiTool,
      }),
    });
  }

  for (const slug of premiumSlugList) {
    upsert(slug, "slug-list");
  }

  for (const slug of freeSlugList) {
    upsert(slug, "slug-list");
  }

  for (const slug of aiToolIndex.keys()) {
    upsert(slug, "ai-tool-index");
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
