import type { ReferenceGraphicTemplate } from "@/lib/guidance/reference-graphic-types";

export const SLUG_TEMPLATE_OVERRIDES: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  "concrete-volume-calculator": "box-dimension",
  "volume-calculator": "box-dimension",
  "box-volume-calculator": "box-dimension",
  "package-volume-calculator": "box-dimension",
  "paint-coverage-calculator": "wall-area",
  "paint-coverage-cost-check": "wall-area",
  "floor-area-calculator": "wall-area",
  "flooring-calculator": "wall-area",
  "roof-area-calculator": "wall-area",
  "stair-calculator": "stair",
  "concrete-stair-calculator": "stair",
  "bend-allowance-calculator": "bend-radius",
  "bend-deduction-calculator": "bend-radius",
  "k-factor-calculator": "bend-radius",
  "sheet-metal-bend-calculator": "bend-radius",
  "roof-pitch-calculator": "angle",
  "slope-calculator": "angle",
  "pipe-flow-calculator": "cylinder-pipe",
  "pipe-diameter-calculator": "cylinder-pipe",
  "hydraulic-cylinder-calculator": "cylinder-pipe",
  "route-cost-calculator": "route",
  "fuel-cost-calculator": "route",
  "logistics-route-loss": "route",
  "machine-time-calculator": "machine-time",
  "machine-hour-rate-calculator": "machine-time",
  "cnc-oee-loss": "machine-time",
  "production-time-calculator": "machine-time",
  "energy-peak-cost": "energy-flow",
  "energy-consumption-calculator": "energy-flow",
  "electricity-cost-calculator": "energy-flow",
  "compressor-leak-cost-calculator": "compressor-leak",
  "energy-compressor-leak-cost": "compressor-leak",
  "project-cost-calculator": "financial-flow",
  "cleaning-cost-calculator": "financial-flow",
  "menu-profit-calculator": "financial-flow",
  "margin-calculator": "financial-flow",
  "quote-price-margin-calculator": "financial-flow",
  "quote-price-profit-margin-calculator": "financial-flow",
  "personnel-cost-calculator": "financial-flow",
  "cnc-quote-risk-analyzer": "financial-flow",
  "break-even-calculator": "financial-flow",
};

export const CATEGORY_TEMPLATE_MAP: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  "construction-measurement": "box-dimension",
  "painting-coating": "wall-area",
  "logistics-transport": "route",
  "energy-utilities": "energy-flow",
  "manufacturing-cnc": "machine-time",
  "sheet-metal": "bend-radius",
  "plumbing-hvac": "cylinder-pipe",
  "finance-margin": "financial-flow",
  "restaurant-food": "financial-flow",
  construction: "box-dimension",
  logistics: "route",
  energy: "energy-flow",
  manufacturing: "machine-time",
  finance: "financial-flow",
};

export const SECTOR_TEMPLATE_MAP: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  construction: "box-dimension",
  logistics: "route",
  energy: "energy-flow",
  manufacturing: "machine-time",
  "sheet-metal": "bend-radius",
  hvac: "cylinder-pipe",
  plumbing: "cylinder-pipe",
  restaurant: "financial-flow",
  retail: "financial-flow",
  finance: "financial-flow",
  cnc: "machine-time",
};

export const UNIT_GROUP_TEMPLATE_MAP: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  length: "box-dimension",
  area: "wall-area",
  volume: "box-dimension",
  pressure: "cylinder-pipe",
  flow: "cylinder-pipe",
  energy: "energy-flow",
  power: "energy-flow",
  currency: "financial-flow",
  time: "machine-time",
  angle: "angle",
};

