import premiumSchemaInputsI18n from "@/data/premium-schema-inputs-i18n.generated.json";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { resolvePrimaryArchetype } from "@/lib/features/decision-engine/decision-engine-resolver";
import {
  resolveFreeToolDisplayTitle,
  resolveFreeToolLocalizedCopy,
} from "@/lib/infrastructure/i18n/free-tool-i18n";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/infrastructure/i18n/premium-schema-display-i18n";
import { fillLocaleRecord } from "@/lib/features/semantic/semantic-locale-utils";
import { translateCalculatorPhrase as _translatePhrase } from "@/lib/infrastructure/i18n/calculator-phrase-translate";
import { isFinanceLikeTool } from "@/lib/features/ai/is-finance-like-tool";
import { getCategorizedToolBySlug } from "@/lib/catalog/build-categorized-tool-index";
import type {
  SemanticInputParameter,
  SemanticOutputParameter,
  SemanticToolContract,
  SemanticToolTier,
  SemanticValueType,
} from "@/lib/features/semantic/tool-semantic-types";
import { getPremiumSchemaBySlug, listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";
import {
  getFreeTrafficToolBySlug,
  type FreeTrafficTool,
} from "@/lib/features/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/features/tools/free-traffic-routes";
import {
  isFreeToolMigratedToPremium,
  listMigratedPremiumRouteSlugs,
} from "@/lib/features/freemium/resolve-free-to-premium-migration";
import {
  getPremiumRevenueRouteSlugs,
  getRevenueToolByFreeSlug,
  getRevenueToolByPremiumRouteSlug,
  type RevenueTool,
  type RevenueToolInput,
} from "@/lib/features/tools/revenue-tools";

function resolveSemanticGlobalCategory(slug: string, fallback: string): string {
  return getCategorizedToolBySlug(slug)?.categorySlug ?? fallback;
}

function mapRevenueInputType(type: RevenueToolInput["type"]): SemanticValueType {
  if (type === "select") {
    return "select";
  }
  return "number";
}

function normalizePremiumFieldKey(fieldId: string): string {
  return fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolvePremiumInputCopy(
  schemaId: string,
  inputId: string,
  locale: string,
  fallbackLabel: string,
  fallbackHelper?: string,
): { label: string; helper: string } {
  const key = normalizePremiumFieldKey(inputId);
  const localeBucket = premiumSchemaInputsI18n as Record<
    string,
    Record<string, Record<string, { label?: string; helper?: string }>>
  >;
  const localized = localeBucket[locale]?.[schemaId]?.[key];
  const english = localeBucket.en?.[schemaId]?.[key];
  return {
    label: localized?.label ?? english?.label ?? fallbackLabel,
    helper: localized?.helper ?? english?.helper ?? fallbackHelper ?? fallbackLabel,
  };
}

function buildDefaultOutput(title: SemanticToolContract["title"], key = "result"): SemanticOutputParameter {
  return {
    key,
    label: fillLocaleRecord((locale) => {
      const translated = _translatePhrase("result", locale);
      return `${title[locale] ?? title.en} ${translated}`;
    }),
    description: fillLocaleRecord((locale) => title[locale] ?? title.en),
  };
}

function buildTrafficInputs(tool: FreeTrafficTool): SemanticInputParameter[] {
  return tool.inputs.map((input) => ({
    key: input.key,
    label: fillLocaleRecord(() => input.label),
    description: fillLocaleRecord(() => input.helper || input.label),
    unitText: input.unit || undefined,
    required: true,
    valueType: input.type === "select" ? "select" : "number",
  }));
}

function buildRevenueInputs(inputs: readonly RevenueToolInput[]): SemanticInputParameter[] {
  return inputs.map((input) => ({
    key: input.key,
    label: fillLocaleRecord(() => input.label),
    description: fillLocaleRecord(() => input.helperText ?? input.label),
    unitText: input.unit,
    required: input.required,
    valueType: mapRevenueInputType(input.type),
  }));
}

function resolveArchetype(
  toolSlug: string,
  tier: SemanticToolTier,
  category: string,
  sector?: string,
): SemanticToolContract["archetype"] {
  return resolvePrimaryArchetype({
    toolSlug,
    locale: "en",
    tier: tier === "premium-schema" ? "premium-schema" : tier,
    category,
    sector,
  });
}

function resolveFinancialCandidate(
  toolSlug: string,
  titleEn: string,
  descriptionEn: string,
  category: string,
): boolean {
  return isFinanceLikeTool({
    slug: toolSlug,
    title: titleEn,
    description: descriptionEn,
    categorySlug: category,
  });
}

function buildFreeToolContract(slug: string): SemanticToolContract | null {
  const revenue = getRevenueToolByFreeSlug(slug);
  const traffic = getFreeTrafficToolBySlug(slug);

  if (!revenue && !traffic) {
    return null;
  }

  const registryTitle = revenue?.freeTitle ?? traffic?.title ?? slug;
  const title = fillLocaleRecord((locale) =>
    revenue
      ? getLocalizedRevenueToolTitle(slug, "free", locale, registryTitle)
      : resolveFreeToolDisplayTitle(slug, locale, registryTitle),
  );
  const description = fillLocaleRecord((locale) => {
    if (revenue) {
      return revenue.freeValue;
    }
    const copy = resolveFreeToolLocalizedCopy(slug, locale);
    return copy.description ?? traffic?.description ?? registryTitle;
  });

  const category = resolveSemanticGlobalCategory(slug, traffic?.category ?? revenue?.sector ?? "generic");
  const archetype = resolveArchetype(slug, "free", category, revenue?.sector);
  const inputParameters = revenue
    ? buildRevenueInputs(revenue.freeInputs)
    : traffic
      ? buildTrafficInputs(traffic)
      : [];

  const outputParameters: SemanticOutputParameter[] =
    revenue && revenue.freeResultIds.length > 0
      ? revenue.freeResultIds.map((resultId) => ({
          key: resultId,
          label: fillLocaleRecord(() => resultId),
          description: fillLocaleRecord((locale) => `${title[locale]} - ${resultId}`),
        }))
      : [buildDefaultOutput(title)];

  return {
    toolSlug: slug,
    title,
    description,
    tier: "free",
    category,
    sector: revenue?.sector,
    archetype,
    urlPath: `/tools/free/${slug}`,
    imagePath: "/img/brand/sectorcalc-logo.png",
    inputParameters,
    outputParameters,
    isFinancialServiceCandidate: resolveFinancialCandidate(
      slug,
      title.en ?? registryTitle,
      description.en ?? registryTitle,
      category,
    ),
    isPublic: true,
  };
}

function buildPremiumRevenueFromSpec(tool: RevenueTool, slug: string): SemanticToolContract {
  const title = fillLocaleRecord((locale) =>
    getLocalizedRevenueToolTitle(slug, "paid", locale, tool.paidTitle),
  );
  const description = fillLocaleRecord(() => tool.paidValue);
  const archetype = resolveArchetype(slug, "premium", tool.sector, tool.sector);
  const inputParameters = buildRevenueInputs(tool.paidInputs);
  const outputParameters =
    tool.verdictLabels.length > 0
      ? tool.verdictLabels.map((label, index) => ({
          key: `verdict_${index + 1}`,
          label: fillLocaleRecord(() => label),
          description: fillLocaleRecord(() => tool.paidResultPromise),
        }))
      : [buildDefaultOutput(title, "decision_verdict")];

  return {
    toolSlug: slug,
    title,
    description,
    tier: "premium",
    category: resolveSemanticGlobalCategory(slug, tool.sector),
    sector: tool.sector,
    archetype,
    urlPath: `/tools/premium/${slug}`,
    imagePath: "/img/brand/sectorcalc-logo.png",
    inputParameters,
    outputParameters,
    isFinancialServiceCandidate: resolveFinancialCandidate(
      slug,
      title.en ?? tool.paidTitle,
      description.en ?? tool.paidValue,
      resolveSemanticGlobalCategory(slug, tool.sector),
    ),
    isPublic: true,
  };
}

function buildMigratedPremiumContract(slug: string): SemanticToolContract | null {
  const freeContract = buildFreeToolContract(slug);
  if (!freeContract) {
    return null;
  }

  return {
    ...freeContract,
    tier: "premium",
    urlPath: `/tools/premium/${slug}`,
  };
}

function buildPremiumRevenueContract(slug: string): SemanticToolContract | null {
  const tool = getRevenueToolByPremiumRouteSlug(slug);
  if (!tool) {
    return null;
  }
  return buildPremiumRevenueFromSpec(tool, slug);
}

function buildPremiumSchemaContract(slug: string): SemanticToolContract | null {
  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    return null;
  }

  const title = fillLocaleRecord((locale) =>
    resolvePremiumSchemaDisplayName(schema.id, schema.name, locale),
  );
  const description = fillLocaleRecord((locale) =>
    resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale),
  );
  const archetype = resolveArchetype(
    slug,
    "premium-schema",
    schema.category,
    schema.sectorSlug,
  );

  const inputParameters: SemanticInputParameter[] = schema.inputs.map((input) => ({
    key: input.id,
    label: fillLocaleRecord((locale) =>
      resolvePremiumInputCopy(schema.id, input.id, locale, input.label, input.helper).label,
    ),
    description: fillLocaleRecord((locale) =>
      resolvePremiumInputCopy(schema.id, input.id, locale, input.label, input.helper).helper,
    ),
    unitText: input.unit || undefined,
    unitGroup: input.unit || undefined,
    required: input.required ?? false,
    valueType:
      input.type === "boolean" ? "boolean" : input.type === "select" ? "select" : "number",
  }));

  const outputParameters: SemanticOutputParameter[] =
    schema.outputs.length > 0
      ? schema.outputs.map((output) => ({
          key: output.id,
          label: fillLocaleRecord(() => output.label),
          description: fillLocaleRecord(() => output.label),
          unitText: output.unit || undefined,
        }))
      : [buildDefaultOutput(title, "primary_output")];

  return {
    toolSlug: slug,
    title,
    description,
    tier: "premium-schema",
    category: resolveSemanticGlobalCategory(slug, schema.category),
    sector: schema.sectorSlug,
    archetype,
    urlPath: `/tools/premium-schema/${slug}`,
    imagePath: "/img/brand/sectorcalc-logo.png",
    inputParameters,
    outputParameters,
    isFinancialServiceCandidate: resolveFinancialCandidate(
      slug,
      title.en ?? schema.name,
      description.en ?? schema.painStatement,
      resolveSemanticGlobalCategory(slug, schema.category),
    ),
    isPublic: true,
  };
}

