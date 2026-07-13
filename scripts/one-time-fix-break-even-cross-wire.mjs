#!/usr/bin/env node

import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function file(path) {
  return resolve(root, path);
}

function read(path) {
  return readFileSync(file(path), "utf8");
}

function write(path, content) {
  writeFileSync(file(path), content, "utf8");
}

function replaceOnce(path, source, target, label) {
  const content = read(path);
  const first = content.indexOf(source);
  const last = content.lastIndexOf(source);
  if (first < 0 || first !== last) {
    throw new Error(`${label}: expected exactly one source block in ${path}`);
  }
  write(path, content.slice(0, first) + target + content.slice(first + source.length));
}

function replaceBetween(path, startMarker, endMarker, replacement, label) {
  const content = read(path);
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0 || content.indexOf(startMarker, start + 1) >= 0) {
    throw new Error(`${label}: markers were not unique in ${path}`);
  }
  write(path, content.slice(0, start) + replacement + content.slice(end));
}

// 1. Remove the copied capital-investment input map from the break-even payload adapter.
replaceBetween(
  "src/sectorcalc/pro-form/pro-execute-payload-adapter.ts",
  "export const breakEvenFormToSchemaMap: FormToSchemaMap = {",
  "// ── 2. machine-hourly-rate-proof-report ──",
  `export const breakEvenFormToSchemaMap: FormToSchemaMap = {
  monthly_fixed_cash_cost: "monthly_fixed_cash_cost",
  monthly_debt_service: "monthly_debt_service",
  contribution_margin_ratio: "contribution_margin_ratio",
  current_monthly_revenue: "current_monthly_revenue",
  unrestricted_cash_balance: "unrestricted_cash_balance",
  minimum_cash_buffer: "minimum_cash_buffer",
  target_survival_months: "target_survival_months",
  downside_revenue_factor: "downside_revenue_factor",
  source_confidence_ratio: "source_confidence_ratio",
  uncertainty_multiplier: "uncertainty_multiplier",
};

`,
  "break-even payload map",
);

// 2. Make the state machine the sole owner of example initialization and propagate currency.
replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  'import { resolveIndustrialExampleValue } from "./example-value-resolver";\n',
  "",
  "remove duplicate example resolver import",
);

replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  `  // ── Hooks (unconditional) ──
  const machine = useUniversalIndustrialDecisionFormMachine({`,
  `  // ── Currency display selector ──
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");

  // ── Hooks (unconditional) ──
  const machine = useUniversalIndustrialDecisionFormMachine({`,
  "move selected currency before machine hook",
);

replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  `    authToken: props.executeAuthToken ?? undefined,
  });`,
  `    authToken: props.executeAuthToken ?? undefined,
    displayCurrency: selectedCurrency,
  });`,
  "pass selected currency to machine",
);

replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  `  // ── Currency display selector ──
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");

`,
  "",
  "remove former currency state location",
);

replaceBetween(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "  // ── Industrial example values (initial mount — useLayoutEffect for no flicker) ──",
  "  const runsRemaining = props.remainingRuns ?? 0;",
  "",
  "remove duplicate example initializer",
);

replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  `      rawInputs: state.rawInputState,
      selectedUnits: state.selectedUnitState,
    });`,
  `      rawInputs: state.rawInputState,
      selectedUnits: state.selectedUnitState,
      displayCurrency: selectedCurrency,
    });`,
  "pass selected currency to report adapter",
);

replaceOnce(
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  `  }, [isPro, hasResult, response?.outputs, props.toolKey, props.schema?.tool_key]);`,
  `  }, [isPro, hasResult, response?.outputs, props.toolKey, props.schema?.tool_key, state.rawInputState, state.selectedUnitState, selectedCurrency]);`,
  "complete report memo dependencies",
);

// 3. Carry selected currency into the server execution request.
replaceOnce(
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  `  authToken?: string;
  fetcher?:`,
  `  authToken?: string;
  displayCurrency?: string | null;
  fetcher?:`,
  "machine option display currency",
);

replaceOnce(
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  `      displayCurrency: null,`,
  `      displayCurrency: options.displayCurrency ?? null,`,
  "payload display currency",
);

replaceOnce(
  "src/sectorcalc/pro-form/useUniversalIndustrialDecisionFormMachine.ts",
  `  }, [executeEndpoint, fetcher, options.schema, state.evidenceState, state.profileModeState.mode, state.rawInputState, state.scenarioState.request, state.schemaState.schema_hash, state.selectedUnitState]);`,
  `  }, [executeEndpoint, fetcher, options.schema, options.displayCurrency, options.usageSessionId, state.evidenceState, state.executionState, state.profileModeState.mode, state.rawInputState, state.scenarioState.request, state.schemaState.schema_hash, state.selectedUnitState, currentToolKey]);`,
  "execution callback dependencies",
);

