export type NormalizedReferenceField =
  | "length"
  | "width"
  | "height"
  | "depth"
  | "area"
  | "volume"
  | "diameter"
  | "radius"
  | "insideRadius"
  | "materialThickness"
  | "bendAngle"
  | "neutralAxis"
  | "steps"
  | "riserRise"
  | "treadRun"
  | "stairThickness"
  | "pressure"
  | "flow"
  | "leakDiameter"
  | "runtime"
  | "power"
  | "energy"
  | "cost"
  | "price"
  | "margin"
  | "tax"
  | "labor"
  | "setupTime"
  | "cycleTime"
  | "quantity"
  | "downtime"
  | "weight"
  | "density"
  | "thickness"
  | "angle"
  | "distance"
  | "fuel"
  | "currency"
  | "unknown";

const FIELD_ALIASES: Readonly<Record<string, NormalizedReferenceField>> = {
  length: "length",
  width: "width",
  height: "height",
  depth: "depth",
  area: "area",
  "m2": "area",
  volume: "volume",
  "m3": "volume",
  diameter: "diameter",
  radius: "radius",
  insideradius: "insideRadius",
  "inside radius": "insideRadius",
  materialthickness: "materialThickness",
  thickness: "materialThickness",
  "material thickness": "materialThickness",
  bendangle: "bendAngle",
  angle: "bendAngle",
  "bend angle": "bendAngle",
  neutralaxis: "neutralAxis",
  steps: "steps",
  "number of steps": "steps",
  riserrise: "riserRise",
  rise: "riserRise",
  treadrun: "treadRun",
  run: "treadRun",
  tread: "treadRun",
  stairthickness: "stairThickness",
  pressure: "pressure",
  flow: "flow",
  leakdiameter: "leakDiameter",
  "hole diameter": "leakDiameter",
  runtime: "runtime",
  setuptime: "setupTime",
  setup: "setupTime",
  "setup time": "setupTime",
  cycletime: "cycleTime",
  cycle: "cycleTime",
  "cycle time": "cycleTime",
  quantity: "quantity",
  cost: "cost",
  price: "price",
  margin: "margin",
  energy: "energy",
  power: "power",
  distance: "distance",
  fuel: "fuel",
  tax: "tax",
  labor: "labor",
  labour: "labor",
  downtime: "downtime",
  weight: "weight",
  density: "density",
  currency: "currency",
  revenue: "price",
  profit: "margin",
  payment: "cost",
  availability: "runtime",
  stops: "distance",
  routecost: "cost",
  carbon: "energy",
};

const LABEL_PATTERNS: ReadonlyArray<{ pattern: RegExp; canonical: NormalizedReferenceField }> = [
  { pattern: /\b(length)\b/i, canonical: "length" },
  { pattern: /\b(width)\b/i, canonical: "width" },
  { pattern: /\b(height)\b/i, canonical: "height" },
  { pattern: /\b(depth)\b/i, canonical: "depth" },
  { pattern: /\b(area|m²|m2)\b/i, canonical: "area" },
  { pattern: /\b(volume|m³|m3)\b/i, canonical: "volume" },
  { pattern: /\b(diameter)\b/i, canonical: "diameter" },
  { pattern: /\b(inside\s*radius)\b/i, canonical: "insideRadius" },
  { pattern: /\b(radius)\b/i, canonical: "radius" },
  { pattern: /\b(material\s*thickness|thickness)\b/i, canonical: "materialThickness" },
  { pattern: /\b(bend\s*angle|k-factor)\b/i, canonical: "bendAngle" },
  { pattern: /\b(neutral\s*axis)\b/i, canonical: "neutralAxis" },
  { pattern: /\b(steps)\b/i, canonical: "steps" },
  { pattern: /\b(riser|rise)\b/i, canonical: "riserRise" },
  { pattern: /\b(tread|run)\b/i, canonical: "treadRun" },
  { pattern: /\b(leak)\b.*\b(diameter)\b/i, canonical: "leakDiameter" },
  { pattern: /\b(pressure)\b/i, canonical: "pressure" },
  { pattern: /\b(flow)\b/i, canonical: "flow" },
  { pattern: /\b(setup)\b/i, canonical: "setupTime" },
  { pattern: /\b(cycle\s*time)\b/i, canonical: "cycleTime" },
  { pattern: /\b(quantity)\b/i, canonical: "quantity" },
  { pattern: /\b(cost)\b/i, canonical: "cost" },
  { pattern: /\b(price)\b/i, canonical: "price" },
  { pattern: /\b(margin)\b/i, canonical: "margin" },
  { pattern: /\b(energy|kwh)\b/i, canonical: "energy" },
  { pattern: /\b(power|kw)\b/i, canonical: "power" },
  { pattern: /\b(distance)\b/i, canonical: "distance" },
  { pattern: /\b(fuel)\b/i, canonical: "fuel" },
  { pattern: /\b(runtime)\b/i, canonical: "runtime" },
  { pattern: /\b(tax)\b/i, canonical: "tax" },
  { pattern: /\b(labor|labour)\b/i, canonical: "labor" },
  { pattern: /\b(downtime)\b/i, canonical: "downtime" },
];

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s-]+/g, " ")
    .trim();
}

export function normalizeReferenceField(key: string, label?: string): NormalizedReferenceField {
  const normalizedKey = normalizeToken(key).replace(/\s+/g, "");
  if (FIELD_ALIASES[normalizedKey]) {
    return FIELD_ALIASES[normalizedKey];
  }

  const camelKey = key.replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase());
  const camelNorm = normalizeToken(camelKey).replace(/\s+/g, "");
  if (FIELD_ALIASES[camelNorm]) {
    return FIELD_ALIASES[camelNorm];
  }

  const haystack = `${key} ${label ?? ""}`;
  for (const { pattern, canonical } of LABEL_PATTERNS) {
    if (pattern.test(haystack)) {
      return canonical;
    }
  }

  return "unknown";
}

/** @deprecated Use normalizeReferenceField */
export function normalizeFieldKey(key: string, label?: string): string | null {
  const normalized = normalizeReferenceField(key, label);
  return normalized === "unknown" ? null : normalized;
}

export function buildNormalizedFieldSet(
  fields: ReadonlyArray<{ key: string; label?: string; unitGroup?: string; type?: string }>,
): Map<string, NormalizedReferenceField> {
  const map = new Map<string, NormalizedReferenceField>();
  for (const field of fields) {
    const canonical = normalizeReferenceField(field.key, field.label);
    if (canonical !== "unknown") {
      map.set(field.key, canonical);
    }
  }
  return map;
}

export function collectCanonicalIds(
  normalized: Map<string, NormalizedReferenceField>,
): Set<NormalizedReferenceField> {
  return new Set(normalized.values());
}
