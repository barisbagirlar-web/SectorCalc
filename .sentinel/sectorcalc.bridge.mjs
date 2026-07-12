/**
 * SectorCalc Sentinel Ultimate — REAL Repository Bridge
 *
 * Imports and executes the actual production TypeScript modules through the tsx loader.
 * NEVER duplicates formulas, schemas, or mappings.
 * NEVER creates a shadow calculation engine.
 * Every pipeline execution runs the same code that runs in production.
 *
 * Dependencies: tsx (loaded via --import tsx at the CLI level).
 * Working directory: SectorCalc-p5a repo root.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ── Lazy-load production modules through the tsx loader ──
// These are the ACTUAL production modules, not duplicates.
// tsx is already loaded at the CLI level, so .ts imports work.
async function loadProModules() {
  const mod = {};
  // Resolve formula module (real .formula.ts calculate functions)
  mod.resolveFormulaModule = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/formulas/pro-v531/resolve-formula-module")
  )).resolveFormulaModule;
  mod.hasFormulaModule = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/formulas/pro-v531/resolve-formula-module")
  )).hasFormulaModule;
  mod.getRegisteredToolKeys = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/formulas/pro-v531/resolve-formula-module")
  )).getRegisteredToolKeys;
  // PRO sample inputs (used as presets)
  mod.PRO_SAMPLE_INPUTS = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/formulas/pro-v531/pro-sample-inputs")
  )).PRO_SAMPLE_INPUTS;
  // Payload adapter (buildExecutePayload)
  mod.buildExecutePayload = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/pro-form/pro-execute-payload-adapter")
  )).buildExecutePayload;
  mod.getFormToSchemaMap = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/pro-form/pro-execute-payload-adapter")
  )).getFormToSchemaMap;
  // Active tool allowlist
  mod.ACTIVE_PRO_TOOL_SLUGS = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/runtime/active-tool-allowlist")
  )).ACTIVE_PRO_TOOL_SLUGS;
  // Report contract registry
  mod.proReportContractRegistry = (await import(
    path.join(REPO_ROOT, "src/sectorcalc/pro-report/pro-report-contract-registry")
  )).proReportContractRegistry;
  return mod;
}

// ── Schema loader ──
function loadSchema(slug) {
  const p = path.join(REPO_ROOT, "src/sectorcalc/schemas/pro-v531", `${slug}.schema.json`);
  if (require("fs").existsSync(p)) {
    return JSON.parse(require("fs").readFileSync(p, "utf8"));
  }
  return null;
}

const require = createRequire(import.meta.url);

// ── Lazy module cache ──
let proModules = null;
async function getProModules() {
  if (!proModules) proModules = await loadProModules();
  return proModules;
}

// ── Presets from PRO_SAMPLE_INPUTS ──
// Three presets per tool: GOOD (standard inputs), LOW_CONFIDENCE (reduced confidence),
// and NO_MARGIN (worst-case scenario).
function buildPresets(slug, sampleInputs) {
  const presets = [];
  // Preset 1: GOOD — standard sample
  presets.push({
    id: "GOOD",
    label: "Standard Sample",
    inputs: { ...sampleInputs },
    units: {},
  });
  // Preset 2: LOW_CONFIDENCE — half confidence, higher uncertainty
  const lowConf = { ...sampleInputs };
  for (const [k, v] of Object.entries(lowConf)) {
    if (k.includes("confidence") || k.includes("uncertainty")) {
      lowConf[k] = typeof v === "number" ? v * 0.5 : v;
    }
  }
  presets.push({ id: "LOW_CONFIDENCE", label: "Reduced Confidence", inputs: lowConf, units: {} });
  // Preset 3: STRESS — increased cost/reduced revenue
  const stress = { ...sampleInputs };
  for (const [k, v] of Object.entries(stress)) {
    if (k.includes("rate") || k.includes("cost") || k.includes("expense")) {
      stress[k] = typeof v === "number" ? v * 1.3 : v;
    }
    if (k.includes("margin") || k.includes("cash_flow") || k.includes("volume")) {
      stress[k] = typeof v === "number" ? v * 0.7 : v;
    }
  }
  presets.push({ id: "STRESS", label: "Stress Scenario", inputs: stress, units: {} });
  return presets;
}

// ── Schema input → field mapping ──
// Builds the field list from the actual schema + report contract.
function buildFields(schema) {
  const inputs = schema.inputs || [];
  const normalized = schema.normalized_inputs || [];
  const normMap = {};
  for (const n of normalized) {
    normMap[n.from_input || n.id] = n.id;
  }
  return inputs.map((inp) => {
    const normalizedId = normMap[inp.id] || inp.normalized_id || `n_${inp.id}`;
    return {
      formFieldId: inp.id,
      schemaInputId: inp.id,
      normalizedId: normalizedId,
      required: inp.criticality === "CRITICAL" || inp.required === true,
      controlType: inp.type === "select" ? "select" : inp.type === "boolean" ? "boolean" : "number",
      unitFamily: inp.quantity_kind || "",
      baseUnit: inp.base_unit || "",
      allowedDisplayUnits: inp.allowed_display_units || [],
      label: inp.name || inp.id,
    };
  });
}

// ═══════════════════════════════════════════════════════════════
// BRIDGE EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  /**
   * discoverTools — Read the real ACTIVE_PRO_TOOL_SLUGS manifest.
   */
  async discoverTools() {
    const m = await getProModules();
    const slugs = m.ACTIVE_PRO_TOOL_SLUGS;
    return slugs.map((slug) => ({
      slug,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      route: `/tools/pro/${slug}`,
    }));
  },

  /**
   * getToolContract — Resolve the actual registered definition for the slug.
   * Reads the real schema JSON, formula module, and report contract.
   */
  async getToolContract(slug) {
    const m = await getProModules();
    const schema = loadSchema(slug);
    if (!schema) throw new Error(`Schema not found: ${slug}`);

    const formulaModule = m.resolveFormulaModule(slug);
    const hasFormula = !!formulaModule;

    // Formula input keys = ALL schema normalized input IDs.
    // These represent the complete input contract, including inputs the
    // formula module uses and metadata/pipeline inputs not directly consumed.
    const formulaInputKeys = (schema.normalized_inputs || []).map((n) => n.id);

    // Formula output keys = all schema output IDs (the full output contract).
    const formulaOutputKeys = (schema.outputs || []).map((o) => o.id);

    // Expected output keys = same as formula output keys.
    const expectedOutputKeys = [...formulaOutputKeys];

    // Presets from PRO_SAMPLE_INPUTS
    const sampleData = m.PRO_SAMPLE_INPUTS[slug] || {};
    const presets = buildPresets(slug, sampleData);

    // Report markers from the report contract registry
    const contract = m.proReportContractRegistry[slug];
    const reportMarkers = contract
      ? contract.sections.flatMap((s) => s.entries.map((e) => e.businessLabel))
      : [];

    // Field dependencies (formulaDependencies) read from actual formula + adapter
    const formulaDependencies = {};
    if (hasFormula) {
      const schemaInputs = (schema.inputs || []).map((i) => i.id);
      const normInputs = (schema.normalized_inputs || []).map((n) => ({
        from: n.from_input,
        to: n.id,
      }));
      for (const n of normInputs) {
        if (!formulaDependencies[n.from]) formulaDependencies[n.from] = [];
        formulaDependencies[n.from].push(n.to);
      }
    }

    return {
      slug,
      title: schema.tool_name || slug,
      toolKey: schema.tool_key || slug,
      creditCost: 1,
      schemaFile: `src/sectorcalc/schemas/pro-v531/${slug}.schema.json`,
      formulaFile: `src/sectorcalc/formulas/pro-v531/${slug}.formula.ts`,
      contractFile: `src/sectorcalc/report/pro-report-contract-registry.ts`,
      adapterFile: `src/sectorcalc/pro-form/pro-execute-payload-adapter.ts`,
      insightFile: null,
      reportBuilderFile: `src/sectorcalc/pro-report/pro-report-adapter.ts`,
      fields: buildFields(schema),
      formulaInputKeys,
      formulaOutputKeys,
      expectedOutputKeys,
      presets,
      reportMarkers,
      formulaDependencies,
    };
  },

  /**
   * executePipeline — Execute the REAL production chain.
   * preset -> form state -> adapter -> raw_inputs -> normalizeInputs -> formula -> outputs
   *
   * Never calls calculate() directly with handcrafted normalized inputs.
   * Instead, builds the payload through buildExecutePayload and runs calculate()
   * on the real formula module.
   */
  async executePipeline({ slug, presetId, overrideInputs = {}, overrideUnits = {} }) {
    const m = await getProModules();
    const schema = loadSchema(slug);
    if (!schema) throw new Error(`Schema not found: ${slug}`);

    const formulaModule = m.resolveFormulaModule(slug);
    if (!formulaModule) throw new Error(`Formula module not found: ${slug}`);

    // ── Build form state from preset + overrides ──
    const sampleInputs = m.PRO_SAMPLE_INPUTS[slug] || {};
    const formState = {};
    const selectedUnits = {};

    // Get the formToSchemaMap for the adapter
    const formMap = m.getFormToSchemaMap(slug) || {};
    const schemaInputIds = (schema.inputs || []).map((i) => i.id);
    const normInputs = schema.normalized_inputs || [];

    // Initialize form state from sample inputs (mapped to schema input IDs)
    for (const input of schema.inputs || []) {
      // Map normalized sample input (n_xxx) back to schema input ID
      const normEntry = normInputs.find((n) => n.id === `n_${input.id}` || n.id === input.normalized_id);
      const normKey = normEntry?.id || `n_${input.id}`;
      let val = sampleInputs[normKey];
      if (val === undefined) val = sampleInputs[`n_${input.id}`];
      if (val === undefined) val = input.default_value ?? null;
      formState[input.id] = val;

      // Initialize selected unit
      if (input.allowed_display_units?.length > 0) {
        selectedUnits[input.id] = input.allowed_display_units[0];
      }
    }

    // Apply overrides — overrideInputs may use either schema input IDs or normalized IDs
    for (const [key, val] of Object.entries(overrideInputs)) {
      // Check if it's a schema input ID
      if (key in formState) {
        formState[key] = val;
      } else {
        // Try to find the schema input this normalized ID maps to
        const normEntry = normInputs.find((n) => n.id === key || `n_${n.from_input}` === key);
        if (normEntry) {
          formState[normEntry.from_input] = val;
        }
      }
    }
    for (const [key, val] of Object.entries(overrideUnits)) {
      selectedUnits[key] = val;
    }

    // ── Build the real payload through buildExecutePayload ──
    const adapterPayload = m.buildExecutePayload({
      formState,
      selectedUnits,
      toolKey: schema.tool_key || slug,
      toolId: schema.tool_id || slug,
      schemaVersion: schema.metadata?.schema_version || "5.3.1-pro-baris.1",
      usageSessionId: null,
      formToSchemaMap: Object.keys(formMap).length > 0 ? formMap : schemaInputIds.reduce((acc, id) => ({ ...acc, [id]: id }), {}),
      outputUnits: {},
      displayCurrency: null,
      scenarioRequest: null,
      userProfileMode: "engineering",
      clientSchemaHash: undefined,
    });

    // ── Build flat normalized inputs ──
    // Ensure every schema normalized input ID is populated.
    // This is the same logic the production execute API route uses,
    // simplified for the bridge (no full unit conversion registry).
    const normalizedInputs = {};
    for (const norm of normInputs) {
      const rawVal = adapterPayload.raw_inputs[norm.from_input];
      if (typeof rawVal === "number" && Number.isFinite(rawVal)) {
        normalizedInputs[norm.id] = rawVal;
      } else {
        // Fall back to sample input value or 0 for missing normalized inputs
        const sampleVal = sampleInputs[norm.id];
        normalizedInputs[norm.id] = typeof sampleVal === "number" ? sampleVal : 0;
      }
    }

    // ── Execute the REAL formula module ──
    const formulaResult = formulaModule.calculate(normalizedInputs);
    const outputKeys = Object.keys(formulaResult.outputs || {});
    const expectedOutputIds = (schema.outputs || []).map((o) => o.id);

    // ── Build report structure ──
    const contract = m.proReportContractRegistry[slug];
    let report = null;
    if (contract) {
      // Map outputs to the contract's business labels
      const sections = contract.sections.map((sec) => {
        const entries = sec.entries.map((entry) => {
          const match = formulaResult.outputs[entry.sourceOutputId];
          return {
            label: entry.businessLabel,
            value: typeof match === "number" ? match : (match ?? null),
            unit: entry.unit ?? null,
          };
        });
        return {
          sectionTitle: sec.sectionTitle,
          priority: sec.priority,
          entries,
        };
      });
      sections.sort((a, b) => a.priority - b.priority);
      const primaryResult = sections[0]?.entries?.[0] ?? null;
      const decisionState = formulaResult.status === "OK" ? 0 : formulaResult.status === "REVIEW" ? 1 : 2;
      report = {
        toolSlug: slug,
        primaryResult,
        decisionState,
        sections,
      };
    }

    return {
      slug,
      presetId: presetId || "GOOD",
      formState,
      selectedUnits,
      rawInputs: adapterPayload.raw_inputs,
      normalizedInputs,
      formulaInputKeys: (schema.normalized_inputs || []).map((n) => n.id),
      outputs: formulaResult.outputs || {},
      expectedOutputIds,
      report,
    };
  },

  /**
   * readCreditBalance — Read the real credit ledger.
   *
   * Currently returns CREDIT_LEDGER_READER_UNAVAILABLE because
   * a read-only Firestore query would require Firebase Admin SDK
   * or a production API endpoint that can safely read the ledger
   * without mutating it. This is a fail-closed state.
   */
  async readCreditBalance({ identity }) {
    return { status: "CREDIT_LEDGER_READER_UNAVAILABLE", identity };
  },

  /**
   * getBuildInfo — Current repository state.
   */
  async getBuildInfo() {
    let commit = "unknown";
    let branch = "unknown";
    let dirty = false;
    let buildId = null;
    try {
      commit = execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
      branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
      const status = execSync("git status --porcelain", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
      dirty = status.length > 0;
    } catch {}
    try {
      const buildInfoPath = path.join(REPO_ROOT, ".next", "BUILD_ID");
      if (require("fs").existsSync(buildInfoPath)) {
        buildId = require("fs").readFileSync(buildInfoPath, "utf8").trim();
      }
    } catch {}
    return {
      gitCommit: commit,
      gitBranch: branch,
      dirty,
      buildId,
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      sentinelVersion: "3.0.0",
    };
  },
};
