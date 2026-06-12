import type { ReferenceGraphicTemplate } from "@/lib/guidance/reference-graphic-types";

export const SLUG_TEMPLATE_OVERRIDES: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  "concrete-volume-calculator": "volume",
  "volume-calculator": "volume",
  "box-volume-calculator": "box-dimension",
  "package-volume-calculator": "box-dimension",
  "paint-coverage-calculator": "area",
  "paint-coverage-cost-check": "area",
  "floor-area-calculator": "area",
  "roof-area-calculator": "area",
  "stair-calculator": "stair",
  "concrete-stair-calculator": "stair",
  "bend-allowance-calculator": "bend-radius",
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
  "cnc-oee-loss": "machine-time",
  "production-time-calculator": "machine-time",
  "energy-peak-cost": "energy-flow",
  "compressor-leak-cost": "energy-flow",
  "electricity-cost-calculator": "energy-flow",
  "project-cost-calculator": "financial-flow",
  "cleaning-cost-calculator": "financial-flow",
  "menu-profit-calculator": "financial-flow",
  "margin-calculator": "financial-flow",
  "cnc-quote-risk-analyzer": "financial-flow",
  "break-even-calculator": "financial-flow",
};

export const CATEGORY_TEMPLATE_MAP: Readonly<Record<string, ReferenceGraphicTemplate>> = {
  "construction-measurement": "box-dimension",
  "painting-coating": "area",
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
  area: "area",
  volume: "volume",
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
  { keywords: ["concrete", "beton", "slab", "döşeme", "footing"], template: "volume" },
  { keywords: ["paint", "boya", "coating", "kaplama", "floor", "zemin"], template: "area" },
  { keywords: ["stair", "merdiven", "basamak", "rise", "rıht"], template: "stair" },
  { keywords: ["bend", "büküm", "k-factor", "sheet metal", "sac"], template: "bend-radius" },
  { keywords: ["pitch", "eğim", "slope", "roof", "çatı"], template: "angle" },
  { keywords: ["pipe", "boru", "cylinder", "silindir", "hydraulic", "pnömatik"], template: "cylinder-pipe" },
  { keywords: ["route", "rota", "fuel", "yakıt", "delivery", "teslimat", "navlun"], template: "route" },
  { keywords: ["energy", "enerji", "kwh", "compressor", "kompresör", "motor", "electric"], template: "energy-flow" },
  { keywords: ["machine", "makine", "setup", "cycle", "oee", "üretim"], template: "machine-time" },
  { keywords: ["margin", "marj", "cost", "maliyet", "price", "fiyat", "profit", "kâr", "credit", "kredi"], template: "financial-flow" },
  { keywords: ["box", "kutu", "koli", "package", "paket"], template: "box-dimension" },
];

export const FIELD_SIGNATURE_TEMPLATES: ReadonlyArray<{
  required: readonly string[];
  optional?: readonly string[];
  template: ReferenceGraphicTemplate;
}> = [
  { required: ["length", "width", "height"], template: "box-dimension" },
  { required: ["length", "width", "depth"], template: "volume" },
  { required: ["length", "width"], optional: ["area"], template: "area" },
  { required: ["length", "width", "height", "volume"], template: "volume" },
  { required: ["diameter", "length"], template: "cylinder-pipe" },
  { required: ["radius", "length"], template: "cylinder-pipe" },
  { required: ["pressure", "flow"], template: "cylinder-pipe" },
  { required: ["steps", "rise", "run"], template: "stair" },
  { required: ["materialThickness", "insideRadius"], template: "bend-radius" },
  { required: ["angle", "rise", "run"], template: "angle" },
  { required: ["distance", "fuel"], template: "route" },
  { required: ["power", "energy"], template: "energy-flow" },
  { required: ["setup", "time"], template: "machine-time" },
  { required: ["setupTime", "cycleTime"], template: "machine-time" },
  { required: ["cost", "price"], template: "financial-flow" },
  { required: ["cost", "margin"], template: "financial-flow" },
  { required: ["revenue", "cost"], template: "financial-flow" },
];
