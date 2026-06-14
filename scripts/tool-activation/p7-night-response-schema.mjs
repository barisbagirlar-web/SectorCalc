/** P7 Chief Engineer — response shape validation + reject gate. */

export const P7_REQUIRED_TOP_LEVEL_FIELDS = [
  "slug",
  "status",
  "riskClass",
  "overallDecision",
  "canGenerateCalculator",
  "cannotAutoFix",
  "safeExportBaseName",
  "formulaMethod",
  "inputs",
  "outputs",
  "validationRules",
  "oracleCases",
  "assumptionsEn",
  "assumptionsTr",
  "limitationsEn",
  "limitationsTr",
  "notIncludedEn",
  "notIncludedTr",
  "recommendedActionsEn",
  "recommendedActionsTr",
  "findings",
];

export const P7_REQUIRED_FORMULA_METHOD_FIELDS = [
  "methodName",
  "methodBasis",
  "references",
  "formulaSteps",
  "unitBalanceNotes",
  "divisionByZeroGuards",
  "finiteOutputGuards",
];

export const GENERIC_INPUT_KEYS = new Set([
  "value",
  "amount",
  "cost",
  "rate",
  "number",
  "factor",
  "parameter",
  "field",
  "data",
  "input1",
  "input2",
]);

export const ALLOWED_RISK_CLASSES = new Set(["LOW_GENERAL_CALC", "MEDIUM_BUSINESS_CALC"]);

const TURKISH_CHARS_RE = /[ğüşıöçĞÜŞİÖÇ]/;
const NUMERIC_INPUT_TYPES = new Set(["number", "integer", "percent", "currency"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function hasMixedLanguageLabel(input) {
  if (!input || typeof input !== "object") return false;
  const labelEn = typeof input.labelEn === "string" ? input.labelEn : "";
  const labelTr = typeof input.labelTr === "string" ? input.labelTr : "";
  if (TURKISH_CHARS_RE.test(labelEn)) return true;
  if (labelTr && !TURKISH_CHARS_RE.test(labelTr) && labelEn !== labelTr) {
    const enWords = labelEn.toLowerCase().split(/\s+/);
    const trWords = labelTr.toLowerCase().split(/\s+/);
    if (enWords.join(" ") === trWords.join(" ")) return true;
  }
  return false;
}

function inputMissingUnit(input) {
  if (!input || typeof input !== "object") return true;
  const type = typeof input.type === "string" ? input.type : "";
  if (!NUMERIC_INPUT_TYPES.has(type)) return false;
  return !isNonEmptyString(input.unit);
}

function inputMissingValidationBoundary(input) {
  if (!input || typeof input !== "object") return true;
  const hasMinMax =
    typeof input.min === "number" || typeof input.max === "number";
  const hasBusinessRule = isNonEmptyString(input.businessRule);
  const hasValidationRule =
    isNonEmptyArray(input.validationRules) ||
    (typeof input.validationRule === "string" && input.validationRule.trim().length > 0);
  return !hasMinMax && !hasBusinessRule && !hasValidationRule;
}

function outputExpectsFinite(output) {
  if (!output || typeof output !== "object") return false;
  if (output.finite === false) return false;
  if (typeof output.expectedFinite === "boolean" && !output.expectedFinite) return false;
  if (typeof output.value === "number" && !Number.isFinite(output.value)) return false;
  return true;
}

function hasCriticalOrMajorFinding(findings) {
  if (!Array.isArray(findings)) return false;
  return findings.some((finding) => {
    if (!finding || typeof finding !== "object") return false;
    const severity = typeof finding.severity === "string" ? finding.severity.toLowerCase() : "";
    return severity === "critical" || severity === "major";
  });
}

export function validateP7ResponseShape(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "invalid_json", message: "Response must be an object." };
  }

  for (const field of P7_REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in parsed)) {
      return { ok: false, reason: "missing_field", message: `Missing required field: ${field}` };
    }
  }

  const formulaMethod = parsed.formulaMethod;
  if (!formulaMethod || typeof formulaMethod !== "object") {
    return { ok: false, reason: "missing_field", message: "formulaMethod must be an object." };
  }

  for (const field of P7_REQUIRED_FORMULA_METHOD_FIELDS) {
    if (!(field in formulaMethod)) {
      return {
        ok: false,
        reason: "missing_field",
        message: `Missing formulaMethod field: ${field}`,
      };
    }
  }

  if (!Array.isArray(parsed.inputs)) {
    return { ok: false, reason: "invalid_shape", message: "inputs must be an array." };
  }
  if (!Array.isArray(parsed.outputs)) {
    return { ok: false, reason: "invalid_shape", message: "outputs must be an array." };
  }

  return { ok: true, data: parsed };
}

