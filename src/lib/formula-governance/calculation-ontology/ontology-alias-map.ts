/**
 * Ontology alias map builder — deterministic contract ↔ fixture variable alignment (Phase 5H-B-5).
 */

import type {
  CalculationOntology,
  CalculationVariable,
  VariableRole,
} from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type {
  BuildOntologyAliasMapParams,
  CompositeOntologyAlias,
  OntologyAliasConfidence,
  OntologyAliasMap,
  OntologyAliasSource,
  OntologyVariableAlias,
} from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";

type SemanticAliasRule = {
  readonly slug?: string;
  readonly contractVariableIds: readonly string[];
  readonly ontologyVariableId: string;
  readonly confidence: "strong" | "weak";
  readonly composite?: boolean;
  readonly reason: string;
  readonly shapeWarning?: string;
};

const SEMANTIC_ALIAS_RULES: readonly SemanticAliasRule[] = [
  // Roofing
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["minimumSafePrice"],
    ontologyVariableId: "minimumSafeContractPrice",
    confidence: "strong",
    reason: "Target output naming differs between contract and fixture.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["targetMargin"],
    ontologyVariableId: "targetMarginPercent",
    confidence: "strong",
    reason: "Margin field naming differs between contract and fixture.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["materialCost"],
    ontologyVariableId: "materialCostPerSquare",
    confidence: "weak",
    reason: "Contract uses lump material cost; fixture uses per-square material rate.",
    shapeWarning: "Shape drift: lump-sum materialCost vs per-square materialCostPerSquare.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["laborHours", "laborRate"],
    ontologyVariableId: "laborCostPerSquare",
    confidence: "weak",
    composite: true,
    reason: "Contract splits labor into hours and rate; fixture uses per-square labor cost.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["dumpFees"],
    ontologyVariableId: "disposalCost",
    confidence: "weak",
    reason: "Disposal fees may be modeled under disposalCost in professional ontology.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["dumpFees"],
    ontologyVariableId: "permitCost",
    confidence: "weak",
    reason: "Disposal/permit fees may be modeled under different variable names.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["weatherDelayRiskPercent"],
    ontologyVariableId: "weatherDelayRisk",
    confidence: "weak",
    reason: "Weather delay risk percent may map to fixture weather delay field.",
  },
  {
    slug: "roofing-contract-margin-guard",
    contractVariableIds: ["weatherDelayRiskPercent"],
    ontologyVariableId: "riskBufferPercent",
    confidence: "weak",
    reason: "Weather delay risk may overlap with fixture risk buffer percent.",
  },
  // CNC
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["minimumSafePrice"],
    ontologyVariableId: "minimumSafeQuotePrice",
    confidence: "strong",
    reason: "Target output naming differs between contract and fixture.",
  },
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["setupTime"],
    ontologyVariableId: "setupHours",
    confidence: "strong",
    reason: "Setup time field naming differs between contract and fixture.",
  },
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["machineRate"],
    ontologyVariableId: "machineHourlyRate",
    confidence: "strong",
    reason: "Machine rate field naming differs between contract and fixture.",
  },
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["scrapPercent"],
    ontologyVariableId: "scrapRate",
    confidence: "strong",
    reason: "Scrap percent vs scrap rate naming differs between contract and fixture.",
  },
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["riskBuffer"],
    ontologyVariableId: "riskBufferPercent",
    confidence: "strong",
    reason: "Risk buffer field naming differs between contract and fixture.",
  },
  {
    slug: "cnc-quote-risk-analyzer",
    contractVariableIds: ["targetMargin"],
    ontologyVariableId: "targetMarginPercent",
    confidence: "strong",
    reason: "Margin field naming differs between contract and fixture.",
  },
];

function variableMap(ontology: CalculationOntology): Map<string, CalculationVariable> {
  return new Map(ontology.variables.map((variable) => [variable.id, variable]));
}

function normalizeVariableKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/percent$/i, "")
    .replace(/pct$/i, "")
    .replace(/per(square|hour|unit)$/i, "")
    .replace(/hourly/i, "")
    .replace(/hours?$/i, "hour")
    .replace(/rate$/i, "")
    .replace(/time$/i, "hour");
}

