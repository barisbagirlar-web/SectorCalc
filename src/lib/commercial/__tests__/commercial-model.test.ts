/**
 * Commercial model contract tests — Phase 6B.
 */

import { describe, expect, test } from "vitest";
import {
  COMMERCIAL_TIERS,
  LEAD_CAPTURE_CONTRACTS,
  PAYWALL_LOCKED_FEATURES,
} from "@/lib/commercial/commercial-model";

describe("commercial model — Phase 6B", () => {
  test("defines five commercial tiers", () => {
    expect(COMMERCIAL_TIERS).toHaveLength(5);
    expect(COMMERCIAL_TIERS.map((tier) => tier.id)).toContain("enterprise");
  });

  test("paywall locks premium features on free tier", () => {
    expect(PAYWALL_LOCKED_FEATURES.every((feature) => !feature.freeVisible)).toBe(true);
  });

  test("lead capture contracts are ui-only", () => {
    expect(LEAD_CAPTURE_CONTRACTS.every((contract) => contract.backendWired === false)).toBe(true);
    expect(LEAD_CAPTURE_CONTRACTS.every((contract) => contract.storage === "ui_only")).toBe(true);
  });
});
