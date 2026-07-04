/**
 * Bulk-fix ALL Turkish ASCII tokens in ALL source files at once.
 * This script replaces every known Turkish token with its English equivalent,
 * handling camelCase identifiers, string literals, comments, etc.
 * Run: node scripts/fix-all-turkish-tokens.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;

// Turkish → English replacement map — extended & comprehensive
const TR_TO_EN = {
  production: "production",
  manufacturing: "manufacturing",
  cost: "cost",
  labor: "labor",
  investment: "investment",
  average: "average",
  material: "material",
  unit: "unit",
  example: "example",
  volume: "volume",
  total: "total",
  quantity: "quantity",
  weight: "weight",
  inventory: "inventory",
  input: "input",
  output: "output",
  calculate: "calculate",
  result: "result",
  payment: "payment",
  efficiency: "efficiency",
  product: "product",
  part: "part",
  supplier: "supplier",
  construction: "construction",
  engineer: "engineer",
  realestate: "realestate",
  environment: "environment",
  wood: "wood",
  hydraulic: "hydraulic",
  railway: "railway",
  budget: "budget",
  mass: "mass",
  force: "force",
  stress: "stress",
  steel: "steel",
  roof: "roof",
  beam: "beam",
  column: "column",
  wall: "wall",
  concrete: "concrete",
  solar: "solar",
  wind: "wind",
  slope: "slope",
  surface: "surface",
  area: "area",
  flow: "flow",
  speed: "speed",
  user: "user",
  safety: "safety",
  pressure: "pressure",
  temperature: "temperature",
  design: "design",
  resistance: "resistance",
  capacity: "capacity",
  power: "power",
  value: "value",
  period: "period",
  ratio: "ratio",
  count: "count",
  height: "height",
  length: "length",
  width: "width",
  sustainability: "sustainability",
  energy: "energy",
  project: "project",
  site: "site",
  technical: "technical",
  margin: "margin",
  waste: "waste",
  loss: "loss",
  productivity: "productivity",
  quality: "quality",
  maintenance: "maintenance",
  solution: "solution",
  structure: "structure",
  management: "management",
  planning: "planning",
  customer: "customer",
  tool: "tool",
  waste: "waste",
  resource: "resource",
  savings: "savings",
  potential: "potential",
  performance: "performance",
  monitoring: "monitoring",
  audit: "audit",
  report: "report",
  document: "document",
  record: "record",
  update: "update",
  repair: "repair",
  status: "status",
  installation: "installation",
  working: "operation",
  shutdown: "shutdown",
  emergency: "emergency",
  crisis: "crisis",
  notification: "notification",
  warning: "warning",
  intervention: "intervention",
  recovery: "recovery",
  period: "period",
  instant: "instant",
  peak: "peak",
  trough: "trough",
  change: "change",
  momentum: "momentum",
  acceleration: "acceleration",
  start: "start",
  finish: "finish",
  phase: "phase",
  step: "step",
  sequence: "sequence",
  repeat: "repeat",
  cycle: "cycle",
  execute: "execute",
  successful: "successful",
  failed: "failed",
  pending: "pending",
  completed: "completed",
  cancelled: "cancelled",
  approved: "approved",
  waiting: "waiting",
  active: "active",
  degradation: "degradation",
  signal: "signal",
  image: "image",
  modeling: "modeling",
  prediction: "prediction",
  numerical: "numerical",
  validation: "validation",
  analysis: "analysis",
  synthetic: "synthetic",
  generator: "generator",
  component: "component",
  algorithm: "algorithm",
  cumulative: "cumulative",
  distribution: "distribution",
  probability: "probability",
  expected: "expected",
  compound: "compound",
  increase: "increase",
  limit: "limit",
  condition: "condition",
  constraint: "constraint",
  control: "control",
  variable: "variable",
  uncertainty: "uncertainty",
  sensitivity: "sensitivity",
  contribution: "contribution",
  weighted: "weighted",
  blended: "blended",
  historical: "historical",
  current: "current",
  future: "future",
  actual: "actual",
  planned: "planned",
  deviation: "deviation",
  accuracy: "accuracy",
  level: "level",
  frequency: "frequency",
  behavior: "behavior",
  process: "process",
  pressure: "pressure",
  temperature: "temperature",
  pneumatic: "pneumatic",
  demand: "demand",
  setup: "setup",
  variable: "variable",
  sales: "sales",
  price: "price",
  working: "working",
  day: "day",
  year: "year",
  error: "error",
  share: "share",
  spare: "spare",
  commissioning: "commissioning",
  taking: "taking",
  process: "process",
  cycle: "cycle",
  duration: "duration",
  correct: "correct",
  performed: "performed",
  incorrect: "incorrect",
  inevitable: "inevitable",
  dispute: "dispute",
  contractor: "contractor",
  delay: "delay",
  penalties: "penalties",
  trend: "trend",
  difficulty: "difficulty",
  coefficient: "coefficient",
  type: "type",
  count: "count",
  distance: "distance",
  vehicle: "vehicle",
  fullLoad: "fullLoad",
  demand: "demand",
  loading: "loading",
  unloading: "unloading",
  waiting: "waiting",
  driver: "driver",
  operating: "operating",
  expense: "expense",
  depreciation: "depreciation",
  repair: "repair",
  sparePart: "sparePart",
  fuel: "fuel",
  oil: "oil",
  tire: "tire",
  insurance: "insurance",
  tax: "tax",
  comprehensive: "comprehensive",
  profit: "profit",
  loss: "loss",
  min: "min",
  max: "max",
  average: "average",
  standard: "standard",
  deviation: "deviation",
  variance: "variance",
  correlation: "correlation",
  regression: "regression",
  clustering: "clustering",
  classification: "classification",
  class: "class",
  label: "label",
  feature: "feature",
  weight: "weight",
  threshold: "threshold",
  learning: "learning",
  training: "training",
  test: "test",
  accuracy: "accuracy",
  precision: "precision",
  realization: "realization",
};

// Sort by length descending for longest-prefix matching
const tokens = Object.keys(TR_TO_EN).sort((a, b) => b.length - a.length);

function fixContent(content) {
  // Case 1: standalone word (surrounded by non-alphanumeric)
  for (const tr of tokens) {
    const en = TR_TO_EN[tr];
    // Word boundary replacement (case-insensitive)
    const re = new RegExp("(?<=^|[^a-zA-Z0-9_])" + tr + "(?=[^a-zA-Z0-9_])", "gi");
    content = content.replace(re, (match) => {
      // Preserve case pattern
      if (match === tr) return en; // all lowercase
      if (match === tr.charAt(0).toUpperCase() + tr.slice(1))
        return en.charAt(0).toUpperCase() + en.slice(1);
      if (match === tr.toUpperCase()) return en.toUpperCase();
      // Mixed case - preserve first char case
      const firstUpper = match.charAt(0) === match.charAt(0).toUpperCase();
      return firstUpper ? en.charAt(0).toUpperCase() + en.slice(1) : en;
    });
  }
  return content;
}

function scan(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const fullPath = path.join(dir, entry);
    const relPath = path.relative(ROOT, fullPath);
    
    // Skip excluded dirs
    if (entry === "node_modules" || entry === ".next" || entry === "archive" ||
        entry === "sectorcalc_pro_new_v531_package" || entry === "sectorcalc_free_v531_formula_blueprints" ||
        entry === "sectorcalc_deprecated_v530") continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scan(fullPath);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry) && stat.size < 5242880 && stat.size > 50) {
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        
        // Check if any Turkish token is present
        let hasToken = false;
        for (const tr of tokens) {
          const re = new RegExp("(?<=^|[^a-zA-Z0-9_])" + tr + "(?=[^a-zA-Z0-9_])", "gi");
          if (re.test(content)) {
            hasToken = true;
            break;
          }
        }
        
        if (hasToken) {
          const fixed = fixContent(content);
          if (fixed !== content) {
            fs.writeFileSync(fullPath, fixed, "utf8");
            console.log(`FIXED ${relPath}`);
          }
        }
      } catch (err) {
        // skip binary or unreadable
      }
    }
  }
}

console.log("Scanning and fixing all files...");
scan(path.join(ROOT, "src"));
scan(path.join(ROOT, "scripts"));
scan(path.join(ROOT, "data"));
scan(path.join(ROOT, "public"));
console.log("Done.");
