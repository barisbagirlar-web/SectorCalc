/**
 * Unit families and conversion system matching the original HTML spec.
 * Extended with industrial, engineering, and business unit families.
 */

export type UnitFamilyData = {
  base: string;
  order: string[];
  u: Record<string, { f?: number; n: string; to?: (v: number) => number; from?: (v: number) => number }>;
};

export const FAM: Record<string, UnitFamilyData> = {
  /* ── Length ───────────────────────────────────────────── */
  length: {
    base: "cm",
    order: ["mm", "cm", "m", "in", "ft", "yd"],
    u: {
      mm: { f: 0.1, n: "millimetre" },
      cm: { f: 1, n: "centimetre" },
      m: { f: 100, n: "metre" },
      in: { f: 2.54, n: "inch" },
      ft: { f: 30.48, n: "foot" },
      yd: { f: 91.44, n: "yard" },
    },
  },
  /* ── Mass ─────────────────────────────────────────────── */
  mass: {
    base: "kg",
    order: ["g", "kg", "t", "lb", "oz"],
    u: {
      g: { f: 0.001, n: "gram" },
      kg: { f: 1, n: "kilogram" },
      t: { f: 1000, n: "tonne" },
      lb: { f: 0.45359237, n: "pound" },
      oz: { f: 0.0283495, n: "ounce" },
    },
  },
  /* ── Temperature ──────────────────────────────────────── */
  temperature: {
    base: "C",
    order: ["C", "F", "K"],
    u: {
      C: { n: "Celsius" },
      F: { n: "Fahrenheit", to: (v: number) => (v - 32) * 5 / 9, from: (v: number) => v * 9 / 5 + 32 },
      K: { n: "Kelvin", to: (v: number) => v - 273.15, from: (v: number) => v + 273.15 },
    },
  },
  /* ── Distance ─────────────────────────────────────────── */
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
  /* ── Time ─────────────────────────────────────────────── */
  time: {
    base: "s",
    order: ["ms", "s", "min", "hr", "day"],
    u: {
      ms: { f: 0.001, n: "millisecond" },
      s: { f: 1, n: "second" },
      min: { f: 60, n: "minute" },
      hr: { f: 3600, n: "hour" },
      day: { f: 86400, n: "day" },
    },
  },
  /* ── Area ─────────────────────────────────────────────── */
  area: {
    base: "m2",
    order: ["mm2", "cm2", "m2", "in2", "ft2"],
    u: {
      mm2: { f: 1e-6, n: "square millimetre" },
      cm2: { f: 0.0001, n: "square centimetre" },
      m2: { f: 1, n: "square metre" },
      in2: { f: 0.00064516, n: "square inch" },
      ft2: { f: 0.09290304, n: "square foot" },
    },
  },
  /* ── Volume ───────────────────────────────────────────── */
  volume: {
    base: "L",
    order: ["ml", "L", "m3", "gal", "ft3"],
    u: {
      ml: { f: 0.001, n: "millilitre" },
      L: { f: 1, n: "litre" },
      m3: { f: 1000, n: "cubic metre" },
      gal: { f: 3.78541178, n: "US gallon" },
      ft3: { f: 28.3168466, n: "cubic foot" },
    },
  },
  /* ── Pressure ─────────────────────────────────────────── */
  pressure: {
    base: "Pa",
    order: ["Pa", "kPa", "MPa", "bar", "psi", "atm"],
    u: {
      Pa: { f: 1, n: "pascal" },
      kPa: { f: 1000, n: "kilopascal" },
      MPa: { f: 1e6, n: "megapascal" },
      bar: { f: 1e5, n: "bar" },
      psi: { f: 6894.757, n: "pound per sq inch" },
      atm: { f: 101325, n: "atmosphere" },
    },
  },
  /* ── Force ────────────────────────────────────────────── */
  force: {
    base: "N",
    order: ["N", "kN", "lbf", "kgf"],
    u: {
      N: { f: 1, n: "newton" },
      kN: { f: 1000, n: "kilonewton" },
      lbf: { f: 4.4482216, n: "pound-force" },
      kgf: { f: 9.80665, n: "kilogram-force" },
    },
  },
  /* ── Energy ───────────────────────────────────────────── */
  energy: {
    base: "J",
    order: ["J", "kJ", "MJ", "kWh", "Wh", "BTU", "cal"],
    u: {
      J: { f: 1, n: "joule" },
      kJ: { f: 1000, n: "kilojoule" },
      MJ: { f: 1e6, n: "megajoule" },
      Wh: { f: 3600, n: "watt-hour" },
      kWh: { f: 3.6e6, n: "kilowatt-hour" },
      BTU: { f: 1055.06, n: "British thermal unit" },
      cal: { f: 4.184, n: "calorie" },
    },
  },
  /* ── Power ────────────────────────────────────────────── */
  power: {
    base: "W",
    order: ["W", "kW", "MW", "HP", "BTU_hr"],
    u: {
      W: { f: 1, n: "watt" },
      kW: { f: 1000, n: "kilowatt" },
      MW: { f: 1e6, n: "megawatt" },
      HP: { f: 745.7, n: "horsepower" },
      BTU_hr: { f: 0.293071, n: "BTU per hour" },
    },
  },
  /* ── Speed ────────────────────────────────────────────── */
  speed: {
    base: "m_s",
    order: ["m_s", "km_h", "mph", "ft_s", "knot"],
    u: {
      m_s: { f: 1, n: "metre per second" },
      km_h: { f: 0.277778, n: "kilometre per hour" },
      mph: { f: 0.44704, n: "mile per hour" },
      ft_s: { f: 0.3048, n: "foot per second" },
      knot: { f: 0.514444, n: "knot" },
    },
  },
  /* ── Frequency ────────────────────────────────────────── */
  frequency: {
    base: "Hz",
    order: ["Hz", "kHz", "MHz", "GHz", "RPM"],
    u: {
      Hz: { f: 1, n: "hertz" },
      kHz: { f: 1000, n: "kilohertz" },
      MHz: { f: 1e6, n: "megahertz" },
      GHz: { f: 1e9, n: "gigahertz" },
      RPM: { f: 1 / 60, n: "revolutions per minute" },
    },
  },
  /* ── Density ──────────────────────────────────────────── */
  density: {
    base: "kg_m3",
    order: ["kg_m3", "g_cm3", "lb_ft3", "lb_gal"],
    u: {
      kg_m3: { f: 1, n: "kg per cubic metre" },
      g_cm3: { f: 1000, n: "gram per cubic cm" },
      lb_ft3: { f: 16.0185, n: "pound per cubic foot" },
      lb_gal: { f: 119.826, n: "pound per US gallon" },
    },
  },
  /* ── Flow Rate ────────────────────────────────────────── */
  flow: {
    base: "L_s",
    order: ["L_s", "L_min", "m3_h", "GPM", "CFM"],
    u: {
      L_s: { f: 1, n: "litre per second" },
      L_min: { f: 1 / 60, n: "litre per minute" },
      m3_h: { f: 0.277778, n: "cubic metre per hour" },
      GPM: { f: 0.0630902, n: "US gallon per minute" },
      CFM: { f: 0.471947, n: "cubic foot per minute" },
    },
  },
  /* ── Torque ───────────────────────────────────────────── */
  torque: {
    base: "Nm",
    order: ["Nm", "kNm", "lbft", "kgcm"],
    u: {
      Nm: { f: 1, n: "newton-metre" },
      kNm: { f: 1000, n: "kilonewton-metre" },
      lbft: { f: 1.35582, n: "pound-foot" },
      kgcm: { f: 0.0980665, n: "kilogram-centimetre" },
    },
  },
};