export function rejectP7Response(response) {
  const shape = validateP7ResponseShape(response);
  if (!shape.ok) {
    return { rejected: true, reasons: [shape.message] };
  }

  const reasons = [];
  const parsed = shape.data;

  if (parsed.status !== "PASS") reasons.push("status !== PASS");
  if (parsed.overallDecision !== "APPROVED") reasons.push("overallDecision !== APPROVED");
  if (parsed.canGenerateCalculator !== true) reasons.push("canGenerateCalculator !== true");
  if (!ALLOWED_RISK_CLASSES.has(parsed.riskClass)) {
    reasons.push(`riskClass not allowed: ${parsed.riskClass}`);
  }
  if (!Array.isArray(parsed.inputs) || parsed.inputs.length < 3) {
    reasons.push("inputs.length < 3");
  }
  if (!Array.isArray(parsed.outputs) || parsed.outputs.length < 2) {
    reasons.push("outputs.length < 2");
  }

  const fm = parsed.formulaMethod;
  if (!Array.isArray(fm.references) || fm.references.length < 1) {
    reasons.push("formulaMethod.references.length < 1");
  }
  if (!Array.isArray(fm.formulaSteps) || fm.formulaSteps.length < 4) {
    reasons.push("formulaMethod.formulaSteps.length < 4");
  }
  if (!Array.isArray(parsed.oracleCases) || parsed.oracleCases.length < 3) {
    reasons.push("oracleCases.length < 3");
  }
  if (!Array.isArray(parsed.assumptionsEn) || parsed.assumptionsEn.length < 3) {
    reasons.push("assumptionsEn.length < 3");
  }
  if (!Array.isArray(parsed.assumptionsTr) || parsed.assumptionsTr.length < 3) {
    reasons.push("assumptionsTr.length < 3");
  }
  if (!Array.isArray(parsed.limitationsEn) || parsed.limitationsEn.length < 1) {
    reasons.push("limitationsEn.length < 1");
  }
  if (!Array.isArray(parsed.limitationsTr) || parsed.limitationsTr.length < 1) {
    reasons.push("limitationsTr.length < 1");
  }
  if (!Array.isArray(parsed.recommendedActionsEn) || parsed.recommendedActionsEn.length < 1) {
    reasons.push("recommendedActionsEn.length < 1");
  }
  if (!Array.isArray(parsed.recommendedActionsTr) || parsed.recommendedActionsTr.length < 1) {
    reasons.push("recommendedActionsTr.length < 1");
  }

  if (isNonEmptyString(parsed.safeExportBaseName) && /^\d/.test(parsed.safeExportBaseName)) {
    reasons.push("safeExportBaseName starts with digit");
  }

  for (const input of parsed.inputs) {
    const key = typeof input?.key === "string" ? input.key.toLowerCase() : "";
    if (GENERIC_INPUT_KEYS.has(key)) {
      reasons.push(`generic input key: ${key}`);
    }
    if (hasMixedLanguageLabel(input)) {
      reasons.push(`mixed language label on input: ${key || "unknown"}`);
    }
    if (inputMissingUnit(input)) {
      reasons.push(`input unit missing: ${key || "unknown"}`);
    }
    if (inputMissingValidationBoundary(input)) {
      reasons.push(`validation boundary missing: ${key || "unknown"}`);
    }
  }

  for (const output of parsed.outputs) {
    if (!outputExpectsFinite(output)) {
      const id = typeof output?.id === "string" ? output.id : "unknown";
      reasons.push(`expected output not finite: ${id}`);
    }
  }

  if (hasCriticalOrMajorFinding(parsed.findings)) {
    reasons.push("findings contain critical or major severity");
  }

  return { rejected: reasons.length > 0, reasons };
}

