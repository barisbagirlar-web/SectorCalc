/**
 * Unit families and conversion system matching the original HTML spec.
 */

export type UnitFamilyData = {
  base: string;
  order: string[];
  u: Record<string, { f?: number; n: string; to?: (v: number) => number; from?: (v: number) => number }>;
};

export const FAM: Record<string, UnitFamilyData> = {
  length: {
    base: "cm",
    order: ["mm", "cm", "m", "in", "ft"],
    u: {
      mm: { f: 0.1, n: "millimetre" },
      cm: { f: 1, n: "centimetre" },
      m: { f: 100, n: "metre" },
      in: { f: 2.54, n: "inch" },
      ft: { f: 30.48, n: "foot" },
    },
  },
  mass: {
    base: "kg",
    order: ["g", "kg", "lb", "oz"],
    u: {
      g: { f: 0.001, n: "gram" },
      kg: { f: 1, n: "kilogram" },
      lb: { f: 0.45359237, n: "pound" },
      oz: { f: 0.0283495, n: "ounce" },
    },
  },
  temperature: {
    base: "C",
    order: ["C", "F", "K"],
    u: {
      C: { n: "Celsius" },
      F: { n: "Fahrenheit", to: (v: number) => (v - 32) * 5 / 9, from: (v: number) => v * 9 / 5 + 32 },
      K: { n: "Kelvin", to: (v: number) => v - 273.15, from: (v: number) => v + 273.15 },
    },
  },
  distance: {
    base: "km",
    order: ["m", "km", "mi", "nmi"],
    u: {
      m: { f: 0.001, n: "metre" },
      km: { f: 1, n: "kilometre" },
      mi: { f: 1.609344, n: "mile" },
      nmi: { f: 1.852, n: "nautical mile" },
    },
  },
};

function toBase(fam: string, u: string, v: number): number {
  const d = FAM[fam].u[u];
  if (d.to) return d.to(v);
  return v * (d.f == null ? 1 : d.f);
}

function fromBase(fam: string, u: string, v: number): number {
  const d = FAM[fam].u[u];
  if (d.from) return d.from(v);
  return v / (d.f == null ? 1 : d.f);
}

export function convert(fam: string, from: string, to: string, v: number): number {
  return fromBase(fam, to, toBase(fam, from, v));
}

/** Map of unit symbols → [family, declaredUnit] */
export const UNIT_MAP: Record<string, [string, string]> = {
  mm: ["length", "mm"],
  cm: ["length", "cm"],
  m: ["length", "m"],
  in: ["length", "in"],
  ft: ["length", "ft"],
  km: ["distance", "km"],
  mi: ["distance", "mi"],
  kg: ["mass", "kg"],
  g: ["mass", "g"],
  lb: ["mass", "lb"],
  c: ["temperature", "C"],
  "°c": ["temperature", "C"],
};
