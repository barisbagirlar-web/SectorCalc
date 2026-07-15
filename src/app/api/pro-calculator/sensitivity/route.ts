// SectorCalc PRO — Sensitivity Analysis Endpoint
//
// Deliberately a NEW, isolated route rather than an addition to
// /api/pro-calculator/execute (1000+ lines, credit/paywall-critical). This endpoint:
//   - Is read-only diagnostics on inputs the user has already submitted and paid for via
//     /execute -- it does NOT deduct credits or touch entitlement state.
//   - Re-runs the SAME server-only formula module (resolveFormulaModule -- never imported
//     client-side, keeping formula logic out of the browser bundle) with each declared
//     sensitivity driver perturbed +/-10% in isolation, holding all other inputs constant.
//   - Only tools that opt in via ProReportContract.sensitivityDrivers get real output; every
//     other tool gets an empty, non-error response, so this endpoint cannot regress any tool
//     that doesn't use it.
//   - Hard-capped at 8 drivers and 100 formula re-evaluations per request to bound cost.

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";
import { resolveFormulaModule } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { getProReportContract } from "@/sectorcalc/pro-report/pro-report-contract-registry";
import { getProReportContractOverride } from "@/sectorcalc/pro-report/pro-report-contract-overrides";

export const dynamic = "force-dynamic";

const MAX_DRIVERS = 8;
const PERTURBATION = 0.10; // +/-10%, matches the reference report's "what moves the rate most" convention

interface SensitivityRequestBody {
  tool_key?: string;
  raw_inputs?: Record<string, number>;
  selected_units?: Record<string, string>;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: SensitivityRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "INVALID_JSON" }, { status: 400 });
  }

  const toolKey = body.tool_key;
  const rawInputs = body.raw_inputs ?? {};
  const selectedUnits = body.selected_units ?? {};

  if (!toolKey || typeof toolKey !== "string") {
    return NextResponse.json({ ok: false, reason: "MISSING_TOOL_KEY" }, { status: 400 });
  }

  const result = resolveApprovedToolSchema(toolKey);
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: "SCHEMA_NOT_FOUND" }, { status: 404 });
  }
  const schema = result.schema;

  const identity = assertToolSchemaIdentity({
    routeToolKey: toolKey,
    schemaToolKey: schema.tool_key,
    schemaToolId: schema.tool_id,
  });
  if (!identity.ok) {
    return NextResponse.json({ ok: false, reason: "SCHEMA_IDENTITY_MISMATCH" }, { status: 404 });
  }

  const contract = getProReportContractOverride(toolKey) ?? getProReportContract(toolKey);
  const drivers = (contract?.sensitivityDrivers ?? []).slice(0, MAX_DRIVERS);
  const targetOutput = contract?.sensitivityTargetOutput;

  // Graceful no-op: this tool hasn't opted in yet. Not an error -- the client should just
  // render the report without a sensitivity chart.
  if (drivers.length === 0 || !targetOutput) {
    return NextResponse.json({ ok: true, supported: false, drivers: [] });
  }

  const formulaModule = resolveFormulaModule(toolKey);
  if (!formulaModule?.calculate) {
    return NextResponse.json({ ok: true, supported: false, drivers: [] });
  }

  const rawNumericInputs: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawInputs)) {
    if (isFiniteNumber(v)) rawNumericInputs[k] = v;
  }

  const conversionRegistry = schema.unit_conversion_contract.conversion_registry;
  const { normalized, errors } = normalizeInputs(
    rawNumericInputs,
    selectedUnits,
    schema,
    conversionRegistry,
  );
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, reason: "UNIT_NORMALIZATION_FAILED" }, { status: 400 });
  }

  // Map normalized-by-input-id values to the normalized_id keys calculate() actually expects.
  const baseFlatInputs: Record<string, number> = {};
  for (const inp of schema.inputs) {
    const nv = normalized[inp.id];
    if (nv && isFiniteNumber(nv.baseValue)) {
      baseFlatInputs[inp.normalized_id] = nv.baseValue;
    }
  }

  function targetValue(inputs: Record<string, number>): number | null {
    try {
      const r = formulaModule!.calculate(inputs);
      const v = r.outputs[targetOutput!];
      return isFiniteNumber(v) ? v : null;
    } catch {
      return null;
    }
  }

  const baseline = targetValue(baseFlatInputs);

  const results = drivers.map((driver) => {
    const base = baseFlatInputs[driver.inputId];
    if (!isFiniteNumber(base) || base === 0) {
      // Can't perturb a value we don't have or that's exactly zero (0 * 1.1 === 0) --
      // report it as present but not computable, rather than silently omitting it or
      // pretending it has zero sensitivity.
      return { inputId: driver.inputId, label: driver.label, up: null, down: null, span: null };
    }
    const up = targetValue({ ...baseFlatInputs, [driver.inputId]: base * (1 + PERTURBATION) });
    const down = targetValue({ ...baseFlatInputs, [driver.inputId]: base * (1 - PERTURBATION) });
    const span = up !== null && down !== null ? Math.abs(up - down) : null;
    return { inputId: driver.inputId, label: driver.label, up, down, span };
  });

  results.sort((a, b) => (b.span ?? -1) - (a.span ?? -1));

  return NextResponse.json({
    ok: true,
    supported: true,
    targetOutput,
    baseline,
    perturbationPct: PERTURBATION * 100,
    drivers: results,
  });
}
