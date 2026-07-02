/**
 * Professional fixture ontology registry - slug-indexed read-only lookup (Phase 5H-B-6).
 */

import { CNC_QUOTE_RISK_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/cnc-quote-risk-ontology";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

const FIXTURE_ONTOLOGY_BY_SLUG: Readonly<Record<string, CalculationOntology>> = {
  "roofing-contract-margin-guard": ROOFING_CONTRACT_MARGIN_ONTOLOGY,
  "cnc-quote-risk-analyzer": CNC_QUOTE_RISK_ONTOLOGY,
};

export function getFixtureOntologyForSlug(slug: string): CalculationOntology | undefined {
  return FIXTURE_ONTOLOGY_BY_SLUG[slug];
}

export function hasFixtureOntologyForSlug(slug: string): boolean {
  return slug in FIXTURE_ONTOLOGY_BY_SLUG;
}

export function listFixtureOntologySlugs(): readonly string[] {
  return Object.keys(FIXTURE_ONTOLOGY_BY_SLUG).sort();
}