function normalizedKeysOverlap(contractKey: string, fixtureKey: string): boolean {
  const normalizedContract = normalizeVariableKey(contractKey);
  const normalizedFixture = normalizeVariableKey(fixtureKey);
  if (normalizedContract === normalizedFixture) {
    return true;
  }
  const minLength = Math.min(normalizedContract.length, normalizedFixture.length);
  if (minLength < 4) {
    return false;
  }
  return (
    normalizedContract.startsWith(normalizedFixture.slice(0, minLength)) ||
    normalizedFixture.startsWith(normalizedContract.slice(0, minLength))
  );
}

function rolesCompatible(contractRole: VariableRole, fixtureRole: VariableRole): boolean {
  if (contractRole === fixtureRole) {
    return true;
  }
  if (contractRole === "input" && fixtureRole === "input") {
    return true;
  }
  if (
    (contractRole === "target" && fixtureRole === "target") ||
    (contractRole === "derived" && fixtureRole === "derived")
  ) {
    return true;
  }
  return false;
}

function dimensionsCompatible(
  contractVar: CalculationVariable,
  fixtureVar: CalculationVariable,
): boolean {
  if (contractVar.dimension === fixtureVar.dimension) {
    return true;
  }
  const currencyFamily = new Set(["currency", "rate"]);
  if (currencyFamily.has(contractVar.dimension) && currencyFamily.has(fixtureVar.dimension)) {
    return contractVar.unit === fixtureVar.unit;
  }
  return false;
}

function buildAlias(
  contractVar: CalculationVariable,
  fixtureVar: CalculationVariable,
  confidence: OntologyAliasConfidence,
  source: OntologyAliasSource,
  reason: string,
  extraWarning?: string,
): OntologyVariableAlias {
  const dimensionCompatible = dimensionsCompatible(contractVar, fixtureVar);
  const roleCompatible = rolesCompatible(contractVar.role, fixtureVar.role);
  const warnings: string[] = [];
  if (!dimensionCompatible) {
    warnings.push(
      `Dimension mismatch: contract "${contractVar.id}" (${contractVar.dimension}) vs fixture "${fixtureVar.id}" (${fixtureVar.dimension}).`,
    );
  }
  if (!roleCompatible) {
    warnings.push(
      `Role mismatch: contract "${contractVar.id}" (${contractVar.role}) vs fixture "${fixtureVar.id}" (${fixtureVar.role}).`,
    );
  }
  if (extraWarning) {
    warnings.push(extraWarning);
  }

  return {
    contractVariableId: contractVar.id,
    ontologyVariableId: fixtureVar.id,
    confidence,
    source,
    reason,
    dimensionCompatible,
    roleCompatible,
    warning: warnings.length > 0 ? warnings.join(" ") : undefined,
  };
}

function findNormalizedMatch(
  contractVar: CalculationVariable,
  unmatchedFixtureIds: readonly string[],
  fixtureById: Map<string, CalculationVariable>,
): CalculationVariable | undefined {
  const normalizedContract = normalizeVariableKey(contractVar.id);
  const candidates = unmatchedFixtureIds
    .map((id) => fixtureById.get(id))
    .filter((variable): variable is CalculationVariable => variable !== undefined)
    .filter((fixtureVar) => normalizeVariableKey(fixtureVar.id) === normalizedContract);

  if (candidates.length === 1) {
    return candidates[0];
  }
  return undefined;
}

function findDimensionRoleMatch(
  contractVar: CalculationVariable,
  unmatchedFixtureIds: readonly string[],
  fixtureById: Map<string, CalculationVariable>,
): CalculationVariable | undefined {
  if (contractVar.role !== "input") {
    return undefined;
  }

  const candidates = unmatchedFixtureIds
    .map((id) => fixtureById.get(id))
    .filter((variable): variable is CalculationVariable => variable !== undefined)
    .filter(
      (fixtureVar) =>
        fixtureVar.role === "input" &&
        rolesCompatible(contractVar.role, fixtureVar.role) &&
        dimensionsCompatible(contractVar, fixtureVar) &&
        normalizedKeysOverlap(contractVar.id, fixtureVar.id),
    );

  if (candidates.length === 1) {
    return candidates[0];
  }
  return undefined;
}

