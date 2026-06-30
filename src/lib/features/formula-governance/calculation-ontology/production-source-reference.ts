/**
 * Production source reference — locator metadata only (Phase 5H-B-2).
 */

import type { OntologyDraft } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import {
  getAnyProductionFormulaLocator,
  type ProductionFormulaLocator,
} from "@/lib/features/formula-governance/oracle/production-formula-locator";

export type ProductionSourceReference = {
  readonly slug: string;
  readonly toolId: string;
  readonly registryKey: string;
  readonly productionFilePath: string;
  readonly productionFunctionName: string;
  readonly calculatorEntry: string;
  readonly oracleFunctionName: string;
  readonly inputShape: readonly string[];
  readonly productionOutputShape: readonly string[];
  readonly comparisonWired: boolean;
};

export type OntologyDraftWithProductionSource = OntologyDraft & {
  readonly productionSource?: ProductionSourceReference;
};

function toProductionSourceReference(locator: ProductionFormulaLocator): ProductionSourceReference {
  return {
    slug: locator.slug,
    toolId: locator.toolId,
    registryKey: locator.toolId,
    productionFilePath: locator.productionFilePath,
    productionFunctionName: locator.productionFunctionName,
    calculatorEntry: locator.productionEntry,
    oracleFunctionName: locator.oracleFunctionName,
    inputShape: locator.inputShape,
    productionOutputShape: locator.productionOutputShape,
    comparisonWired: locator.comparisonWired,
  };
}

export function buildProductionSourceReference(slug: string): ProductionSourceReference | undefined {
  const locator = getAnyProductionFormulaLocator(slug);
  if (!locator) {
    return undefined;
  }
  return toProductionSourceReference(locator);
}

export function attachProductionSourceToOntologyDraft(
  ontologyDraft: OntologyDraft,
  productionSource: ProductionSourceReference | undefined,
): OntologyDraftWithProductionSource {
  const warnings = [...ontologyDraft.warnings];
  const blockers = [...ontologyDraft.blockers];

  if (!productionSource) {
    blockers.push(
      `No production formula locator registered for slug "${ontologyDraft.slug}".`,
    );
    return { ...ontologyDraft, warnings, blockers };
  }

  if (!ontologyDraft.assumptions.some((line) => line.includes(productionSource.productionFilePath))) {
    warnings.push(
      `Production locator path "${productionSource.productionFilePath}" not echoed in contract assumptions.`,
    );
  }

  return {
    ...ontologyDraft,
    productionSource,
    warnings,
    blockers,
  };
}

export function buildOntologyDraftWithProductionSource(slug: string, draft: OntologyDraft): OntologyDraftWithProductionSource {
  return attachProductionSourceToOntologyDraft(draft, buildProductionSourceReference(slug));
}