export const KEYWORD_TEMPLATE_HINTS: ReadonlyArray<{
  keywords: readonly string[];
  template: ReferenceGraphicTemplate;
}> = [
  { keywords: ["concrete", "beton", "slab", "döşeme", "footing"], template: "box-dimension" },
  { keywords: ["paint", "boya", "coating", "kaplama", "floor", "zemin", "roof", "çatı"], template: "wall-area" },
  { keywords: ["stair", "merdiven", "basamak", "rise", "rıht"], template: "stair" },
  { keywords: ["bend", "büküm", "k-factor", "sheet metal", "sac"], template: "bend-radius" },
  { keywords: ["pitch", "eğim", "slope"], template: "angle" },
  { keywords: ["pipe", "boru", "cylinder", "silindir", "hydraulic", "pnömatik"], template: "cylinder-pipe" },
  { keywords: ["compressor", "kompresör", "leak", "kaçak", "basınçlı hava"], template: "compressor-leak" },
  { keywords: ["route", "rota", "fuel", "yakıt", "delivery", "teslimat", "navlun"], template: "route" },
  { keywords: ["energy", "enerji", "kwh", "motor", "electric"], template: "energy-flow" },
  { keywords: ["machine", "makine", "setup", "cycle", "oee", "üretim"], template: "machine-time" },
  { keywords: ["margin", "marj", "cost", "maliyet", "price", "fiyat", "profit", "kâr", "credit", "kredi", "quote", "teklif"], template: "financial-flow" },
  { keywords: ["box", "kutu", "koli", "package", "paket"], template: "box-dimension" },
];

export const FIELD_SIGNATURE_TEMPLATES: ReadonlyArray<{
  required: readonly string[];
  optional?: readonly string[];
  template: ReferenceGraphicTemplate;
}> = [
  { required: ["length", "width", "height"], template: "box-dimension" },
  { required: ["length", "width", "depth"], template: "box-dimension" },
  { required: ["length", "width"], optional: ["area"], template: "wall-area" },
  { required: ["length", "width", "height", "volume"], template: "box-dimension" },
  { required: ["diameter", "length"], template: "cylinder-pipe" },
  { required: ["radius", "length"], template: "cylinder-pipe" },
  { required: ["pressure", "flow"], template: "cylinder-pipe" },
  { required: ["pressure", "leakDiameter"], template: "compressor-leak" },
  { required: ["pressure", "runtime"], template: "compressor-leak" },
  { required: ["steps", "riserRise", "treadRun"], template: "stair" },
  { required: ["materialThickness", "insideRadius"], template: "bend-radius" },
  { required: ["insideRadius", "bendAngle"], template: "bend-radius" },
  { required: ["angle", "riserRise", "treadRun"], template: "stair" },
  { required: ["distance", "fuel"], template: "route" },
  { required: ["power", "energy"], template: "energy-flow" },
  { required: ["setupTime", "cycleTime"], template: "machine-time" },
  { required: ["setupTime", "quantity"], template: "machine-time" },
  { required: ["cycleTime", "quantity"], template: "machine-time" },
  { required: ["cost", "price"], template: "financial-flow" },
  { required: ["cost", "margin"], template: "financial-flow" },
];

export const TOOLS_THAT_MUST_NOT_BE_GENERIC: readonly string[] = [
  "concrete-volume-calculator",
  "paint-coverage-calculator",
  "k-factor-calculator",
  "stair-calculator",
  "compressor-leak-cost-calculator",
  "energy-compressor-leak-cost",
  "machine-time-calculator",
  "quote-price-profit-margin-calculator",
  "quote-price-margin-calculator",
];

export const EXPECTED_TOOL_TEMPLATES: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  "concrete-volume-calculator": "box-dimension",
  "paint-coverage-calculator": "wall-area",
  "k-factor-calculator": "bend-radius",
  "stair-calculator": "stair",
  "compressor-leak-cost-calculator": "compressor-leak",
  "energy-compressor-leak-cost": "compressor-leak",
  "machine-time-calculator": "machine-time",
  "quote-price-profit-margin-calculator": "financial-flow",
  "quote-price-margin-calculator": "financial-flow",
};