export function getP7ResponseJsonSchemaHint() {
  return {
    type: "object",
    required: P7_REQUIRED_TOP_LEVEL_FIELDS,
    properties: {
      slug: { type: "string" },
      status: { type: "string", enum: ["PASS", "FAIL", "NEEDS_REVIEW"] },
      riskClass: { type: "string" },
      overallDecision: { type: "string", enum: ["APPROVED", "REJECTED", "NEEDS_REVIEW"] },
      canGenerateCalculator: { type: "boolean" },
      cannotAutoFix: { type: "boolean" },
      safeExportBaseName: { type: "string" },
      formulaMethod: {
        type: "object",
        required: P7_REQUIRED_FORMULA_METHOD_FIELDS,
      },
      inputs: { type: "array", minItems: 3 },
      outputs: { type: "array", minItems: 2 },
      validationRules: { type: "array" },
      oracleCases: { type: "array", minItems: 3 },
      assumptionsEn: { type: "array", minItems: 3 },
      assumptionsTr: { type: "array", minItems: 3 },
      limitationsEn: { type: "array", minItems: 1 },
      limitationsTr: { type: "array", minItems: 1 },
      notIncludedEn: { type: "array" },
      notIncludedTr: { type: "array" },
      recommendedActionsEn: { type: "array", minItems: 1 },
      recommendedActionsTr: { type: "array", minItems: 1 },
      findings: { type: "array" },
    },
  };
}

export function getP7PassingResponseExample(slug = "example-tool") {
  const example = buildPassingMockResponse();
  return {
    ...example,
    slug,
    safeExportBaseName: slug,
  };
}

export function normalizeP7Response(raw, expectedSlug) {
  let parsed = raw;
  if (!parsed || typeof parsed !== "object") {
    return parsed;
  }

  for (const wrapperKey of ["response", "result", "tool", "data", "calculator", "audit"]) {
    const wrapped = parsed[wrapperKey];
    if (wrapped && typeof wrapped === "object" && !Array.isArray(wrapped)) {
      const hasCore =
        "status" in wrapped ||
        "formulaMethod" in wrapped ||
        "formula_method" in wrapped ||
        "inputs" in wrapped;
      if (hasCore) {
        parsed = { ...parsed, ...wrapped };
      }
    }
  }

  if (!parsed.formulaMethod && parsed.formula_method) {
    parsed.formulaMethod = parsed.formula_method;
  }

  if (typeof parsed.formulaMethod === "string") {
    try {
      parsed.formulaMethod = JSON.parse(parsed.formulaMethod);
    } catch {
      // keep as-is; shape validation will fail clearly
    }
  }

  if (expectedSlug && !parsed.slug) {
    parsed.slug = expectedSlug;
  }

  if (expectedSlug && !parsed.safeExportBaseName) {
    parsed.safeExportBaseName = expectedSlug;
  }

  return parsed;
}

