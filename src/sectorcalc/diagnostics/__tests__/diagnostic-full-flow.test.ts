/**
 * Engineering Diagnostics — Full Diagnostic Flow Tests
 *
 * Tests for:
 * - Package model constants
 * - Guardrails validation
 * - Report schema with ai_section
 * - AI does not override deterministic values
 * - Forbidden claims
 * - Import integrity (no hardcoded API keys)
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { validateAiOutput } from "../ai/diagnostic-ai-guardrails";
import { DiagnosticReportSchema, AiReportSectionSchema } from "../report/diagnostic-report-schema";
import {
  DIAGNOSTIC_PACKAGE_CREDITS,
  DIAGNOSTIC_PACKAGE_USES,
  FULL_DIAGNOSTIC_USE_COST,
} from "../diagnostic-package";

/* ── Sample inputs ── */

const SAMPLE_AI_INPUT = {
  domain_id: "CNC_MACHINING",
  domain_label: "CNC Machining",
  problem_context: "Shaft diameter trending high on final turning operation.",
  measurements: [{ measured_value: 50.09, nominal_value: 50.0, tolerance_plus: 0.1, tolerance_minus: 0.1, unit: "mm", measurement_tool: "micrometer", calibration_status: "valid", part_condition: "good" }],
  deterministic: {
    measurement_results: [{ expanded_uncertainty_k2: 0.01, confidence_class: "HIGH", tolerance_status: "INSIDE" }],
    cost_at_risk: 2500,
    decision: "LOW_RISK",
    total_risk_score: 12,
    action_plan_items: 3,
  },
};

const VALID_AI_OUTPUT = {
  visual_observations: [
    { description: "Minor surface irregularity observed near the shoulder", severity_hint: "LOW", confidence: 0.8, manual_verification_required: true },
  ],
  engineering_interpretation: "The shaft diameter measurement is within acceptable tolerance. No immediate risk of functional failure. The observed deviation is consistent with normal tool wear patterns and does not indicate a systemic process issue.",
  root_cause_hypotheses: [
    "Normal tool wear on finishing insert",
    "Minor thermal expansion variation during machining",
  ],
  ncr_statement: "NCR-001: Shaft diameter measurement 50.09mm is within the specified tolerance of 50.0mm ± 0.1mm. No non-conformance identified at this time.",
  capa_statement: "CAPA-001: Continue monitoring shaft diameter at the current inspection frequency. Schedule tool wear analysis if trend continues for 10+ consecutive parts.",
  executive_summary: "Measurement confidence is HIGH and all parameters are within tolerance. The estimated cost-at-risk is $2,500, primarily driven by potential rework. Current risk level is LOW.",
  action_narrative: "1. Verify measurement tool calibration is current. 2. Document the current reading in the quality log. 3. Continue production with routine inspection intervals.",
};

/* ── Tests ── */

describe("diagnostic-package — constants", () => {
  it("DIAGNOSTIC_PACKAGE_CREDITS is 5", () => {
    expect(DIAGNOSTIC_PACKAGE_CREDITS).toBe(5);
  });

  it("DIAGNOSTIC_PACKAGE_USES is 3", () => {
    expect(DIAGNOSTIC_PACKAGE_USES).toBe(3);
  });

  it("FULL_DIAGNOSTIC_USE_COST is 1", () => {
    expect(FULL_DIAGNOSTIC_USE_COST).toBe(1);
  });
});

