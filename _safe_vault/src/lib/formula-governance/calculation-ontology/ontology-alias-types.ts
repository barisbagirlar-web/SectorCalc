/**
 * Ontology alias types — contract vs fixture variable naming drift (Phase 5H-B-5).
 */

export type OntologyAliasConfidence = "exact" | "strong" | "weak" | "manual_review";

export type OntologyAliasSource =
  | "exact_key"
  | "normalized_key"
  | "semantic_name"
  | "dimension_match"
  | "manual";

export type OntologyVariableAlias = {
  readonly contractVariableId: string;
  readonly ontologyVariableId: string;
  readonly confidence: OntologyAliasConfidence;
  readonly source: OntologyAliasSource;
  readonly reason: string;
  readonly dimensionCompatible: boolean;
  readonly roleCompatible: boolean;
  readonly warning?: string;
};

export type CompositeOntologyAlias = {
  readonly contractVariableIds: readonly string[];
  readonly ontologyVariableId: string;
  readonly confidence: OntologyAliasConfidence;
  readonly source: OntologyAliasSource;
  readonly reason: string;
  readonly warning?: string;
};

export type OntologyAliasMap = {
  readonly slug: string;
  readonly aliases: readonly OntologyVariableAlias[];
  readonly compositeAliases: readonly CompositeOntologyAlias[];
  readonly unmatchedContractVariables: readonly string[];
  readonly unmatchedOntologyVariables: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BuildOntologyAliasMapParams = {
  readonly contractOntology: import("@/lib/formula-governance/calculation-ontology/ontology-types").CalculationOntology;
  readonly fixtureOntology: import("@/lib/formula-governance/calculation-ontology/ontology-types").CalculationOntology;
  readonly slug: string;
};
