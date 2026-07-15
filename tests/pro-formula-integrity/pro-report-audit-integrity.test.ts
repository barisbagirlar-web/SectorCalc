import { describe, expect, it } from "vitest";

import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import {
  buildProReport,
} from "@/sectorcalc/pro-report/pro-report-adapter";
import {
  getProReportContract,
  listProReportContractSlugs,
} from "@/sectorcalc/pro-report/pro-report-contract-registry";
import {
  createAuditSeal,
  computeHash,
  computeObjectHash,
} from "@/sectorcalc/pro-runtime/audit-seal-service";
import {
  canonicalJson,
  sha256Json,
} from "@/sectorcalc/pro-runtime/cryptographic-hash";

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

describe("LIVE PRO report contracts", () => {
  const modules = getAllModules();

  it("covers the same exact 20 tools as the formula resolver", () => {
    expect(listProReportContractSlugs()).toEqual(
      sorted(modules.map((module) => module.toolKey)),
    );
  });

  for (const module of modules) {
    it(`${module.toolKey}: report sources are unique and formula-bound`, () => {
      const reportContract = getProReportContract(module.toolKey);
      expect(reportContract).not.toBeNull();
      if (!reportContract) return;

      const sourceIds = reportContract.sections.flatMap((section) =>
        section.entries.map((entry) => entry.sourceOutputId),
      );
      expect(new Set(sourceIds).size).toBe(sourceIds.length);
      for (const sourceId of sourceIds) {
        expect(module.declaredOutputKeys).toContain(sourceId);
      }
    });

    it(`${module.toolKey}: sample produces a complete strict report and input trace`, () => {
      const result = module.calculate(module.sampleInputs);
      expect(result.status).not.toBe("BLOCKED");

      const report = buildProReport({
        toolSlug: module.toolKey,
        outputs: Object.entries(result.outputs).map(([id, value]) => ({
          id,
          value,
          unit: null,
        })),
        displayCurrency: "USD",
        rawInputs: { ...module.sampleInputs },
        selectedUnits: {},
      });

      expect(report).not.toBeNull();
      if (!report) return;
      const inputTrace = report.resolvedSections.find(
        (section) => section.sectionTitle === "Input Trace",
      );
      expect(inputTrace).toBeDefined();
      expect(inputTrace?.entries).toHaveLength(Object.keys(module.sampleInputs).length);

      const serialized = JSON.stringify(report);
      expect(serialized).not.toMatch(/\bcompetitive\b/i);
      expect(serialized).not.toMatch(/cost-efficient/i);
      expect(serialized).not.toMatch(/ISO certified/i);
      expect(serialized).not.toMatch(/independently audited confidence/i);
    });
  }
});

describe("cryptographic integrity", () => {
  it("canonical JSON is independent of object key insertion order", () => {
    const left = { b: 2, a: { d: 4, c: 3 } };
    const right = { a: { c: 3, d: 4 }, b: 2 };
    expect(canonicalJson(left)).toBe(canonicalJson(right));
    expect(sha256Json(left)).toBe(sha256Json(right));
  });

  it("a one-value mutation changes the SHA-256 digest", () => {
    const baseline = computeObjectHash({ input: 100, unit: "kg" });
    const mutated = computeObjectHash({ input: 101, unit: "kg" });
    expect(baseline).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(mutated).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(mutated).not.toBe(baseline);
  });

  it("creates an honest SHA-256 integrity seal and does not claim a signature", () => {
    const inputHash = computeObjectHash({ raw: 1 });
    const normalizedInputHash = computeObjectHash({ normalized: 1 });
    const outputHash = computeObjectHash({ output: 2 });
    const schemaHash = computeObjectHash({ schema: "v1" });
    const proofPackHash = computeObjectHash({ proof: true });
    const seal = createAuditSeal({
      toolId: "PRO_TEST",
      toolKey: "test-tool",
      inputHash,
      normalizedInputHash,
      outputHash,
      schemaHash,
      proofPackHash,
      formulaVersion: "1.0.0",
      schemaVersion: "1.0.0",
      runtimeVersion: "test",
    });

    expect(seal.seal_status).toBe("SEALED");
    expect(seal.hash_algorithm).toBe("SHA-256");
    expect(seal.signature_status).toBe("UNSIGNED");
    expect(seal.tamper_warning).toMatch(/not digitally signed/i);
  });

  it("rejects legacy non-cryptographic hashes", () => {
    const seal = createAuditSeal({
      inputHash: "h1234",
      outputHash: computeHash("output"),
      schemaHash: computeHash("schema"),
      formulaVersion: "1.0.0",
      schemaVersion: "1.0.0",
      runtimeVersion: "test",
    });
    expect(seal.seal_status).toBe("FAILED");
  });
});