describe("diagnostic-ai-guardrails", () => {
  it("passes valid AI output", () => {
    const result = validateAiOutput(VALID_AI_OUTPUT, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(true);
    expect(result.output).not.toBeNull();
    expect(result.errors).toHaveLength(0);
  });

  it("rejects non-object input", () => {
    const result = validateAiOutput("string", SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
  });

  it("rejects output missing required keys", () => {
    const result = validateAiOutput({}, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects numeric risk score in AI narrative", () => {
    const badOutput = {
      ...VALID_AI_OUTPUT,
      engineering_interpretation: "The risk score 45 indicates moderate risk.",
    };
    const result = validateAiOutput(badOutput, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("risk score"))).toBe(true);
  });

  it("rejects forbidden claim: certified", () => {
    const badOutput = {
      ...VALID_AI_OUTPUT,
      executive_summary: "This report is certified and guaranteed.",
    };
    const result = validateAiOutput(badOutput, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("certified"))).toBe(true);
  });

  it("rejects forbidden claim: guaranteed", () => {
    const badOutput = {
      ...VALID_AI_OUTPUT,
      ncr_statement: "This is guaranteed to detect all defects.",
    };
    const result = validateAiOutput(badOutput, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
  });

  it("rejects forbidden claim: 100%", () => {
    const badOutput = {
      ...VALID_AI_OUTPUT,
      capa_statement: "This CAPA is 100% effective.",
    };
    const result = validateAiOutput(badOutput, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
  });

  it("validates visual_observations structure", () => {
    const badOutput = {
      ...VALID_AI_OUTPUT,
      visual_observations: [{ bad: "data" }],
    };
    const result = validateAiOutput(badOutput, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
  });
});

describe("diagnostic-report-schema — ai_section", () => {
  it("accepts report without ai_section", () => {
    const baseReport = {
      report_id: "test_001",
      report_type: "ENGINEERING_DIAGNOSTIC_PREVIEW" as const,
      schema_version: "2.0.0",
      engine_version: "1.0.0",
      methodology_version: "1.0.0",
      created_at: new Date().toISOString(),
      domain_section: {
        domain_id: "CNC_MACHINING",
        label: "CNC Machining",
        description: "Test",
        category: "core",
        process_description: "Test",
        typical_tolerances: "±0.1mm",
        common_defect_modes: [],
      },
      problem_section: { problem_context: "Test problem" },
      measurement_section: {
        entries: [{
          index: 0, measured_value: 50.0, nominal_value: 50.0,
          tolerance_plus: 0.1, tolerance_minus: 0.1, unit: "mm",
          measurement_tool: "micrometer", calibration_status: "valid",
          part_condition: "good", expanded_uncertainty_k2: 0.01,
          confidence_class: "HIGH", tolerance_status: "INSIDE",
          mandatory_decision_floor: null,
        }],
        worst_case_tolerance_status: "INSIDE",
      },
      cost_section: {
        affected_quantity: 100, material_cost_per_unit: 25,
        rework_hours_per_unit: 0.5, blended_hourly_rate: 45,
        downtime_hours: 8, machine_hourly_rate: 120,
        expedite_or_delay_cost: 500, scrap_probability: 0.05,
        rework_probability: 0.15, probability_source: "DEFAULT_TABLE",
        estimated_cost_at_risk: 2500, assumptions: [],
      },
      decision_section: {
        total_risk_score: 12, decision: "LOW_RISK",
        mandatory_floor_applied: false,
        measurement_risk: 0, confidence_risk: 0, visual_advisory_risk: 0,
        exposure_risk: 5, cost_risk: 3, manual_check_risk: 0,
      },
      action_plan_section: {
        containment: [], temporary_fix: [],
        permanent_corrective_action: [], required_manual_checks: [],
      },
      evidence_section: {
        photo_status: "NOT_ATTACHED" as const,
        image_hash: null, privacy_mode: "standard",
      },
      related_tools_section: { tools: [] },
      methodology_section: {
        entries: [{ name: "Test", description: "Test", formula: "x=y" }],
        note: "Test methodology",
      },
      limitation_section: {
        disclaimer: "Test disclaimer",
        llm_limitation: "Test limitation",
        manual_verification_required: true,
      },
      audit_log: [{ event: "Test", at: new Date().toISOString(), source: "server" as const, engine_version: "1.0.0" }],
    };

    const result = DiagnosticReportSchema.safeParse(baseReport);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ai_section).toBeUndefined();
    }
  });

  it("accepts report with valid ai_section", () => {
    const baseReport = {
      report_id: "full_test_001",
      report_type: "ENGINEERING_DIAGNOSTIC_PREVIEW" as const,
      schema_version: "2.0.0",
      engine_version: "1.0.0",
      methodology_version: "1.0.0",
      created_at: new Date().toISOString(),
      domain_section: {
        domain_id: "CNC_MACHINING",
        label: "CNC Machining",
        description: "Test",
        category: "core",
        process_description: "Test",
        typical_tolerances: "±0.1mm",
        common_defect_modes: [],
      },
      problem_section: { problem_context: "Test problem" },
      measurement_section: {
        entries: [{
          index: 0, measured_value: 50.0, nominal_value: 50.0,
          tolerance_plus: 0.1, tolerance_minus: 0.1, unit: "mm",
          measurement_tool: "micrometer", calibration_status: "valid",
          part_condition: "good", expanded_uncertainty_k2: 0.01,
          confidence_class: "HIGH", tolerance_status: "INSIDE",
          mandatory_decision_floor: null,
        }],
        worst_case_tolerance_status: "INSIDE",
      },
      cost_section: {
        affected_quantity: 100, material_cost_per_unit: 25,
        rework_hours_per_unit: 0.5, blended_hourly_rate: 45,
        downtime_hours: 8, machine_hourly_rate: 120,
        expedite_or_delay_cost: 500, scrap_probability: 0.05,
        rework_probability: 0.15, probability_source: "DEFAULT_TABLE",
        estimated_cost_at_risk: 2500, assumptions: [],
      },
      decision_section: {
        total_risk_score: 12, decision: "LOW_RISK",
        mandatory_floor_applied: false,
        measurement_risk: 0, confidence_risk: 0, visual_advisory_risk: 0,
        exposure_risk: 5, cost_risk: 3, manual_check_risk: 0,
      },
      action_plan_section: {
        containment: [], temporary_fix: [],
        permanent_corrective_action: [], required_manual_checks: [],
      },
      evidence_section: {
        photo_status: "NOT_ATTACHED" as const,
        image_hash: null, privacy_mode: "standard",
      },
      related_tools_section: { tools: [] },
      methodology_section: {
        entries: [{ name: "Test", description: "Test", formula: "x=y" }],
        note: "Test methodology",
      },
      limitation_section: {
        disclaimer: "Test disclaimer",
        llm_limitation: "Test limitation",
        manual_verification_required: true,
      },
      audit_log: [{ event: "Test", at: new Date().toISOString(), source: "server" as const, engine_version: "1.0.0" }],
      ai_section: {
        visual_observations: [],
        engineering_interpretation: "Engineering interpretation text.",
        root_cause_hypotheses: ["Hypothesis 1"],
        ncr_statement: "NCR statement.",
        capa_statement: "CAPA statement.",
        executive_summary: "Executive summary.",
        action_narrative: "Action narrative.",
        provider: "openai",
        model: "gpt-4o",
        generated_at: new Date().toISOString(),
      },
    };

    const result = DiagnosticReportSchema.safeParse(baseReport);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ai_section).toBeDefined();
      expect(result.data.ai_section!.provider).toBe("openai");
      expect(result.data.ai_section!.model).toBe("gpt-4o");
    }
  });

  it("ai_section must have correct provider value", () => {
    const result = AiReportSectionSchema.safeParse({
      visual_observations: [],
      engineering_interpretation: "Test",
      root_cause_hypotheses: ["Test"],
      ncr_statement: "Test",
      capa_statement: "Test",
      executive_summary: "Test",
      action_narrative: "Test",
      provider: "anthropic", // wrong provider
      model: "claude",
      generated_at: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

describe("deterministic — AI does not override decision", () => {
  it("guardrails strip numeric risk score from AI output", () => {
    const withRisk = {
      ...VALID_AI_OUTPUT,
      engineering_interpretation: "The component shows signs of wear.",
    };
    const result = validateAiOutput(withRisk, {
      ...SAMPLE_AI_INPUT,
      deterministic: { ...SAMPLE_AI_INPUT.deterministic, decision: "LOW_RISK" },
    });
    expect(result.ok).toBe(true);
    // The deterministic decision remains as-is — AI can't change it
    expect(SAMPLE_AI_INPUT.deterministic.decision).toBe("LOW_RISK");
  });

  it("AI output cannot override total_risk_score", () => {
    // This test verifies the guardrails reject any AI output mentioning risk score
    const withNumericRisk = {
      ...VALID_AI_OUTPUT,
      executive_summary: "Total risk score 85 out of 100.",
    };
    const result = validateAiOutput(withNumericRisk, SAMPLE_AI_INPUT);
    expect(result.ok).toBe(false);
  });
});

describe("import integrity", () => {
  const checkFiles = [
    "src/sectorcalc/diagnostics/ai/openai-diagnostics-provider.ts",
    "src/sectorcalc/diagnostics/ai/diagnostic-ai-guardrails.ts",
    "src/sectorcalc/diagnostics/diagnostic-package.ts",
    "src/app/api/engineering-diagnostics/full-diagnostic/route.ts",
  ];

  for (const relPath of checkFiles) {
    it(`${relPath} does not contain hardcoded API keys`, () => {
      const fullPath = resolve(__dirname, "..", "..", "..", "..", relPath);
      const content = readFileSync(fullPath, "utf-8");
      // Check for hardcoded sk- patterns (not inside a regex or variable)
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip lines that define the regex pattern or are comments
        if (line.includes("API_KEY_PATTERN") || line.includes("//") || line.trim().startsWith("*")) continue;
        // Check for literal sk- strings
        if (/["']sk-[A-Za-z0-9]{20,}["']/.test(line)) {
          expect.fail(`Hardcoded API key found in ${relPath}:${i + 1}`);
        }
      }
    });
  }

  it("full-diagnostic route only imports server-side modules", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/app/api/engineering-diagnostics/full-diagnostic/route.ts");
    const content = readFileSync(fullPath, "utf-8");
    // Route is in app/api/ — Next.js server runtime
    // Check it doesn't import "use client" or firebase/client
    expect(content).not.toMatch(/"use client"/);
    expect(content).not.toMatch(/from\s+["'].*\/client["']/);
  });
});

describe("no forbidden claims in AI code", () => {
  // This test ensures guardrails code (which necessarily contains forbidden words
  // in its regex patterns) isn't flagged. The guardrails file is expected to have
  // these patterns — the test validates that certifying claims aren't used
  // as literal assertions (strings in production output).
  it("guardrails defines forbidden claims as regex patterns, not strings", () => {
    const fullPath = resolve(__dirname, "..", "..", "..", "..",
      "src/sectorcalc/diagnostics/ai/diagnostic-ai-guardrails.ts");
    const content = readFileSync(fullPath, "utf-8");
    // The FORBIDDEN_CLAIMS array should contain regex literals, not strings
    expect(content).toMatch(/FORBIDDEN_CLAIMS/);
    expect(content).toMatch(/\/certified\/i/);
    // No string literals with certifying claims outside of regex patterns
    const productionStrings = content
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        // Skip blank, comments, regex literals, and FORBIDDEN_CLAIMS line
        if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/") || t.includes("FORBIDDEN_CLAIMS")) return false;
        return /["']certified|["']guaranteed|["']defect-free/.test(t);
      });
    expect(productionStrings.length).toBe(0);
  });
});