function resolveContractTarget(ontology: CalculationOntology): string | undefined {
  const goalTarget = ontology.goals[0]?.targetVariable;
  if (goalTarget) {
    return goalTarget;
  }
  return ontology.variables.find((variable) => variable.role === "target")?.id;
}

function resolveFixtureTarget(ontology: CalculationOntology): string | undefined {
  const goalTarget = ontology.goals[0]?.targetVariable;
  if (goalTarget) {
    return goalTarget;
  }
  return ontology.variables.find((variable) => variable.role === "target")?.id;
}

function semanticRulesForSlug(slug: string): SemanticAliasRule[] {
  return SEMANTIC_ALIAS_RULES.filter((rule) => !rule.slug || rule.slug === slug);
}

export function buildOntologyAliasMap(params: BuildOntologyAliasMapParams): OntologyAliasMap {
  const { contractOntology, fixtureOntology, slug } = params;
  const warnings: string[] = [];
  const blockers: string[] = [];
  const aliases: OntologyVariableAlias[] = [];
  const compositeAliases: CompositeOntologyAlias[] = [];

  if (contractOntology.slug !== fixtureOntology.slug && contractOntology.slug !== slug) {
    warnings.push(
      `Slug mismatch: contract "${contractOntology.slug}" vs fixture "${fixtureOntology.slug}".`,
    );
  }

  const contractById = variableMap(contractOntology);
  const fixtureById = variableMap(fixtureOntology);
  const contractIds = [...contractById.keys()];
  const fixtureIds = [...fixtureById.keys()];

  const matchedContract = new Set<string>();
  const matchedFixture = new Set<string>();

  // 1. Exact variable ID match
  for (const contractId of contractIds) {
    if (fixtureById.has(contractId)) {
      const contractVar = contractById.get(contractId)!;
      const fixtureVar = fixtureById.get(contractId)!;
      aliases.push(
        buildAlias(
          contractVar,
          fixtureVar,
          "exact",
          "exact_key",
          "Variable IDs match exactly between contract and fixture ontologies.",
        ),
      );
      matchedContract.add(contractId);
      matchedFixture.add(contractId);
    }
  }

  let unmatchedContract = contractIds.filter((id) => !matchedContract.has(id));
  let unmatchedFixture = fixtureIds.filter((id) => !matchedFixture.has(id));

  // 3. Known semantic alias dictionary (including composite)
  for (const rule of semanticRulesForSlug(slug)) {
    const ontologyVar = fixtureById.get(rule.ontologyVariableId);
    if (!ontologyVar || matchedFixture.has(rule.ontologyVariableId)) {
      continue;
    }

    const contractPresent = rule.contractVariableIds.every((id) =>
      unmatchedContract.includes(id),
    );
    if (!contractPresent) {
      continue;
    }

    if (rule.composite) {
      const compositeConfidence: OntologyAliasConfidence =
        rule.confidence === "weak" ? "manual_review" : rule.confidence;
      compositeAliases.push({
        contractVariableIds: [...rule.contractVariableIds],
        ontologyVariableId: rule.ontologyVariableId,
        confidence: compositeConfidence,
        source: "semantic_name",
        reason: rule.reason,
        warning: "Composite alias requires manual review — multiple contract variables map to one fixture variable.",
      });

      for (const contractId of rule.contractVariableIds) {
        const contractVar = contractById.get(contractId)!;
        aliases.push(
          buildAlias(
            contractVar,
            ontologyVar,
            compositeConfidence,
            "semantic_name",
            rule.reason,
            "Composite alias: shares fixture variable with other contract inputs.",
          ),
        );
        matchedContract.add(contractId);
      }
      matchedFixture.add(rule.ontologyVariableId);
      unmatchedContract = contractIds.filter((id) => !matchedContract.has(id));
      unmatchedFixture = fixtureIds.filter((id) => !matchedFixture.has(id));
      continue;
    }

    const contractId = rule.contractVariableIds[0]!;
    const contractVar = contractById.get(contractId)!;
    aliases.push(
      buildAlias(
        contractVar,
        ontologyVar,
        rule.confidence,
        "semantic_name",
        rule.reason,
        rule.shapeWarning,
      ),
    );
    matchedContract.add(contractId);
    matchedFixture.add(rule.ontologyVariableId);
    unmatchedContract = contractIds.filter((id) => !matchedContract.has(id));
    unmatchedFixture = fixtureIds.filter((id) => !matchedFixture.has(id));
  }

  // 2. Normalized key match
  for (const contractId of [...unmatchedContract]) {
    const contractVar = contractById.get(contractId)!;
    const fixtureVar = findNormalizedMatch(contractVar, unmatchedFixture, fixtureById);
    if (!fixtureVar) {
      continue;
    }
    aliases.push(
      buildAlias(
        contractVar,
        fixtureVar,
        "strong",
        "normalized_key",
        `Normalized key match: "${contractId}" ↔ "${fixtureVar.id}".`,
      ),
    );
    matchedContract.add(contractId);
    matchedFixture.add(fixtureVar.id);
    unmatchedContract = contractIds.filter((id) => !matchedContract.has(id));
    unmatchedFixture = fixtureIds.filter((id) => !matchedFixture.has(id));
  }

  // 4. Dimension + role compatibility
  for (const contractId of [...unmatchedContract]) {
    const contractVar = contractById.get(contractId)!;
    const fixtureVar = findDimensionRoleMatch(contractVar, unmatchedFixture, fixtureById);
    if (!fixtureVar) {
      continue;
    }
    aliases.push(
      buildAlias(
        contractVar,
        fixtureVar,
        "manual_review",
        "dimension_match",
        `Single dimension+role candidate: "${contractId}" ↔ "${fixtureVar.id}".`,
      ),
    );
    matchedContract.add(contractId);
    matchedFixture.add(fixtureVar.id);
    unmatchedContract = contractIds.filter((id) => !matchedContract.has(id));
    unmatchedFixture = fixtureIds.filter((id) => !matchedFixture.has(id));
  }

  // 5. Unmatched lists
  const unmatchedContractVariables = contractIds.filter((id) => !matchedContract.has(id)).sort();
  const unmatchedOntologyVariables = fixtureIds.filter((id) => !matchedFixture.has(id)).sort();

  for (const alias of aliases) {
    if (alias.warning) {
      warnings.push(alias.warning);
    }
    if (!alias.roleCompatible) {
      blockers.push(
        `Role mismatch blocker for alias ${alias.contractVariableId} ↔ ${alias.ontologyVariableId}.`,
      );
    }
  }

  if (unmatchedContractVariables.length > 0) {
    warnings.push(
      `${unmatchedContractVariables.length} contract variable(s) have no fixture alias.`,
    );
  }
  if (unmatchedOntologyVariables.length > 0) {
    warnings.push(
      `${unmatchedOntologyVariables.length} fixture variable(s) have no contract alias.`,
    );
  }

  const contractTarget = resolveContractTarget(contractOntology);
  const fixtureTarget = resolveFixtureTarget(fixtureOntology);
  if (contractTarget && fixtureTarget) {
    const targetAliased = aliases.some(
      (alias) =>
        alias.contractVariableId === contractTarget &&
        alias.ontologyVariableId === fixtureTarget,
    );
    const targetExact = contractTarget === fixtureTarget;
    if (!targetExact && !targetAliased) {
      blockers.push(
        `No alias for contract target "${contractTarget}" → fixture target "${fixtureTarget}".`,
      );
    }
  }

  return {
    slug,
    aliases,
    compositeAliases,
    unmatchedContractVariables,
    unmatchedOntologyVariables,
    warnings,
    blockers,
  };
}
