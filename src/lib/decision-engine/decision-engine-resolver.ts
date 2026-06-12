import type {
  DecisionEngineContext,
  DecisionEngineResolveInput,
  ToolArchetype,
} from "@/lib/decision-engine/decision-engine-types";
import { buildCaseState } from "@/lib/decision-engine/case-state-builder";
import {
  primaryArchetype,
  resolveArchetypeFromCategory,
  resolveArchetypeFromKeywords,
  resolveArchetypesFromSlug,
} from "@/lib/decision-engine/tool-archetypes";

function dedupeArchetypes(items: readonly ToolArchetype[]): ToolArchetype[] {
  const seen = new Set<ToolArchetype>();
  const out: ToolArchetype[] = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

export function resolveDecisionEngineContext(
  input: DecisionEngineResolveInput,
): DecisionEngineContext {
  const fromSlug = resolveArchetypesFromSlug(input.toolSlug);
  if (fromSlug) {
    const archetypes = dedupeArchetypes(fromSlug);
    return {
      caseState: buildCaseState(input, archetypes),
      archetypes,
      mappingSource: "slug",
    };
  }

  const fromCategory = resolveArchetypeFromCategory(input.category);
  if (fromCategory) {
    const archetypes = [fromCategory];
    return {
      caseState: buildCaseState(input, archetypes),
      archetypes,
      mappingSource: "category",
    };
  }

  const fromKeywords = resolveArchetypeFromKeywords(input.toolSlug, input.sector);
  if (fromKeywords) {
    const archetypes = [fromKeywords];
    return {
      caseState: buildCaseState(input, archetypes),
      archetypes,
      mappingSource: "keywords",
    };
  }

  const archetypes: ToolArchetype[] = ["generic"];
  return {
    caseState: buildCaseState(input, archetypes),
    archetypes,
    mappingSource: "generic",
  };
}

export function resolvePrimaryArchetype(input: DecisionEngineResolveInput): ToolArchetype {
  return primaryArchetype(resolveDecisionEngineContext(input).archetypes);
}
