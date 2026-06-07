import { describe, expect, test } from "vitest";
import {
  FORMULA_REGISTRY,
  FORMULA_REGISTRY_META,
  listRegisteredFormulaIds,
} from "@/lib/premium-schema/formula-registry";
import {
  createDraftFormulaStep,
  createDraftInput,
  createDraftOutput,
  createEmptyPremiumSchemaDraft,
  draftContainsExpressionKeys,
  draftToJson,
  draftToPremiumSchema,
  draftToTypeScriptExport,
  validatePremiumSchemaDraft,
  type PremiumSchemaDraft,
} from "@/lib/premium-schema/schema-draft";

function buildMinimalValidDraft(): PremiumSchemaDraft {
  return {
    slug: "test-analyzer",
    name: "Test Analyzer",
    sectorSlug: "test-sector",
    category: "cost",
    painStatement: "Test pain statement for validation.",
    promise: "Test promise for authoring.",
    legacyPaidSlug: "",
    inputs: [
      createDraftInput({
        id: "hourlyCost",
        label: "Hourly cost",
        unit: "$/h",
        smartDefault: "50",
        helper: "Helper",
        expertMeaning: "Expert",
      }),
      createDraftInput({
        id: "lossHours",
        label: "Loss hours",
        unit: "h",
        smartDefault: "2",
        helper: "Helper",
        expertMeaning: "Expert",
      }),
    ],
    formulaPipeline: [
      createDraftFormulaStep({
        formulaId: "time.labor_cost",
        inputMap: { hourlyCost: "hourlyCost", lossHours: "lossHours" },
        outputId: "laborCost",
      }),
    ],
    outputs: [
      createDraftOutput({
        id: "laborCost",
        label: "Labor cost",
        unit: "$",
        format: "currency",
        isBigNumber: true,
      }),
    ],
    thresholds: [],
    report: {
      title: "Test Decision Report",
      sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
      exportFormats: ["pdf"],
      assumptionNotes: ["Test assumption note."],
      legalNote:
        "This report is a technical decision-support simulation. Verify all outputs before business decisions.",
      hiddenLossMultiplier: "1.1",
      volatilityPercent: "15",
      targetMarginPercent: "12",
    },
  };
}

describe("schema-draft", () => {
  test("createEmptyPremiumSchemaDraft returns invalid draft", () => {
    const draft = createEmptyPremiumSchemaDraft();
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  test("valid minimal draft converts to PremiumCalculatorSchema", () => {
    const draft = buildMinimalValidDraft();
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(true);

    const schema = draftToPremiumSchema(draft);
    expect(schema).not.toBeNull();
    expect(schema?.id).toBe("test-analyzer");
    expect(schema?.formulaPipeline[0]?.formulaId).toBe("time.labor_cost");
  });

  test("unknown formulaId fails validation", () => {
    const draft = buildMinimalValidDraft();
    draft.formulaPipeline[0] = {
      ...draft.formulaPipeline[0],
      formulaId: "not.registered.formula",
    };
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.includes("Unknown formulaId"))).toBe(true);
  });

  test("missing outputId in pipeline fails validation", () => {
    const draft = buildMinimalValidDraft();
    draft.formulaPipeline[0] = {
      ...draft.formulaPipeline[0],
      outputId: "missingOutput",
    };
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.includes("outputId"))).toBe(true);
  });

  test("missing bigNumber output fails validation", () => {
    const draft = buildMinimalValidDraft();
    draft.outputs[0] = { ...draft.outputs[0], isBigNumber: false };
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.toLowerCase().includes("big number"))).toBe(true);
  });

  test("threshold unknown field fails validation", () => {
    const draft = buildMinimalValidDraft();
    draft.thresholds = [
      {
        fieldId: "unknownField",
        warning: "5",
        critical: "10",
        direction: "higher_is_bad",
        warningMessage: "Warning",
        criticalMessage: "Critical",
      },
    ];
    const validation = validatePremiumSchemaDraft(draft);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.includes("unknownField"))).toBe(true);
  });

  test("registry meta matches all formula registry keys", () => {
    const registryKeys = new Set(listRegisteredFormulaIds());
    const metaIds = new Set(FORMULA_REGISTRY_META.map((item) => item.formulaId));

    for (const key of registryKeys) {
      expect(metaIds.has(key)).toBe(true);
    }
    for (const id of metaIds) {
      expect(registryKeys.has(id)).toBe(true);
    }
    expect(FORMULA_REGISTRY_META.length).toBe(registryKeys.size);
  });

  test("draftToPremiumSchema does not produce expression fields", () => {
    const draft = buildMinimalValidDraft();
    const schema = draftToPremiumSchema(draft);
    const json = JSON.stringify(schema);
    expect(json).not.toMatch(/"expression"/);
    expect(json).not.toMatch(/"formulaString"/);
    expect(draftContainsExpressionKeys(draft)).toBe(false);
  });

  test("JSON export has no expression keys", () => {
    const draft = buildMinimalValidDraft();
    const json = draftToJson(draft);
    expect(json).not.toMatch(/"expression"/);
    expect(json).not.toMatch(/"eval"/);
  });

  test("TypeScript export is generated for valid draft", () => {
    const draft = buildMinimalValidDraft();
    const ts = draftToTypeScriptExport(draft);
    expect(ts).toContain("PremiumCalculatorSchema");
    expect(ts).toContain("TestAnalyzer_SCHEMA");
    expect(ts).not.toMatch(/eval\s*\(/);
    expect(ts).not.toMatch(/new Function/);
  });

  test("formula registry functions have no eval or new Function", () => {
    for (const id of listRegisteredFormulaIds()) {
      const fn = FORMULA_REGISTRY[id];
      expect(fn.toString()).not.toMatch(/eval\s*\(/);
      expect(fn.toString()).not.toMatch(/new Function/);
    }
  });
});
