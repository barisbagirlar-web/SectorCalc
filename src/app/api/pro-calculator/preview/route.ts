// SectorCalc PRO — Live Preview Endpoint
//
// Deliberately a NEW, isolated, read-only route (same pattern as
// /api/pro-calculator/sensitivity): re-runs the SAME server-only formula module against
// the user's current (unpaid, pre-submission) inputs and returns ONLY the primary output
// value + a small set of declared "rail" outputs -- never the formula code, never the full
// report, never a credit deduction. This exists so a bespoke tool page can show an
// instant "live verdict" as the person types, without exposing protected formula
// expressions to the client and without inventing a second (duplicate, driftable)
// calculation engine in the browser.
//
// Full, paid, sealed reports still go through /api/pro-calculator/execute exactly as
// they do today -- this endpoint only ever answers "what would today's inputs produce
// right now", nothing more.

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";
import { resolveFormulaModule } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";

export const dynamic = "force-dynamic";

interface PreviewRequestBody {
  tool_key?: string;
  raw_inputs?: Record<string, number>;
  selected_units?: Record<string, string>;
  /** out_* ids the caller wants back. Capped at 12; unknown ids are silently dropped. */
  rail_outputs?: string[];
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: PreviewRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "INVALID_JSON" }, { status: 400 });
  }

  const toolKey = body.tool_key;
  const rawInputs = body.raw_inputs ?? {};
  const selectedUnits = body.selected_units ?? {};
  const requestedRailOutputs = (body.rail_outputs ?? []).slice(0, 12);

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

  const formulaModule = resolveFormulaModule(toolKey);
  if (!formulaModule?.calculate) {
    return NextResponse.json({ ok: true, supported: false, outputs: {}, warnings: [] });
  }

  const rawNumericInputs: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawInputs)) {
    if (isFiniteNumber(v)) rawNumericInputs[k] = v;
  }

  // Incomplete input set (person still filling the form) -- not an error, just "no preview yet".
  const missingRequired = schema.inputs.some(
    (inp) => inp.required !== false && !isFiniteNumber(rawNumericInputs[inp.id]),
  );
  if (missingRequired) {
    return NextResponse.json({ ok: true, supported: true, complete: false, outputs: {}, warnings: [] });
  }

  const conversionRegistry = schema.unit_conversion_contract.conversion_registry;
  const { normalized, errors } = normalizeInputs(rawNumericInputs, selectedUnits, schema, conversionRegistry);
  if (errors.length > 0) {
    return NextResponse.json({ ok: true, supported: true, complete: false, outputs: {}, warnings: [] });
  }

  const flatInputs: Record<string, number> = {};
  for (const inp of schema.inputs) {
    const nv = normalized[inp.id];
    if (nv && isFiniteNumber(nv.baseValue) && inp.normalized_id) {
      flatInputs[inp.normalized_id] = nv.baseValue;
    }
  }

  let calcResult: ReturnType<typeof formulaModule.calculate>;
  try {
    calcResult = formulaModule.calculate(flatInputs);
  } catch {
    return NextResponse.json({ ok: true, supported: true, complete: false, outputs: {}, warnings: [] });
  }

  const outputs: Record<string, number> = {};
  const idsToReturn = requestedRailOutputs.length > 0 ? requestedRailOutputs : Object.keys(calcResult.outputs);
  for (const id of idsToReturn) {
    const v = calcResult.outputs[id];
    if (isFiniteNumber(v)) outputs[id] = v;
  }

  return NextResponse.json({
    ok: true,
    supported: true,
    complete: true,
    status: calcResult.status,
    outputs,
    warnings: calcResult.warnings ?? [],
  });
}
