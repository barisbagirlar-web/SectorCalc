// SectorCalc V5.3.1 — Schema Resolver + Architecture Regression Tests
// Tests: schema resolver, execute route contract, form runtime, regression guards

import { describe, it, expect } from "vitest";

/* ─────────────────────────────────────────────── */
/*  Schema Resolver Tests                          */
/* ─────────────────────────────────────────────── */

describe("V5.3.1 Schema Resolver", () => {
  it("certified free tool resolves and validates", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const result = resolveApprovedToolSchema("downtime-cost");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe("free_v531");
      expect(result.schema.form_runtime_binding.renderer).toBe("UniversalIndustrialDecisionForm");
      expect(result.schema.inputs.length).toBeGreaterThan(0);
      expect(result.schema.outputs.length).toBeGreaterThan(0);
    }
  });

  it("quarantines generated and industrial fallback schemas", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    expect(resolveApprovedToolSchema("beam-deflection-calculator").ok).toBe(false);
    expect(resolveApprovedToolSchema("oee-quick-check").ok).toBe(false);
  });

  it("unknown tool returns safe error", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const result = resolveApprovedToolSchema("nonexistent-tool-xyz");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("SCHEMA_NOT_FOUND");
    }
  });
});

/* ─────────────────────────────────────────────── */
/*  Schema Validation Quality Tests               */
/* ─────────────────────────────────────────────── */

