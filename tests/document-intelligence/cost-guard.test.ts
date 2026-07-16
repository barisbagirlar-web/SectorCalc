/**
 * Cost Guard — Unit Tests
 */
import { describe, it, expect } from "vitest";
import { estimateCost, evaluateCostGuard } from "@/lib/document-intelligence/security/cost-guard";

describe("Cost Guard", () => {
  describe("estimateCost", () => {
    it("returns reasonable estimates for 10 pages / 50 rows", () => {
      const result = estimateCost(10, 50);
      expect(result.estimatedPages).toBe(10);
      expect(result.estimatedRows).toBe(50);
      expect(result.estimatedProviderCostUsd).toBeGreaterThan(0);
      expect(result.estimatedProcessingDurationMs).toBeGreaterThan(0);
    });

    it("scales with page count", () => {
      const small = estimateCost(1, 10);
      const large = estimateCost(100, 10);
      expect(large.estimatedProviderCostUsd).toBeGreaterThan(small.estimatedProviderCostUsd);
    });

    it("scales with row count", () => {
      const small = estimateCost(10, 1);
      const large = estimateCost(10, 1000);
      expect(large.estimatedProviderCostUsd).toBeGreaterThan(small.estimatedProviderCostUsd);
    });

    it("returns zero cost for zero pages and rows", () => {
      const result = estimateCost(0, 0);
      expect(result.estimatedProviderCostUsd).toBe(0);
    });

    it("allows custom cost parameters", () => {
      const result = estimateCost(10, 50, 0.1, 0.01);
      expect(result.estimatedProviderCostUsd).toBe(10 * 0.1 + 50 * 0.01);
    });
  });

  describe("evaluateCostGuard", () => {
    it("allows within limits", () => {
      const result = evaluateCostGuard(10, 50, 5.0, 50, 500);
      expect(result.allowed).toBe(true);
      expect(result.requiresManualReview).toBe(false);
      expect(result.reason).toBeNull();
    });

    it("blocks when pages exceed max", () => {
      const result = evaluateCostGuard(100, 50, 5.0, 50, 500);
      expect(result.allowed).toBe(false);
      expect(result.requiresManualReview).toBe(true);
      expect(result.reason).toContain("100");
    });

    it("blocks when rows exceed max", () => {
      const result = evaluateCostGuard(10, 1000, 5.0, 50, 500);
      expect(result.allowed).toBe(false);
      expect(result.requiresManualReview).toBe(true);
      expect(result.reason).toContain("1000");
    });

    it("blocks when cost exceeds max", () => {
      const result = evaluateCostGuard(500, 1000, 5.0, 1000, 10000);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("cost");
    });

    it("returns requiresManualReview when blocked", () => {
      const result = evaluateCostGuard(100, 50);
      expect(result.requiresManualReview).toBe(true);
    });

    it("uses default limits when not specified", () => {
      const result = evaluateCostGuard(10, 50);
      expect(result.allowed).toBe(true);
    });
  });
});
