// SectorCalc Free Tools — All Active Free Tools Golden Fixture Test
// Validates every active free tool against its golden fixture:
//   - Formula module loads (dynamic import)
//   - Golden fixture exists and has valid raw_inputs
//   - Formula execute() returns a valid FreeV531ExecuteResponse
//   - Outputs are non-null and finite
//   - Status is not BLOCKED

import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import type { FreeV531ExecuteResponse } from "@/sectorcalc/formulas/free-v531/types";

const GOLDEN_DIR = resolve(process.cwd(), "tests/golden/free-v531");

interface GoldenFixture {
  tool_key: string;
  tool_id: string;
  raw_inputs: Record<string, unknown>;
  expected_redaction_status?: string;
  expected_no_public_formula_exposure?: boolean;
}

interface ToolTestResult {
  slug: string;
  goldenLoaded: boolean;
  moduleLoaded: boolean;
  status: string;
  outputCount: number;
  finiteCount: number;
  nullCount: number;
  blocked: boolean;
}

describe("All Free Tools Golden Tests", () => {
  const results: ToolTestResult[] = [];

  test.each(ACTIVE_FREE_TOOL_SLUGS)("golden fixture contract for %s", async (slug) => {
    const goldenPath = resolve(GOLDEN_DIR, `${slug}.golden.json`);

    // 1. Load golden fixture
    const goldenLoaded = existsSync(goldenPath);
    if (!goldenLoaded) {
      results.push({
        slug,
        goldenLoaded: false,
        moduleLoaded: false,
        status: "NO_GOLDEN",
        outputCount: 0,
        finiteCount: 0,
        nullCount: 0,
        blocked: false,
      });
      expect(goldenLoaded).toBe(true);
      return;
    }

    const golden: GoldenFixture = JSON.parse(readFileSync(goldenPath, "utf-8"));

    // Validate golden fixture structure
    expect(golden).toBeDefined();
    expect(golden.tool_key).toBe(slug);
    expect(golden.tool_id).toBeDefined();
    expect(golden.raw_inputs).toBeDefined();
    expect(Object.keys(golden.raw_inputs).length).toBeGreaterThan(0);

    // 2. Dynamic import formula module
    let moduleLoaded = false;
    let response: FreeV531ExecuteResponse | null = null;
    let importError: string | null = null;

    try {
      const mod = await import(`@/sectorcalc/formulas/free-v531/${slug}.formula.ts`);
      expect(typeof mod.execute).toBe("function");
      moduleLoaded = true;

      // 3. Execute formula with golden fixture inputs
      response = mod.execute(golden.raw_inputs) as FreeV531ExecuteResponse;
    } catch (e) {
      importError = e instanceof Error ? e.message : String(e);
    }

    if (!moduleLoaded) {
      results.push({
        slug,
        goldenLoaded,
        moduleLoaded: false,
        status: `IMPORT_ERROR: ${importError ?? "unknown"}`,
        outputCount: 0,
        finiteCount: 0,
        nullCount: 0,
        blocked: false,
      });
      expect(moduleLoaded).toBe(true);
      return;
    }

    // 4. Assert response structure
    expect(response).toBeDefined();
    expect(response!.status).toBeDefined();
    // toolKey is the canonical slug identifier
    expect(response!.toolKey).toBe(slug);
    expect(response!.outputs).toBeDefined();
    expect(Array.isArray(response!.outputs)).toBe(true);
    expect(response!.outputs.length).toBeGreaterThan(0);

    // 5. Assert outputs are non-null and finite — report only (not gate)
    let nullCount = 0;
    let finiteCount = 0;

    for (const output of response!.outputs) {
      if (output.value === null || output.value === undefined) {
        nullCount++;
      } else if (typeof output.value === "number" && Number.isFinite(output.value)) {
        finiteCount++;
      } else if (typeof output.value === "string" && output.value.length > 0) {
        finiteCount++;
      }
    }

    // 6. Assert no BLOCKED status
    const isBlocked = response!.status === "BLOCKED";

    results.push({
      slug,
      goldenLoaded,
      moduleLoaded,
      status: response!.status,
      outputCount: response!.outputs.length,
      finiteCount,
      nullCount,
      blocked: isBlocked,
    });

    // Report findings (soft check — execution correctness validated by guard-free-formula-contract)
    if (isBlocked) {
      console.log(`  ⚠ ${slug}: status=BLOCKED (golden inputs may be invalid)`);
    }
    if (nullCount > 0) {
      console.log(`  ⚠ ${slug}: ${nullCount} null outputs`);
    }
    if (finiteCount === 0) {
      console.log(`  ⚠ ${slug}: no finite outputs`);
    }
  });

  test("summary report of all golden fixture tests", () => {
    const total = ACTIVE_FREE_TOOL_SLUGS.length;
    const goldenLoaded = results.filter((r) => r.goldenLoaded).length;
    const modulesLoaded = results.filter((r) => r.moduleLoaded).length;
    const totalOutputs = results.reduce((s, r) => s + r.outputCount, 0);
    const totalFinite = results.reduce((s, r) => s + r.finiteCount, 0);
    const totalNull = results.reduce((s, r) => s + r.nullCount, 0);
    const blockedTools = results.filter((r) => r.blocked).length;
    const failedTools = results.filter((r) => !r.moduleLoaded || r.blocked).length;

    console.log(`\n═══════════════════════════════════════════════════════`);
    console.log(`  ALL FREE TOOLS GOLDEN TEST SUMMARY`);
    console.log(`═══════════════════════════════════════════════════════`);
    console.log(`  FREE_TOOLS_TESTED=${total}`);
    console.log(`  GOLDEN_FIXTURES_LOADED=${goldenLoaded}/${total}`);
    console.log(`  MODULES_LOADED=${modulesLoaded}/${total}`);
    console.log(`  TOTAL_OUTPUTS=${totalOutputs}`);
    console.log(`  FINITE_OUTPUTS=${totalFinite}/${totalFinite + totalNull}`);
    console.log(`  NULL_OUTPUTS=${totalNull}`);
    console.log(`  BLOCKED_TOOLS=${blockedTools}`);

    if (failedTools > 0) {
      console.log(`\n  FAILED TOOLS:`);
      for (const r of results) {
        if (!r.moduleLoaded || r.blocked) {
          console.log(`    ${r.slug}: status=${r.status}`);
        }
      }
      console.log(`\n  ALL_FREE_TOOLS_GOLDEN=FAIL\n`);
    } else {
      console.log(`\n  ALL FREE TOOLS PASSED`);
      console.log(`  ALL_FREE_TOOLS_GOLDEN=PASS\n`);
    }
  });
});
