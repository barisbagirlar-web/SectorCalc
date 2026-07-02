/**
 * Phase 5H-B-6 - fixture ontology registry tests.
 */

import { describe, expect, test } from "vitest";
import {
  getFixtureOntologyForSlug,
  hasFixtureOntologyForSlug,
  listFixtureOntologySlugs,
} from "@/lib/features/formula-governance/calculation-ontology/fixture-ontology-registry";

describe("fixture ontology registry", () => {
  test("finds roofing fixture", () => {
    const fixture = getFixtureOntologyForSlug("roofing-contract-margin-guard");
    expect(fixture).toBeDefined();
    expect(fixture?.slug).toBe("roofing-contract-margin-guard");
  });

  test("finds cnc fixture", () => {
    const fixture = getFixtureOntologyForSlug("cnc-quote-risk-analyzer");
    expect(fixture).toBeDefined();
    expect(fixture?.slug).toBe("cnc-quote-risk-analyzer");
  });

  test("returns false for unknown slug", () => {
    expect(hasFixtureOntologyForSlug("unknown-tool-slug")).toBe(false);
    expect(getFixtureOntologyForSlug("unknown-tool-slug")).toBeUndefined();
  });

  test("registry list is deterministic", () => {
    const first = listFixtureOntologySlugs();
    const second = listFixtureOntologySlugs();

    expect(first).toEqual(second);
    expect(first).toEqual(
      expect.arrayContaining(["roofing-contract-margin-guard", "cnc-quote-risk-analyzer"]),
    );
  });
});