function buildContractRegistry(): Map<string, SemanticToolContract> {
  const registry = new Map<string, SemanticToolContract>();

  for (const slug of listPremiumSchemaSlugs()) {
    const contract = buildPremiumSchemaContract(slug);
    if (contract) {
      registry.set(`premium-schema:${slug}`, contract);
    }
  }

  for (const slug of getPremiumRevenueRouteSlugs()) {
    const contract = buildPremiumRevenueContract(slug);
    if (contract) {
      registry.set(`premium:${slug}`, contract);
    }
  }

  for (const slug of listMigratedPremiumRouteSlugs()) {
    const contract = buildMigratedPremiumContract(slug);
    if (contract) {
      registry.set(`premium:${slug}`, contract);
    }
  }

  for (const slug of listAllFreeToolSlugs()) {
    if (isFreeToolMigratedToPremium(slug)) {
      continue;
    }
    const contract = buildFreeToolContract(slug);
    if (contract) {
      registry.set(`free:${slug}`, contract);
    }
  }

  return registry;
}

let cachedRegistry: Map<string, SemanticToolContract> | null = null;

export function getSemanticToolRegistry(): Map<string, SemanticToolContract> {
  if (!cachedRegistry) {
    cachedRegistry = buildContractRegistry();
  }
  return cachedRegistry;
}

export function listSemanticToolContracts(): readonly SemanticToolContract[] {
  return [...getSemanticToolRegistry().values()];
}

export function getSemanticToolContract(input: {
  readonly slug: string;
  readonly tier: SemanticToolTier;
}): SemanticToolContract | undefined {
  return getSemanticToolRegistry().get(`${input.tier}:${input.slug}`);
}

export function assertSemanticToolContract(input: {
  readonly slug: string;
  readonly tier: SemanticToolTier;
}): SemanticToolContract {
  const contract = getSemanticToolContract(input);
  if (!contract) {
    throw new Error(`Missing semantic contract for ${input.tier}:${input.slug}`);
  }
  if (!contract.isPublic) {
    throw new Error(`Tool is not public: ${input.tier}:${input.slug}`);
  }
  if (contract.inputParameters.length === 0 || contract.outputParameters.length === 0) {
    throw new Error(`Semantic contract missing input/output: ${input.tier}:${input.slug}`);
  }
  return contract;
}
