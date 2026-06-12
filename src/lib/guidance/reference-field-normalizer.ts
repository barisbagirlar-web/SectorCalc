const KEY_ALIASES: Readonly<Record<string, string>> = {
  length: "length",
  uzunluk: "length",
  width: "width",
  genislik: "width",
  genişlik: "width",
  height: "height",
  yukseklik: "height",
  yükseklik: "height",
  depth: "depth",
  derinlik: "depth",
  thickness: "thickness",
  kalinlik: "thickness",
  kalınlık: "thickness",
  diameter: "diameter",
  cap: "diameter",
  çap: "diameter",
  radius: "radius",
  yaricap: "radius",
  yarıçap: "radius",
  insideradius: "insideRadius",
  "ic yaricap": "insideRadius",
  "iç yarıçap": "insideRadius",
  angle: "angle",
  aci: "angle",
  açı: "angle",
  area: "area",
  alan: "area",
  volume: "volume",
  hacim: "volume",
  weight: "weight",
  agirlik: "weight",
  ağırlık: "weight",
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
  güç: "power",
  pressure: "pressure",
  basinç: "pressure",
  basinc: "pressure",
  flow: "flow",
  debi: "flow",
  distance: "distance",
  mesafe: "distance",
  time: "time",
  sure: "time",
  süre: "time",
  setup: "setup",
  hazirlik: "setup",
  hazırlık: "setup",
  steps: "steps",
  basamak: "steps",
  rise: "rise",
  riht: "rise",
  rıht: "rise",
  run: "run",
  fuel: "fuel",
  yakıt: "fuel",
  yakit: "fuel",
  revenue: "revenue",
  profit: "profit",
  kar: "profit",
  kâr: "profit",
  tax: "tax",
  kdv: "tax",
  payment: "payment",
  odeme: "payment",
  ödeme: "payment",
  quantity: "quantity",
  miktar: "quantity",
  cycletime: "cycleTime",
  "cycle time": "cycleTime",
  setuptime: "setupTime",
  downtime: "downtime",
  availability: "availability",
  stops: "stops",
  routecost: "routeCost",
  runtime: "runtime",
  carbon: "carbon",
  bendangle: "bendAngle",
  materialthickness: "materialThickness",
  neutralaxis: "neutralAxis",
};

const LABEL_PATTERNS: ReadonlyArray<{ pattern: RegExp; canonical: string }> = [
  { pattern: /\b(length|uzunluk)\b/i, canonical: "length" },
  { pattern: /\b(width|genişlik|genislik)\b/i, canonical: "width" },
  { pattern: /\b(height|yükseklik|yukseklik)\b/i, canonical: "height" },
  { pattern: /\b(depth|derinlik)\b/i, canonical: "depth" },
  { pattern: /\b(thickness|kalınlık|kalinlik)\b/i, canonical: "thickness" },
  { pattern: /\b(diameter|çap|cap)\b/i, canonical: "diameter" },
  { pattern: /\b(radius|yarıçap|yaricap)\b/i, canonical: "radius" },
  { pattern: /\b(inside\s*radius|iç\s*yarıçap)\b/i, canonical: "insideRadius" },
  { pattern: /\b(angle|açı|aci)\b/i, canonical: "angle" },
  { pattern: /\b(area|alan|metrekare|m²|m2)\b/i, canonical: "area" },
  { pattern: /\b(volume|hacim|kapasite)\b/i, canonical: "volume" },
  { pattern: /\b(cost|maliyet)\b/i, canonical: "cost" },
  { pattern: /\b(price|fiyat)\b/i, canonical: "price" },
  { pattern: /\b(margin|marj)\b/i, canonical: "margin" },
  { pattern: /\b(energy|enerji|kwh)\b/i, canonical: "energy" },
  { pattern: /\b(power|güç|guc|kw)\b/i, canonical: "power" },
  { pattern: /\b(pressure|basınç|basinc)\b/i, canonical: "pressure" },
  { pattern: /\b(flow|debi)\b/i, canonical: "flow" },
  { pattern: /\b(distance|mesafe)\b/i, canonical: "distance" },
  { pattern: /\b(fuel|yakıt|yakit)\b/i, canonical: "fuel" },
  { pattern: /\b(time|süre|sure|zaman)\b/i, canonical: "time" },
  { pattern: /\b(setup|hazırlık|hazirlik)\b/i, canonical: "setup" },
  { pattern: /\b(steps|basamak)\b/i, canonical: "steps" },
  { pattern: /\b(rise|rıht|riht)\b/i, canonical: "rise" },
  { pattern: /\b(run|basamak\s*genişliği)\b/i, canonical: "run" },
  { pattern: /\b(revenue|gelir)\b/i, canonical: "revenue" },
  { pattern: /\b(profit|kâr|kar)\b/i, canonical: "profit" },
  { pattern: /\b(tax|kdv|vergi)\b/i, canonical: "tax" },
  { pattern: /\b(payment|ödeme|odeme)\b/i, canonical: "payment" },
  { pattern: /\b(quantity|miktar|adet)\b/i, canonical: "quantity" },
  { pattern: /\b(cycle\s*time|çevrim)\b/i, canonical: "cycleTime" },
  { pattern: /\b(downtime|arıza)\b/i, canonical: "downtime" },
  { pattern: /\b(availability|kullanılabilirlik)\b/i, canonical: "availability" },
  { pattern: /\b(carbon|karbon)\b/i, canonical: "carbon" },
  { pattern: /\b(bend|büküm|k-factor)\b/i, canonical: "bendAngle" },
];

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s-]+/g, "");
}

export function normalizeFieldKey(key: string, label?: string): string | null {
  const normalizedKey = normalizeToken(key);
  if (KEY_ALIASES[normalizedKey]) {
    return KEY_ALIASES[normalizedKey];
  }

  const camelKey = key.replace(/[_-](\w)/g, (_, c: string) => c.toUpperCase());
  const camelNorm = normalizeToken(camelKey);
  if (KEY_ALIASES[camelNorm]) {
    return KEY_ALIASES[camelNorm];
  }

  if (label) {
    for (const { pattern, canonical } of LABEL_PATTERNS) {
      if (pattern.test(label)) {
        return canonical;
      }
    }
    for (const { pattern, canonical } of LABEL_PATTERNS) {
      if (pattern.test(key)) {
        return canonical;
      }
    }
  }

  return null;
}

export function buildNormalizedFieldSet(
  fields: ReadonlyArray<{ key: string; label?: string; unitGroup?: string; type?: string }>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const field of fields) {
    const canonical = normalizeFieldKey(field.key, field.label);
    if (canonical) {
      map.set(field.key, canonical);
    }
  }
  return map;
}

export function collectCanonicalIds(normalized: Map<string, string>): Set<string> {
  return new Set(normalized.values());
}
