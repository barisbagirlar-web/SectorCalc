/**
 * Contract ontology alignment plan — migration guidance without production changes (Phase 5H-B-5).
 */

import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import type {
  OntologyAliasConfidence,
  OntologyAliasMap,
  OntologyVariableAlias,
} from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";
import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";

export type AlignmentStatus = "aligned" | "partially_aligned" | "blocked";

export type ManualReviewItem = {
  readonly contractVariableId: string;
  readonly ontologyVariableId: string;
  readonly confidence: OntologyAliasConfidence;
  readonly reason: string;
};

export type OntologyAlignmentPlan = {
  readonly slug: string;
  readonly alignmentStatus: AlignmentStatus;
  readonly canonicalVariableMap: Readonly<Record<string, string>>;
  readonly requiredManualReviews: readonly ManualReviewItem[];
  readonly suggestedContractMetadataImprovements: readonly string[];
  readonly suggestedFixtureUpdates: readonly string[];
  readonly safeToUseContractOntologyForRequirementEngine: boolean;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BuildOntologyAlignmentPlanParams = {
  readonly contractOntology: CalculationOntology;
  readonly fixtureOntology: CalculationOntology;
  readonly aliasMap: OntologyAliasMap;
};

function isLowConfidence(confidence: OntologyAliasConfidence): boolean {
  return confidence === "weak" || confidence === "manual_review";
}

function buildCanonicalMap(aliases: readonly OntologyVariableAlias[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const alias of aliases) {
    if (!(alias.contractVariableId in map)) {
      map[alias.contractVariableId] = alias.ontologyVariableId;
    }
  }
  return map;
}

function collectContractMetadataBlockers(slug: string): readonly string[] {
  const contract = getFormulaContractBySlug(slug);
  if (!contract) {
    return [`No FormulaContract registered for slug "${slug}".`];
  }
  const draft = buildOntologyDraftFromFormulaContract(contract);
  return draft.blockers;
}

export function buildOntologyAlignmentPlan(
  params: BuildOntologyAlignmentPlanParams,
): OntologyAlignmentPlan {
  const { contractOntology, fixtureOntology, aliasMap } = params;
  const warnings = [...aliasMap.warnings];
  const blockers = [...aliasMap.blockers];
  const suggestedContractMetadataImprovements: string[] = [];
  const suggestedFixtureUpdates: string[] = [];

  const contractMetadataBlockers = collectContractMetadataBlockers(aliasMap.slug);
  for (const metadataBlocker of contractMetadataBlockers) {
    if (!blockers.includes(metadataBlocker)) {
      blockers.push(metadataBlocker);
    }
    if (metadataBlocker.includes("Production:")) {
      suggestedContractMetadataImprovements.push(
        `Add Production: assumption line to contract metadata for slug "${aliasMap.slug}".`,
      );
    }
  }

  const canonicalVariableMap = buildCanonicalMap(aliasMap.aliases);

  const requiredManualReviews: ManualReviewItem[] = aliasMap.aliases
    .filter((alias) => isLowConfidence(alias.confidence))
    .map((alias) => ({
      contractVariableId: alias.contractVariableId,
      ontologyVariableId: alias.ontologyVariableId,
      confidence: alias.confidence,
      reason: alias.reason,
    }));

  for (const composite of aliasMap.compositeAliases) {
    suggestedContractMetadataImprovements.push(
      `Document composite mapping ${composite.contractVariableIds.join(" + ")} → ${composite.ontologyVariableId} in contract metadata.`,
    );
    requiredManualReviews.push({
      contractVariableId: composite.contractVariableIds.join("+"),
      ontologyVariableId: composite.ontologyVariableId,
      confidence: composite.confidence,
      reason: composite.reason,
    });
  }

  for (const contractId of aliasMap.unmatchedContractVariables) {
    suggestedContractMetadataImprovements.push(
      `Add contract metadata alias hint for "${contractId}" to align with fixture ontology.`,
    );
  }

  for (const fixtureId of aliasMap.unmatchedOntologyVariables) {
    suggestedFixtureUpdates.push(
      `Fixture variable "${fixtureId}" has no contract counterpart — preserve in professional ontology; document drift.`,
    );
  }

  if (contractOntology.slug !== fixtureOntology.slug) {
    warnings.push(
      `Ontology slug drift: contract "${contractOntology.slug}" vs fixture "${fixtureOntology.slug}".`,
    );
  }

  const weakOrManualCount = aliasMap.aliases.filter((alias) => isLowConfidence(alias.confidence)).length;
  const strongOrExactCount = aliasMap.aliases.length - weakOrManualCount;
  const hasRoleOrDimensionWarnings = aliasMap.aliases.some(
    (alias) => !alias.dimensionCompatible || !alias.roleCompatible,
  );

  let alignmentStatus: AlignmentStatus = "aligned";
  if (blockers.length > 0) {
    alignmentStatus = "blocked";
  } else if (
    weakOrManualCount > 0 ||
    aliasMap.unmatchedContractVariables.length > 0 ||
    aliasMap.unmatchedOntologyVariables.length > 0 ||
    hasRoleOrDimensionWarnings
  ) {
    alignmentStatus = "partially_aligned";
  }

  const targetBlocker = blockers.some((blocker) => blocker.includes("No alias for contract target"));
  const safeToUseContractOntologyForRequirementEngine =
    !targetBlocker && alignmentStatus !== "blocked";

  if (!safeToUseContractOntologyForRequirementEngine) {
    warnings.push(
      "Contract ontology should not drive Requirement Engine until target alias and blockers are resolved.",
    );
  } else if (alignmentStatus === "partially_aligned") {
    warnings.push(
      `Contract ontology is safe for Requirement Engine (${strongOrExactCount} strong/exact aliases; ${weakOrManualCount} need review).`,
    );
  }

  return {
    slug: aliasMap.slug,
    alignmentStatus,
    canonicalVariableMap,
    requiredManualReviews,
    suggestedContractMetadataImprovements,
    suggestedFixtureUpdates,
    safeToUseContractOntologyForRequirementEngine,
    warnings,
    blockers,
  };
}