describe("V5.4 Certified Schema Boundary", () => {
  it("all active certified Free schemas pass the full schema contract", async () => {
    const { ACTIVE_FREE_TOOL_SLUGS } = await import("@/sectorcalc/runtime/active-tool-allowlist");
    const { resolveApprovedToolSchema } = await import("@/sectorcalc/runtime/resolve-approved-tool-schema");
    const { validateSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/schema-adapter"
    );
    const failures: string[] = [];
    for (const slug of ACTIVE_FREE_TOOL_SLUGS) {
      const resolved = resolveApprovedToolSchema(slug);
      if (!resolved.ok) { failures.push(`${slug}: not resolved`); continue; }
      const v = validateSuperV4Schema(resolved.schema);
      if (!v.ok) {
        failures.push(`${slug}: ${v.errors.slice(0, 2).join("; ")}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("preserves legacy inventories while keeping every entry quarantined", async () => {
    const { listGeneratedToolSchemaSlugs } = await import("@/lib/features/generated-tools/schema-loader");
    const { industrialFormulaTools } = await import(
      "@/lib/features/tools/revenue-tools-industrial-formulas"
    );
    const { isActiveFreeTool } = await import("@/sectorcalc/runtime/active-tool-allowlist");
    const generated = listGeneratedToolSchemaSlugs();
    const industrial = industrialFormulaTools.map((tool) => tool.freeSlug).filter(Boolean) as string[];
    expect(generated.length).toBeGreaterThan(100);
    expect(industrial.length).toBeGreaterThan(0);
    expect([...generated, ...industrial].filter(isActiveFreeTool)).toEqual([]);
  });

  it("active Free schemas expose no automatic defaults", async () => {
    const { ACTIVE_FREE_TOOL_SLUGS } = await import("@/sectorcalc/runtime/active-tool-allowlist");
    const { resolveApprovedToolSchema } = await import("@/sectorcalc/runtime/resolve-approved-tool-schema");
    const issues: string[] = [];
    for (const slug of ACTIVE_FREE_TOOL_SLUGS) {
      const resolved = resolveApprovedToolSchema(slug);
      if (!resolved.ok) { issues.push(`${slug}: not resolved`); continue; }
      for (const inp of resolved.schema.inputs) {
        if (inp.default_policy !== "NO_DEFAULT" && inp.default !== null && inp.default !== undefined) {
          issues.push(`${slug}/${inp.id}: default_policy=${inp.default_policy}`);
        }
      }
    }
    expect(issues).toEqual([]);
  });

  it("active Free unit-selectable inputs have conversion registry bindings", async () => {
    const { ACTIVE_FREE_TOOL_SLUGS } = await import("@/sectorcalc/runtime/active-tool-allowlist");
    const { resolveApprovedToolSchema } = await import("@/sectorcalc/runtime/resolve-approved-tool-schema");
    const issues: string[] = [];
    for (const slug of ACTIVE_FREE_TOOL_SLUGS) {
      const resolved = resolveApprovedToolSchema(slug);
      if (!resolved.ok) { issues.push(`${slug}: not resolved`); continue; }
      const reg = resolved.schema.unit_conversion_contract?.conversion_registry || {};
      for (const inp of resolved.schema.inputs) {
        if (inp.unit_selectable && inp.allowed_display_units?.length > 0) {
          if (!reg[inp.quantity_kind]) {
            issues.push(`${slug}/${inp.id}: quantity_kind=${inp.quantity_kind} has no registry entry`);
          }
        }
      }
    }
    expect(issues).toEqual([]);
  });
});

/* ─────────────────────────────────────────────── */
/*  Regression: No legacy form runtime             */
/* ─────────────────────────────────────────────── */

describe("V5.3.1 Regression — No legacy form runtime", () => {
  it("PremiumSchemaToolForm is not imported in live runtime", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const src = path.resolve("src");

    function recursiveFiles(dir: string, extSet: Set<string>): string[] {
      const results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      for (const entry of fs.readdirSync(dir, { recursive: true })) {
        const full = path.join(dir, entry as string);
        if (fs.statSync(full).isFile()) {
          const ext = path.extname(full).toLowerCase();
          if (extSet.has(ext)) results.push(full);
        }
      }
      return results;
    }

    const files = recursiveFiles(src, new Set([".ts", ".tsx", ".js", ".jsx"]));
    const violations: string[] = [];
    for (const f of files) {
      if (f.includes("__tests__") || f.includes(".test.")) continue;
      const content = fs.readFileSync(f, "utf-8");
      if (content.includes("PremiumSchemaToolForm")) {
        violations.push(path.relative(src, f));
      }
    }
    expect(violations).toEqual([]);
  });
});

/* ─────────────────────────────────────────────── */
/*  Regression: Formula leak prevention            */
/* ─────────────────────────────────────────────── */

describe("V5.3.1 Regression — Formula leak prevention", () => {
  it("execute route has no const schema = null", async () => {
    const fs = await import("node:fs");
    const routePath = "src/app/api/pro-calculator/execute/route.ts";
    const content = fs.readFileSync(routePath, "utf-8");
    expect(content).not.toContain("const schema = null");
    expect(content).not.toContain("let schema = null");
  });

  it("public response redactor processes safely", async () => {
    const { redactPublicResponse } = await import(
      "@/sectorcalc/pro-form/public-response-redactor"
    );
    const auditModule = await import("@/sectorcalc/pro-runtime/audit-seal-service");
    const { createAuditSeal, computeHash } = auditModule;
    type ExecuteResponse = import("@/sectorcalc/pro-form/contract-types").ExecuteResponse;

    const response = {
      status: "OK",
      pipeline_state: "OK",
      outputs: [{ id: "result", name: "Result", value: 42, status: "OK", public_explanation: "Safe explanation", decision_use: "Primary" }],
      warnings: [],
      normalized_input_audit: [],
      reference_range_audit: [],
      sensitivity: [],
      scenario_compare: null,
      fmea_summary: null,
      proof_pack_public: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED" as const, sections: [] },
      decision_interpretation: {
        primary_decision: "OK", primary_reason: "Test",
        user_profile_summary: { operator: "", engineer: "", owner_cfo: "", checker_auditor: "" },
        hidden_risk_explanations: [], money_impact_summary: {
          enabled: false, currency: null, money_at_risk_formatted: null,
          main_cost_driver: null, quote_or_decision_impact: "",
        },
        what_can_flip_the_decision: [], next_best_actions: [], premium_unlock_reason: "",
      },
      audit_seal: createAuditSeal({
        inputHash: computeHash("test"), outputHash: computeHash("test"),
        schemaHash: computeHash("test"), formulaVersion: "test",
        schemaVersion: "1.0.0", runtimeVersion: "test",
      }),
      redaction_status: "PUBLIC_SAFE_REDACTED" as const,
    } as unknown as ExecuteResponse;

    const result = redactPublicResponse(response);
    expect(result.status).not.toBe("REDACTION_FAILED_BLOCKED");
  });
});

/* ─────────────────────────────────────────────── */
/*  Tool Count Integrity                           */
/* ─────────────────────────────────────────────── */

describe("V5.3.1 Tool Count Integrity", () => {
  it("public Free count equals the certified allowlist", async () => {
    const { getFreeToolCount } = await import("@/lib/features/tools/tool-counts");
    const { ACTIVE_FREE_TOOL_SLUGS } = await import("@/sectorcalc/runtime/active-tool-allowlist");
    expect(getFreeToolCount()).toBe(ACTIVE_FREE_TOOL_SLUGS.length);
  });

  it("getTotalToolCount >= getFreeToolCount", async () => {
    const { getTotalToolCount, getFreeToolCount } = await import(
      "@/lib/features/tools/tool-counts"
    );
    expect(getTotalToolCount()).toBeGreaterThanOrEqual(getFreeToolCount());
  });
});