function buildPassingMockResponse() {
  return {
    slug: "mock-tool",
    status: "PASS",
    riskClass: "LOW_GENERAL_CALC",
    overallDecision: "APPROVED",
    canGenerateCalculator: true,
    cannotAutoFix: false,
    safeExportBaseName: "mock-tool",
    formulaMethod: {
      methodName: "Standard cost exposure model",
      methodBasis: "Industrial engineering cost accounting",
      references: ["ISO 9001 quality cost framework"],
      formulaSteps: [
        "Compute base material cost per unit",
        "Apply scrap and yield adjustment",
        "Add labor and overhead burden",
        "Compute margin exposure band",
      ],
      unitBalanceNotes: "Currency inputs normalized to base currency",
      divisionByZeroGuards: "Reject zero production quantity",
      finiteOutputGuards: "Clamp outputs to finite numeric range",
    },
    inputs: [
      {
        key: "productionQuantity",
        labelEn: "Production quantity",
        labelTr: "Üretim miktarı",
        type: "number",
        unit: "units",
        min: 1,
        max: 1000000,
        defaultValue: 100,
        required: true,
        businessRule: "Must be positive integer",
        errorMessageEn: "Quantity must be positive",
        errorMessageTr: "Miktar pozitif olmalı",
      },
      {
        key: "unitMaterialCost",
        labelEn: "Unit material cost",
        labelTr: "Birim malzeme maliyeti",
        type: "currency",
        unit: "USD",
        min: 0,
        max: 100000,
        defaultValue: 10,
        required: true,
        businessRule: "Non-negative currency",
        errorMessageEn: "Cost cannot be negative",
        errorMessageTr: "Maliyet negatif olamaz",
      },
      {
        key: "scrapRatePercent",
        labelEn: "Scrap rate",
        labelTr: "Fire oranı",
        type: "percent",
        unit: "%",
        min: 0,
        max: 100,
        defaultValue: 5,
        required: true,
        businessRule: "Percent between 0 and 100",
        errorMessageEn: "Scrap rate out of range",
        errorMessageTr: "Fire oranı aralık dışı",
      },
    ],
    outputs: [
      {
        id: "totalExposure",
        labelEn: "Total cost exposure",
        labelTr: "Toplam maliyet maruziyeti",
        unit: "USD",
        expectedFinite: true,
        finite: true,
      },
      {
        id: "marginRiskBand",
        labelEn: "Margin risk band",
        labelTr: "Marj risk bandı",
        unit: "%",
        expectedFinite: true,
        finite: true,
      },
    ],
    validationRules: ["Reject negative costs", "Reject zero quantity"],
    oracleCases: [
      { name: "baseline", band: "low" },
      { name: "warning_threshold", band: "warning" },
      { name: "critical_threshold", band: "critical" },
    ],
    assumptionsEn: ["Stable unit costs", "Declared scrap rate is representative", "No FX volatility"],
    assumptionsTr: ["Birim maliyetler stabil", "Beyan fire oranı temsilidir", "Kur dalgalanması yok"],
    limitationsEn: ["Does not replace certified cost audit"],
    limitationsTr: ["Sertifikalı maliyet denetiminin yerini tutmaz"],
    notIncludedEn: ["Tax and regulatory fees"],
    notIncludedTr: ["Vergi ve düzenleyici ücretler"],
    recommendedActionsEn: ["Review scrap drivers if band is critical"],
    recommendedActionsTr: ["Band kritikse fire nedenlerini inceleyin"],
    findings: [{ severity: "info", message: "Mock passing response" }],
  };
}

export function runRejectGateSelfTests() {
  const results = [];

  const passing = buildPassingMockResponse();
  const passGate = rejectP7Response(passing);
  results.push({
    name: "passing_response_accepted",
    pass: !passGate.rejected,
    reasons: passGate.reasons,
  });

  const failStatus = { ...passing, status: "FAIL" };
  const failGate = rejectP7Response(failStatus);
  results.push({
    name: "fail_status_rejected",
    pass: failGate.rejected && failGate.reasons.includes("status !== PASS"),
    reasons: failGate.reasons,
  });

  const genericInput = {
    ...passing,
    inputs: [
      { ...passing.inputs[0], key: "value" },
      passing.inputs[1],
      passing.inputs[2],
    ],
  };
  const genericGate = rejectP7Response(genericInput);
  results.push({
    name: "generic_input_rejected",
    pass: genericGate.rejected,
    reasons: genericGate.reasons,
  });

  const criticalFinding = {
    ...passing,
    findings: [{ severity: "critical", message: "Oracle mismatch" }],
  };
  const criticalGate = rejectP7Response(criticalFinding);
  results.push({
    name: "critical_finding_rejected",
    pass: criticalGate.rejected,
    reasons: criticalGate.reasons,
  });

  const allPass = results.every((r) => r.pass);
  return { allPass, results };
}
