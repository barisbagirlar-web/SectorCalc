import { describe, expect, test } from "vitest";
import {
  buildDomainAugmentedUserPrompt,
  buildDomainPromptSection,
  matchDomainPrompt,
} from "@/lib/ai/deepseek/domain-prompt-dispatcher";

describe("domain-prompt-dispatcher", () => {
  test("maps manufacturing slug to MANUFACTURING_AND_MACHINING", () => {
    const result = matchDomainPrompt({
      slug: "cnc-machining-cycle-time",
      category: "manufacturing",
    });
    expect(result.domainId).toBe("MANUFACTURING_AND_MACHINING");
    expect(result.matchSource).toBe("keyword");
    expect(result.isHighRisk).toBe(false);
  });

  test("maps lean/oee slug to LEAN_WASTE_AND_OEE", () => {
    const result = matchDomainPrompt({ slug: "oee-waste-analyzer", category: "oee" });
    expect(result.domainId).toBe("LEAN_WASTE_AND_OEE");
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
  });

  test("maps maintenance mtbf before generic downtime lean match", () => {
    const result = matchDomainPrompt({ slug: "mtbf-mttr-maintenance", category: "operations" });
    expect(result.domainId).toBe("MAINTENANCE_AND_DOWNTIME");
  });

  test("maps tax slug to high-risk finance domain", () => {
    const result = matchDomainPrompt({ slug: "corporate-tax-estimator", category: "finance" });
    expect(result.domainId).toBe("FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK");
    expect(result.isHighRisk).toBe(true);
    expect(result.requiresExpertChecklist).toBe(true);
  });

  test("uses GENERAL_INDUSTRIAL_COST_ANALYTICS fallback when unclear", () => {
    const result = matchDomainPrompt({ slug: "industrial-metric-check", category: "misc" });
    expect(result.domainId).toBe("GENERAL_INDUSTRIAL_COST_ANALYTICS");
    expect(result.matchSource).toBe("fallback");
  });

  test("riskClass HIGH_ENGINEERING_SAFETY forces high-risk domain", () => {
    const result = matchDomainPrompt({
      slug: "simple-oee-check",
      category: "oee",
      riskClass: "HIGH_ENGINEERING_SAFETY",
    });
    expect(result.domainId).toBe("FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK");
    expect(result.matchSource).toBe("high_risk_override");
  });

  test("buildDomainPromptSection includes single domain block", () => {
    const section = buildDomainPromptSection({ slug: "freight-cost-estimator", category: "logistics" });
    expect(section).toContain("=== P7 DOMAIN PROMPT (single domain only) ===");
    expect(section).toContain("DOMAIN: LOGISTICS_AND_TRANSPORT");
    expect(section).toContain("domainId: LOGISTICS_AND_TRANSPORT");
    expect(section).not.toContain("DOMAIN: MANUFACTURING_AND_MACHINING");
  });

  test("high-risk section appends expert checklist appendix", () => {
    const section = buildDomainPromptSection({ slug: "fx-hedge-analyzer", category: "finance" });
    expect(section).toContain("HIGH-RISK SIGNAL ACTIVE");
    expect(section).toContain("canGenerateCalculator=false");
  });

  test("buildDomainAugmentedUserPrompt appends domain section once", () => {
    const augmented = buildDomainAugmentedUserPrompt("base prompt", {
      slug: "inventory-holding-cost",
      category: "inventory",
    });
    expect(augmented.startsWith("base prompt")).toBe(true);
    expect(augmented).toContain("DOMAIN: INVENTORY_AND_STOCK");
    const domainBlocks = augmented.match(/=== P7 DOMAIN PROMPT/g) ?? [];
    expect(domainBlocks.length).toBe(1);
  });
});
