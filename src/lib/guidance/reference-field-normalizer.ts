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
  uzunluk: "length",
  boy: "length",
  width: "width",
  genislik: "width",
  "genişlik": "width",
  en: "width",
  height: "height",
  yukseklik: "height",
  "yükseklik": "height",
  depth: "depth",
  derinlik: "depth",
  area: "area",
  alan: "area",
  metrekare: "area",
  "m2": "area",
  volume: "volume",
  hacim: "volume",
  metrekup: "volume",
  "m3": "volume",
  diameter: "diameter",
  cap: "diameter",
  "çap": "diameter",
  radius: "radius",
  yaricap: "radius",
  "yarıçap": "radius",
  insideradius: "insideRadius",
  "inside radius": "insideRadius",
  "ic yaricap": "insideRadius",
  "iç yarıçap": "insideRadius",
  materialthickness: "materialThickness",
  thickness: "materialThickness",
  kalinlik: "materialThickness",
  "kalınlık": "materialThickness",
  "material thickness": "materialThickness",
  bendangle: "bendAngle",
  angle: "bendAngle",
  aci: "bendAngle",
  "açı": "bendAngle",
  "bend angle": "bendAngle",
  neutralaxis: "neutralAxis",
  steps: "steps",
  basamak: "steps",
  "number of steps": "steps",
  riserrise: "riserRise",
  rise: "riserRise",
  riht: "riserRise",
  "rıht": "riserRise",
  treadrun: "treadRun",
  run: "treadRun",
  tread: "treadRun",
  stairthickness: "stairThickness",
  pressure: "pressure",
  "basınç": "pressure",
  basinc: "pressure",
  flow: "flow",
  debi: "flow",
  leakdiameter: "leakDiameter",
  "hole diameter": "leakDiameter",
  "delik capi": "leakDiameter",
  "delik çapı": "leakDiameter",
  runtime: "runtime",
  "calisma suresi": "runtime",
  "çalışma süresi": "runtime",
  setuptime: "setupTime",
  setup: "setupTime",
  hazirlik: "setupTime",
  "hazırlık": "setupTime",
  cycletime: "cycleTime",
  cycle: "cycleTime",
  "cycle time": "cycleTime",
  "çevrim": "cycleTime",
  cevrim: "cycleTime",
  quantity: "quantity",
  miktar: "quantity",
  adet: "quantity",
  cost: "cost",
  maliyet: "cost",
  price: "price",
  fiyat: "price",
  margin: "margin",
  marj: "margin",
  energy: "energy",
  enerji: "energy",
  power: "power",
  guc: "power",
  "güç": "power",
  distance: "distance",
  mesafe: "distance",
  fuel: "fuel",
  yakit: "fuel",
  "yakıt": "fuel",
  tax: "tax",
  kdv: "tax",
  vergi: "tax",
  labor: "labor",
  labour: "labor",
  isgucu: "labor",
  "işçilik": "labor",
  downtime: "downtime",
  weight: "weight",
  agirlik: "weight",
  "ağırlık": "weight",
  density: "density",
  yogunluk: "density",
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
  { pattern: /\b(length|uzunluk|boy)\b/i, canonical: "length" },
  { pattern: /\b(width|genişlik|genislik|en)\b/i, canonical: "width" },
  { pattern: /\b(height|yükseklik|yukseklik)\b/i, canonical: "height" },
  { pattern: /\b(depth|derinlik)\b/i, canonical: "depth" },
  { pattern: /\b(area|alan|metrekare|m²|m2)\b/i, canonical: "area" },
  { pattern: /\b(volume|hacim|metreküp|m³|m3)\b/i, canonical: "volume" },
  { pattern: /\b(diameter|çap|cap)\b/i, canonical: "diameter" },
  { pattern: /\b(inside\s*radius|iç\s*yarıçap|ic\s*yaricap)\b/i, canonical: "insideRadius" },
  { pattern: /\b(radius|yarıçap|yaricap)\b/i, canonical: "radius" },
  { pattern: /\b(material\s*thickness|kalınlık|kalinlik|thickness)\b/i, canonical: "materialThickness" },
  { pattern: /\b(bend\s*angle|büküm|k-factor)\b/i, canonical: "bendAngle" },
  { pattern: /\b(neutral\s*axis|nötr\s*eksen)\b/i, canonical: "neutralAxis" },
  { pattern: /\b(steps|basamak)\b/i, canonical: "steps" },
  { pattern: /\b(riser|rise|rıht|riht)\b/i, canonical: "riserRise" },
  { pattern: /\b(tread|run)\b/i, canonical: "treadRun" },
  { pattern: /\b(leak|delik)\b.*\b(diameter|çap)\b/i, canonical: "leakDiameter" },
  { pattern: /\b(pressure|basınç|basinc)\b/i, canonical: "pressure" },
  { pattern: /\b(flow|debi)\b/i, canonical: "flow" },
  { pattern: /\b(setup|hazırlık|hazirlik)\b/i, canonical: "setupTime" },
  { pattern: /\b(cycle\s*time|çevrim|cevrim)\b/i, canonical: "cycleTime" },
  { pattern: /\b(quantity|miktar|adet)\b/i, canonical: "quantity" },
  { pattern: /\b(cost|maliyet)\b/i, canonical: "cost" },
  { pattern: /\b(price|fiyat)\b/i, canonical: "price" },
  { pattern: /\b(margin|marj)\b/i, canonical: "margin" },
  { pattern: /\b(energy|enerji|kwh)\b/i, canonical: "energy" },
  { pattern: /\b(power|güç|guc|kw)\b/i, canonical: "power" },
  { pattern: /\b(distance|mesafe)\b/i, canonical: "distance" },
  { pattern: /\b(fuel|yakıt|yakit)\b/i, canonical: "fuel" },
  { pattern: /\b(runtime|çalışma\s*süresi|calisma\s*suresi)\b/i, canonical: "runtime" },
  { pattern: /\b(tax|kdv|vergi)\b/i, canonical: "tax" },
  { pattern: /\b(labor|labour|işçilik|iscilik)\b/i, canonical: "labor" },
  { pattern: /\b(downtime|arıza)\b/i, canonical: "downtime" },
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