function toBase(fam: string, u: string, v: number): number {
  const d = FAM[fam]?.u[u];
  if (!d) return v;
  if (d.to) return d.to(v);
  return v * (d.f == null ? 1 : d.f);
}

function fromBase(fam: string, u: string, v: number): number {
  const d = FAM[fam]?.u[u];
  if (!d) return v;
  if (d.from) return d.from(v);
  return v / (d.f == null ? 1 : d.f);
}

export function convert(fam: string, from: string, to: string, v: number): number {
  return fromBase(fam, to, toBase(fam, from, v));
}

/** Map of unit symbols → [family, declaredUnit] */
export const UNIT_MAP: Record<string, [string, string]> = {
  /* Length */
  mm: ["length", "mm"],
  cm: ["length", "cm"],
  m: ["length", "m"],
  in: ["length", "in"],
  ft: ["length", "ft"],
  yd: ["length", "yd"],
  /* Mass */
  kg: ["mass", "kg"],
  g: ["mass", "g"],
  t: ["mass", "t"],
  lb: ["mass", "lb"],
  oz: ["mass", "oz"],
  /* Temperature */
  c: ["temperature", "C"],
  "°c": ["temperature", "C"],
  f: ["temperature", "F"],
  "°f": ["temperature", "F"],
  k: ["temperature", "K"],
  /* Distance */
  km: ["distance", "km"],
  mi: ["distance", "mi"],
  nmi: ["distance", "nmi"],
  /* Time */
  ms: ["time", "ms"],
  s: ["time", "s"],
  sec: ["time", "s"],
  min: ["time", "min"],
  hr: ["time", "hr"],
  h: ["time", "hr"],
  hour: ["time", "hr"],
  day: ["time", "day"],
  /* Area */
  mm2: ["area", "mm2"],
  cm2: ["area", "cm2"],
  m2: ["area", "m2"],
  sqm: ["area", "m2"],
  in2: ["area", "in2"],
  ft2: ["area", "ft2"],
  sqft: ["area", "ft2"],
  /* Volume */
  ml: ["volume", "ml"],
  L: ["volume", "L"],
  l: ["volume", "L"],
  m3: ["volume", "m3"],
  gal: ["volume", "gal"],
  ft3: ["volume", "ft3"],
  /* Pressure */
  Pa: ["pressure", "Pa"],
  kPa: ["pressure", "kPa"],
  MPa: ["pressure", "MPa"],
  bar: ["pressure", "bar"],
  psi: ["pressure", "psi"],
  atm: ["pressure", "atm"],
  /* Force */
  N: ["force", "N"],
  kN: ["force", "kN"],
  lbf: ["force", "lbf"],
  kgf: ["force", "kgf"],
  /* Energy */
  J: ["energy", "J"],
  kJ: ["energy", "kJ"],
  MJ: ["energy", "MJ"],
  Wh: ["energy", "Wh"],
  kWh: ["energy", "kWh"],
  BTU: ["energy", "BTU"],
  cal: ["energy", "cal"],
  /* Power */
  W: ["power", "W"],
  kW: ["power", "kW"],
  MW: ["power", "MW"],
  HP: ["power", "HP"],
  hp: ["power", "HP"],
  BTU_hr: ["power", "BTU_hr"],
  /* Speed */
  m_s: ["speed", "m_s"],
  "m/s": ["speed", "m_s"],
  km_h: ["speed", "km_h"],
  "km/h": ["speed", "km_h"],
  mph: ["speed", "mph"],
  ft_s: ["speed", "ft_s"],
  knot: ["speed", "knot"],
  /* Frequency */
  Hz: ["frequency", "Hz"],
  hz: ["frequency", "Hz"],
  kHz: ["frequency", "kHz"],
  MHz: ["frequency", "MHz"],
  GHz: ["frequency", "GHz"],
  rpm: ["frequency", "RPM"],
  RPM: ["frequency", "RPM"],
  /* Density */
  kg_m3: ["density", "kg_m3"],
  "kg/m3": ["density", "kg_m3"],
  "kg/m³": ["density", "kg_m3"],
  g_cm3: ["density", "g_cm3"],
  "g/cm3": ["density", "g_cm3"],
  lb_ft3: ["density", "lb_ft3"],
  "lb/ft3": ["density", "lb_ft3"],
  /* Flow */
  L_s: ["flow", "L_s"],
  "L/s": ["flow", "L_s"],
  L_min: ["flow", "L_min"],
  "L/min": ["flow", "L_min"],
  m3_h: ["flow", "m3_h"],
  "m3/h": ["flow", "m3_h"],
  GPM: ["flow", "GPM"],
  CFM: ["flow", "CFM"],
  /* Torque */
  Nm: ["torque", "Nm"],
  kNm: ["torque", "kNm"],
  lbft: ["torque", "lbft"],
  kgcm: ["torque", "kgcm"],
};
