// SectorCalc V5.3.1 — Schema Resolver + Architecture Regression Tests
// Tests: schema resolver, execute route contract, form runtime, regression guards

import { describe, it, expect } from "vitest";

/* ─────────────────────────────────────────────── */
/*  Schema Resolver Tests                          */
/* ─────────────────────────────────────────────── */

describe("V5.3.1 Schema Resolver", () => {
  it("generated free tool resolves and validates", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const result = resolveApprovedToolSchema("beam-deflection-calculator");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe("generated_free");
      expect(result.schema.tool_id).toBe("beam-deflection-calculator");
      expect(result.schema.form_runtime_binding.renderer).toBe("UniversalIndustrialDecisionForm");
      expect(result.schema.ui_contract.target_renderer).toBe("UniversalIndustrialDecisionForm");
      expect(result.schema.inputs.length).toBeGreaterThan(0);
      expect(result.schema.outputs.length).toBeGreaterThan(0);
    }
  });

  it("generated free tool has all required V5.3.1 top-level keys", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const result = resolveApprovedToolSchema("beam-deflection-calculator");
    expect(result.ok).toBe(true);
    if (result.ok) {
      const s = result.schema;
      expect(s.tool_id).toBeDefined();
      expect(s.tool_key).toBeDefined();
      expect(s.tool_name).toBeDefined();
      expect(s.category).toBeDefined();
      expect(s.inputs).toBeDefined();
      expect(s.outputs).toBeDefined();
      expect(s.formulas).toBeDefined();
      expect(s.ui_contract).toBeDefined();
      expect(s.form_runtime_binding).toBeDefined();
      expect(s.metadata).toBeDefined();
      expect(s.audit_trail_contract).toBeDefined();
      expect(s.brand_safety_policy).toBeDefined();
      expect(s.engine_rules).toBeDefined();
      expect(s.unit_conversion_contract).toBeDefined();
      expect(s.metadata.prompt_version).toBe("5.3.1");
    }
  });

  it("industrial free tool resolves valid fallback schema", async () => {
    const { resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const result = resolveApprovedToolSchema("oee-quick-check");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe("industrial_free");
    }
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

describe("V5.3.1 Schema Validation — All Generated Schemas", () => {
  it("all 268 generated free tool schemas pass validateSuperV4Schema", async () => {
    const { getGeneratedToolSchema, listGeneratedToolSchemaSlugs } = await import(
      "@/lib/features/generated-tools/schema-loader"
    );
    const { generatedToolSchemaToSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter"
    );
    const { validateSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/schema-adapter"
    );

    const slugs = listGeneratedToolSchemaSlugs();
    const failures: string[] = [];

    for (const slug of slugs) {
      const gen = getGeneratedToolSchema(slug);
      if (!gen) { failures.push(`${slug}: schema file not found`); continue; }
      const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);
      const v = validateSuperV4Schema(sv4);
      if (!v.ok) {
        failures.push(`${slug}: ${v.errors.slice(0, 2).join("; ")}`);
      }
    }

    if (failures.length > 0) {
      console.error("Schema validation failures:", failures.slice(0, 5));
    }
    expect(failures).toEqual([]);
  });

  it("all 16 industrial fallback schemas pass validateSuperV4Schema", async () => {
    const { buildIndustrialFreeToolSchema, isIndustrialFreeToolSlug } = await import(
      "@/lib/features/tools/industrial-free-schema-factory"
    );
    const { industrialFormulaTools } = await import(
      "@/lib/features/tools/revenue-tools-industrial-formulas"
    );
    const { generatedToolSchemaToSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter"
    );
    const { validateSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/schema-adapter"
    );

    const slugs = industrialFormulaTools.map((t) => t.freeSlug).filter(Boolean) as string[];
    const failures: string[] = [];

    for (const slug of slugs) {
      const gen = buildIndustrialFreeToolSchema(slug);
      if (!gen) { failures.push(`${slug}: schema build failed`); continue; }
      const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);
      const v = validateSuperV4Schema(sv4);
      if (!v.ok) {
        failures.push(`${slug}: ${v.errors.slice(0, 2).join("; ")}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("no generated schema has unverified smart defaults", async () => {
    const { getGeneratedToolSchema, listGeneratedToolSchemaSlugs } = await import(
      "@/lib/features/generated-tools/schema-loader"
    );
    const { generatedToolSchemaToSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter"
    );

    const slugs = listGeneratedToolSchemaSlugs();
    const issues: string[] = [];

    for (const slug of slugs) {
      const gen = getGeneratedToolSchema(slug);
      if (!gen) continue;
      const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);
      for (const inp of sv4.inputs) {
        if (inp.default_policy !== "NO_DEFAULT" && inp.default !== null && inp.default !== undefined) {
          issues.push(`${slug}/${inp.id}: default_policy=${inp.default_policy}`);
        }
      }
    }
    expect(issues).toEqual([]);
  });

  it("no conversion_registry failures for unit-selectable inputs", async () => {
    const { getGeneratedToolSchema, listGeneratedToolSchemaSlugs } = await import(
      "@/lib/features/generated-tools/schema-loader"
    );
    const { generatedToolSchemaToSuperV4Schema } = await import(
      "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter"
    );

    const slugs = listGeneratedToolSchemaSlugs();
    const issues: string[] = [];

    for (const slug of slugs) {
      const gen = getGeneratedToolSchema(slug);
      if (!gen) continue;
      const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);
      const reg = sv4.unit_conversion_contract?.conversion_registry || {};
      for (const inp of sv4.inputs) {
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
  it("getFreeToolCount is >= 284 (268 gen + 16 industrial)", async () => {
    const { getFreeToolCount } = await import("@/lib/features/tools/tool-counts");
    expect(getFreeToolCount()).toBeGreaterThanOrEqual(284);
  });

  it("getTotalToolCount >= getFreeToolCount", async () => {
    const { getTotalToolCount, getFreeToolCount } = await import(
      "@/lib/features/tools/tool-counts"
    );
    expect(getTotalToolCount()).toBeGreaterThanOrEqual(getFreeToolCount());
  });
});
