/**
 * SectorCalc — Engine-Boundary Unit Normalizer
 * Formulas NOW expect base units. Convert raw UI values BEFORE entering the formula.
 * Wire: call inside externalCompute BEFORE runPremiumSchemaEngine.
 *
 * Base units: length=m, mass=kg, volume=m^3, density=kg/m^3, time=h, ratio=fraction.
 */
export type UnitDef = { dim: string; toBase?: number; transform?: (v: number) => number };

export const UNIT_TABLE: Record<string, UnitDef> = {
  // length -> m
  mm: { dim: "length", toBase: 1e-3 }, cm: { dim: "length", toBase: 1e-2 },
  m: { dim: "length", toBase: 1 }, "in": { dim: "length", toBase: 0.0254 },
  // mass -> kg
  g: { dim: "mass", toBase: 1e-3 }, kg: { dim: "mass", toBase: 1 },
  // volume -> m^3
  mm3: { dim: "volume", toBase: 1e-9 }, cm3: { dim: "volume", toBase: 1e-6 }, m3: { dim: "volume", toBase: 1 },
  // density -> kg/m^3   (1 g/cm3 = 1000 kg/m3)
  "kg/m3": { dim: "density", toBase: 1 }, "g/cm3": { dim: "density", toBase: 1000 },
  // pressure / stress -> Pa
  MPa: { dim: "pressure", toBase: 1e6 },
  // time -> h
  s: { dim: "time", toBase: 1 / 3600 }, min: { dim: "time", toBase: 1 / 60 }, h: { dim: "time", toBase: 1 },
  // ratio -> fraction  (CRITICAL: percent bug fix)
  percent: { dim: "ratio", transform: (v) => v / 100 },
  fraction: { dim: "ratio", toBase: 1 },
  // passthrough
  currency: { dim: "currency", toBase: 1 }, unitless: { dim: "scalar", toBase: 1 },
};

export interface NormInput { id: string; unit?: string }

export function normalizeInputs(
  inputs: readonly NormInput[],
  raw: Record<string, number>
): { values: Record<string, number>; warnings: string[] } {
  const out: Record<string, number> = { ...raw };
  const warnings: string[] = [];
  for (const inp of inputs) {
    const v = raw[inp.id];
    if (typeof v !== "number" || Number.isNaN(v)) continue;
    const u = inp.unit;
    if (!u || u === "currency" || u === "unitless") continue; // no conversion
    const def = UNIT_TABLE[u];
    if (!def) { warnings.push(`[UNKNOWN UNIT] '${u}' on '${inp.id}' — left raw (POTENTIAL BUG)`); continue; }
    out[inp.id] = def.transform ? def.transform(v) : v * (def.toBase ?? 1);
  }
  return { values: out, warnings };
}