// 4. Seal the real formula version instead of the legacy stub marker.
replaceOnce(
  "src/app/api/pro-calculator/execute/route.ts",
  `    formulaVersion: "stub",`,
  `    formulaVersion: validatedSchema.metadata.formula_version,`,
  "audit seal formula version",
);

// 5. Replace the stale generic report registry entry with the actual domain contract.
replaceBetween(
  "src/sectorcalc/pro-report/pro-report-contract-registry.ts",
  "// 1. break-even-survival-cash-calculator",
  "// 2. machine-hourly-rate-proof-report",
  `// 1. break-even-survival-cash-calculator
// ---------------------------------------------------------------------------
register({
  toolSlug: "break-even-survival-cash-calculator",
  sections: [
    {
      sectionTitle: "Break-Even Position",
      priority: 10,
      entries: [
        {
          sourceOutputId: "out_break_even_monthly_revenue",
          businessLabel: "Break-Even Monthly Revenue",
          format: "currency",
          unit: "currency/month",
          explanation: "Monthly revenue required to cover fixed cash costs and debt service at the entered contribution margin.",
        },
        {
          sourceOutputId: "out_current_revenue_gap",
          businessLabel: "Current Revenue Gap vs Break-Even",
          format: "currency",
          unit: "currency/month",
          explanation: "Positive values are headroom; negative values are the monthly revenue shortfall.",
        },
        {
          sourceOutputId: "out_margin_of_safety_ratio",
          businessLabel: "Revenue Margin of Safety",
          format: "percentage",
          unit: "%",
          valueMultiplier: 100,
          explanation: "Current revenue headroom relative to current monthly revenue.",
        },
      ],
    },
    {
      sectionTitle: "Survival Cash Stress",
      priority: 20,
      entries: [
        { sourceOutputId: "out_stressed_monthly_revenue", businessLabel: "Stressed Monthly Revenue", format: "currency", unit: "currency/month" },
        { sourceOutputId: "out_monthly_cash_burn", businessLabel: "Monthly Cash Burn Under Stress", format: "currency", unit: "currency/month" },
        { sourceOutputId: "out_cash_runway_months", businessLabel: "Cash Runway Under Stress", format: "number", unit: "months" },
        { sourceOutputId: "out_survival_cash_target", businessLabel: "Survival Cash Target", format: "currency", unit: "currency" },
        { sourceOutputId: "out_funding_gap", businessLabel: "Funding Gap to Target", format: "currency", unit: "currency" },
      ],
    },
    {
      sectionTitle: "Control & Evidence",
      priority: 30,
      entries: [
        { sourceOutputId: "out_evidence_completeness", businessLabel: "Input Confidence", format: "percentage", unit: "%", valueMultiplier: 100 },
        { sourceOutputId: "out_uncertainty_cash_buffer", businessLabel: "Uncertainty Cash Buffer", format: "currency", unit: "currency" },
        {
          sourceOutputId: "out_threshold_crossing",
          businessLabel: "Target Runway Status",
          format: "string",
          valueLabels: { "0": "WITHIN TARGET", "1": "BREACHED" },
        },
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
`,
  "replace stale report registry contract",
);

// 6. Collapse report contract selection to one registry source.
replaceOnce(
  "src/sectorcalc/pro-report/pro-report-adapter.ts",
  'import { getProReportContractOverride } from "./pro-report-contract-overrides";\n',
  "",
  "remove report override import",
);
replaceOnce(
  "src/sectorcalc/pro-report/pro-report-adapter.ts",
  `  const contract =
    getProReportContractOverride(input.toolSlug) ??
    getProReportContract(input.toolSlug);`,
  `  const contract = getProReportContract(input.toolSlug);`,
  "single report registry source",
);

replaceOnce(
  "src/sectorcalc/formulas/pro-v531/__tests__/break-even-contract-isolation.test.ts",
  `    const { getProReportContractOverride } = await import(
      "@/sectorcalc/pro-report/pro-report-contract-overrides"
    );
    const reportContract = getProReportContractOverride(schema.tool_key);`,
  `    const { getProReportContract } = await import(
      "@/sectorcalc/pro-report/pro-report-contract-registry"
    );
    const reportContract = getProReportContract(schema.tool_key);`,
  "test canonical report registry",
);

const overridePath = file("src/sectorcalc/pro-report/pro-report-contract-overrides.ts");
if (!existsSync(overridePath)) {
  throw new Error("report override file was expected before canonicalization");
}
rmSync(overridePath);

console.log("BREAK_EVEN_CROSS_WIRE_PATCH=APPLIED");
