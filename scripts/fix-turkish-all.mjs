/**
 * Aggressive bulk Turkish → English identifier renamer.
 * Handles camelCase embedded tokens AND string literal occurrences.
 * Applies to ALL files consistently so cross-references stay intact.
 * 
 * Run: node scripts/fix-turkish-all.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;

// Turkish → English map — extended with derived/possessive forms
// Order matters: longer tokens first, shorter last
const TR_TO_EN = {
  // Full compound words first (to avoid partial matches)
  "sustainability": "sustainability",
  "frozen": "frozen",
  "mutual": "mutual",
  "validation": "validation",
  "start": "start",
  "finish": "finish",
  "pending": "pending",
  "completed": "completed",
  "incomplete": "incomplete",
  "failed": "failed",
  "successful": "successful",
  "actual": "actual",
  "realization": "realization",
  "planned": "planned",
  "blended": "blended",
  "available": "available",
  "undetermined": "undetermined",
  "unset": "unset",
  "undefined": "undefined",
  
  // Turkish → English core tokens
  "production": "production",
  "production": "production",
  "produces": "produces",
  "duction": "duction", // for compounds like "production" split
  
  "manufacturing": "manufacturing",
  "manufacturing": "manufacturing",
  
  "cost": "cost",
  "cost": "cost",
  "cost": "cost",
  "cost": "cost",
  
  "labor": "labor",
  "investment": "investment",
  "investment": "investment",
  
  "average": "average",
  "averag": "averag",
  
  "material": "material",
  "material": "material",
  
  "unit": "unit",
  "unit": "unit",
  
  "example": "example",
  "example": "example",
  
  "volume": "volume",
  "volume": "volume",
  "volume": "volume",
  
  "total": "total",
  "quantity": "quantity",
  "quantity": "quantity",
  "weight": "weight",
  "weight": "weight",
  
  "inventory": "inventory",
  "inventory": "inventory",
  
  "input": "input",
  "input": "input",
  
  "output": "output",
  "output": "output",
  "outlet": "outlet",
  
  "calculate": "calculate",
  "account": "account",
  "calculation": "calculation",
  
  "result": "result",
  "result": "result",
  
  "payment": "payment",
  "payment": "payment",
  
  "efficiency": "efficiency",
  "efficiency": "efficiency",
  
  "product": "product",
  "product": "product",
  "product": "product",
  
  "part": "part",
  "part": "part",
  
  "supplier": "supplier",
  "supply": "supply",
  
  "construction": "construction",
  
  "engineer": "engineer",
  "engineering": "engineering",
  
  "realestate": "realestate",
  
  "environment": "environment",
  "environmental": "environmental",
  
  "wood": "wood",
  
  "hydraulic": "hydraulic",
  "pneumatic": "pneumatic",
  
  "railway": "railway",
  
  "budget": "budget",
  
  "mass": "mass",
  "mass": "mass",
  
  "force": "force",
  
  "stress": "stress",
  
  "steel": "steel",
  
  "roof": "roof",
  
  "beam": "beam",
  
  "column": "column",
  
  "wall": "wall",
  
  "concrete": "concrete",
  
  "solar": "solar",
  
  "wind": "wind",
  
  "slope": "slope",
  
  "surface": "surface",
  "surface": "surface",
  
  "area": "area",
  "area": "area",
  
  "flow": "flow",
  "flow": "flow",
  
  "speed": "speed",
  "speed": "speed",
  "fast": "fast",
  
  "user": "user",
  "usage": "usage",
  "use": "use",
  "user": "user",
  
  "safety": "safety",
  "safe": "safe",
  
  "pressure": "pressure",
  
  "temperature": "temperature",
  
  "design": "design",
  "design": "design",
  
  "resistance": "resistance",
  "resistance": "resistance",
  
  "capacity": "capacity",
  "capacity": "capacity",
  
  "power": "power",
  
  "value": "value",
  "value": "value",
  
  "period": "period",
  "period": "period",
  
  "ratio": "ratio",
  "ratio": "ratio",
  
  "count": "count",
  
  "height": "height",
  "high": "high",
  
  "length": "length",
  "long": "long",
  
  "width": "width",
  "wide": "wide",
  
  "energy": "energy",
  
  "project": "project",
  
  "site": "site",
  
  "technical": "technical",
  
  "margin": "margin",
  
  "waste": "waste",
  
  "loss": "loss",
  "loss": "loss",
  
  "productivity": "productivity",
  
  "quality": "quality",
  
  "maintenance": "maintenance",
  
  "solution": "solution",
  
  "structure": "structure",
  "structure": "structure",
  
  "management": "management",
  
  "planning": "planning",
  
  "customer": "customer",
  
  "tool": "tool",
  "tool": "tool",
  
  "waste": "waste",
  
  "resource": "resource",
  "resource": "resource",
  
  "savings": "savings",
  
  "potential": "potential",
  
  "performance": "performance",
  "performance": "performance",
  
  "monitoring": "monitoring",
  
  "audit": "audit",
  "audit": "audit",
  
  "report": "report",
  "report": "report",
  
  "document": "document",
  
  "record": "record",
  "record": "record",
  
  "update": "update",
  
  "repair": "repair",
  
  "status": "status",
  
  "installation": "installation",
  
  "operation": "operation",
  "running": "running",
  "execute": "execute",
  
  "shutdown": "shutdown",
  
  "emergency": "emergency",
  
  "crisis": "crisis",
  
  "notification": "notification",
  
  "warning": "warning",
  
  "intervention": "intervention",
  
  "recovery": "recovery",
  
  "period": "period",
  "period": "period",
  
  "instant": "instant",
  
  "peak": "peak",
  
  "trough": "trough",
  "trough": "trough",
  
  "change": "change",
  "change": "change",
  "variable": "variable",
  "variable": "variable",
  
  "momentum": "momentum",
  
  "acceleration": "acceleration",
  
  "phase": "phase",
  "phase": "phase",
  
  "step": "step",
  "step": "step",
  
  "sequence": "sequence",
  "sequence": "sequence",
  
  "repeat": "repeat",
  
  "cycle": "cycle",
  "cycle": "cycle",
  
  "active": "active",
  "active": "active",
  
  "degradation": "degradation",
  
  "signal": "signal",
  
  "image": "image",
  
  "modeling": "modeling",
  
  "prediction": "prediction",
  
  "numerical": "numerical",
  
  "analysis": "analysis",
  "analysis": "analysis",
  
  "synthetic": "synthetic",
  
  "generator": "generator",
  
  "component": "component",
  "component": "component",
  
  "algorithm": "algorithm",
  
  "cumulative": "cumulative",
  
  "distribution": "distribution",
  "distribution": "distribution",
  
  "probability": "probability",
  
  "expected": "expected",
  
  "compound": "compound",
  
  "increase": "increase",
  
  "limit": "limit",
  "limit": "limit",
  
  "condition": "condition",
  
  "constraint": "constraint",
  
  "control": "control",
  "control": "control",
  
  "uncertainty": "uncertainty",
  
  "sensitivity": "sensitivity",
  
  "contribution": "contribution",
  "contribution": "contribution",
  
  "weighted": "weighted",
  
  "historical": "historical",
  
  "current": "current",
  
  "future": "future",
  
  "deviation": "deviation",
  
  "accuracy": "accuracy",
  
  "precision": "precision",
  
  "level": "level",
  "level": "level",
  
  "frequency": "frequency",
  
  "behavior": "behavior",
  
  "process": "process",
  
  "demand": "demand",
  
  "setup": "setup",
  
  "sales": "sales",
  
  "price": "price",
  "price": "price",
  
  "day": "day",
  "daily": "daily",
  "perday": "perday",
  
  "year": "year",
  "annual": "annual",
  "peryear": "peryear",
  
  "error": "error",
  "incorrect": "incorrect",
  
  "share": "share",
  
  "spare": "spare",
  
  "cycle": "cycle",
  "cycle": "cycle",
  
  "duration": "duration",
  "duration": "duration",
  
  "correct": "correct",
  
  "performed": "performed",
  
  "delay": "delay",
  
  "trend": "trend",
  
  "difficulty": "difficulty",
  
  "coefficient": "coefficient",
  
  "count": "count",
  
  "distance": "distance",
  
  "vehicle": "vehicle",
  
  "loading": "loading",
  
  "unloading": "unloading",
  
  "waiting": "waiting",
  
  "driver": "driver",
  
  "operating": "operating",
  
  "expense": "expense",
  
  "depreciation": "depreciation",
  
  "repair": "repair",
  
  "fuel": "fuel",
  
  "oil": "oil",
  
  "tire": "tire",
  
  "insurance": "insurance",
  
  "tax": "tax",
  
  "comprehensive": "comprehensive",
  
  "profit": "profit",
  
  "loss": "loss",
  
  "variance": "variance",
  
  "correlation": "correlation",
  
  "regression": "regression",
  
  "clustering": "clustering",
  
  "classification": "classification",
  
  "class": "class",
  "class": "class",
  
  "label": "label",
  
  "feature": "feature",
  "feature": "feature",
  
  "threshold": "threshold",
  
  "learning": "learning",
  
  "training": "training",
  
  "training": "training",
  
  // Additional tokens
  "machine": "machine",
  "accounting": "accounting",
  "finance": "finance",
  "factory": "factory",
  "warehouse": "warehouse",
  "constructionsite": "constructionsite",
  "progresspayment": "progresspayment",
  "contract": "contract",
  "idle": "idle",
  "wasted": "wasted",
  "consume": "consume",
  "fits": "fits",
  "howmany": "howmany",
  "totable": "totable",
  "notdone": "notdone",
  "unknown": "unknown",
  "wrong": "wrong",
  "method": "method",
  "method": "method",
  "which": "which",
  "economic": "economic",
  "perquantity": "perquantity",
  "unknown": "unknown",
  "optimal": "optimal",
  "subcontractor": "subcontractor",
  "main": "main",
  "contractor": "contractor",
  "dispute": "dispute",
  "inevitable": "inevitable",
  "penalties": "penalties",
  "demand": "demand",
  "supply": "supply",
  "financial": "financial",
  "sector": "sector",
  "sectoral": "sectoral",
  "real": "real",
  "nominal": "nominal",
  "rent": "rent",
  "leasing": "leasing",
  "depreciation": "depreciation",
  "discount": "discount",
  "discount": "discount",
  "interest": "interest",
  "inflation": "inflation",
  "growth": "growth",
  "contraction": "contraction",
  "risk": "risk",
  "uncertainty": "uncertainty",
  "volatility": "volatility",
  "trend": "trend",
  "scenario": "scenario",
  "reference": "reference",
  "comparison": "comparison",
  "assessment": "assessment",
  "scoring": "scoring",
  "ranking": "ranking",
  "rating": "rating",
  "certificate": "certificate",
  "certification": "certification",
  "standard": "standard",
  "norm": "norm",
  "load": "load",
  "load": "load",
  "load": "load",
  "torque": "torque",
  "moment": "moment",
  "energy": "energy",
  "thermal": "thermal",
  "thermal": "thermal",
  "chemical": "chemical",
  "chemical": "chemical",
};

const sortedTokens = Object.keys(TR_TO_EN).sort((a, b) => b.length - a.length);

function fixOneFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const original = content;
    
    for (const tr of sortedTokens) {
      const en = TR_TO_EN[tr];
      
      if (!tr || !en) continue;
      if (tr === en) continue; // skip identity
      
      // Case 1: Lowercase word boundary — \bturkishword\b is too broad in JS,
      // so we construct the regex carefully
      
      // Full word match (surrounded by non-alpha or string edges) — handles standalone tokens
      // AND also handles camel-case split results where token is preceded/followed by
      // uppercase or underscore
      
      // Replace all occurrences: standalone AND camelCase-embedded
      // The key insight: in this codebase, EVERY occurrence of a Turkish token
      // needs to be renamed consistently. There are no valid English homonyms
      // for words like "production", "cost", etc.
      
      // Strategy: Replace ALL case-insensitive matches of the Turkish token
      // BUT only when surrounded by non-alphanumeric chars (word boundaries),
      // OR when preceded by lowercase+uppercase pattern (camelCase).
      // This means we need separate regexes.
      
      // Regex 1: Word boundary (standalone) — handles "cost" in all contexts
      const re1 = new RegExp("(?<=^|[^a-zA-Z0-9_])" + tr + "(?=[^a-zA-Z0-9_])", "gi");
      content = content.replace(re1, (match) => {
        // Preserve case scheme
        if (match === tr) return en;
        if (match.charAt(0).toUpperCase() + match.slice(1).toLowerCase() === tr.charAt(0).toUpperCase() + tr.slice(1))
          return en.charAt(0).toUpperCase() + en.slice(1);
        if (match === tr.toUpperCase()) return en.toUpperCase();
        // Mixed — preserve first char case
        return match.charAt(0) === match.charAt(0).toUpperCase()
          ? en.charAt(0).toUpperCase() + en.slice(1)
          : en;
      });
      
      // Regex 2: camelCase embedded as SecondPart — e.g., "...Production..." → "...Production..."
      // Match the token when preceded by lowercase letter (inside camelCase identifier)
      // This handles cases like "gunlukProductionHizi" → "gunlukProductionHizi"
      const trUpper = tr.charAt(0).toUpperCase() + tr.slice(1);
      const enUpper = en.charAt(0).toUpperCase() + en.slice(1);
      
      const re2 = new RegExp(trUpper + "(?=[A-Z])", "g");
      content = content.replace(re2, enUpper);
      
      // Regex 3: camelCase embedded as FirstPart — e.g., "ProductionHizi" → "ProductionHizi"
      // Match the token when preceded by start-of-string or non-alpha, then uppercase token,
      // followed by uppercase letter (next camelCase part)
      const re3 = new RegExp("(?<=^|[^a-zA-Z])" + trUpper + "(?=[A-Z])", "g");
      content = content.replace(re3, enUpper);
      
      // Regex 4: underscore boundary — e.g., "_maliyet_" → "_cost_"
      // This is already handled by regex 1 since underscore is [^a-zA-Z0-9_]
      // Wait, underscore IS in the exclusion set [^a-zA-Z0-9_]. So regex 1 won't match
      // across underscores. Let me handle this separately.
    }
    
    // After all replacements, do a final pass for underscore-bound tokens
    // These are words like "cost" where the preceding char is underscore
    // Actually regex 1 uses [^a-zA-Z0-9_] as lookbehind exclusion, which means
    // underscore IS excluded from matching. So tokens separated by underscores are NOT matched!
    // But the guard's splitIdentifierTokens splits on [^a-z0-9] (which INCLUDES underscore),
    // so "maliyet_birim" splits into ["cost", "unit"]. Both get checked against hashes.
    // 
    // To fix: do a separate replacement for pattern like "_maliyet_" → "_cost_"
    // This is essentially underscore-boundary matching.
    for (const tr of sortedTokens) {
      const en = TR_TO_EN[tr];
      if (!tr || !en || tr === en) continue;
      
      // Underscore boundary — handles "maliyet_birim" → "cost_unit"
      // This regex: preceded by underscore or start, then token, then underscore or end
      // It's already handled by regex 1 since underscore is... wait.
      // Regex 1 uses [^a-zA-Z0-9_] as exclusion for lookbehind.
      // But for the match alone, we use [^a-zA-Z0-9_].
      // This means "cost" in "maliyet_birim" is preceded by start-of-string (OK)
      // and followed by underscore (which IS [^a-zA-Z0-9_], so OK).
      // So regex 1 DOES handle underscore-boundary for the first word in "maliyet_birim".
      // But what about "_maliyet" preceded by underscore? Underscore is [^a-zA-Z0-9_],
      // so the lookbehind matches. Good.
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function scan(dir) {
  let fixed = 0, total = 0;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const fullPath = path.join(dir, entry);
      const rel = path.relative(ROOT, fullPath);
      if (entry === "node_modules" || entry === ".next" || entry === "archive" ||
          entry === "sectorcalc_pro_new_v531_package" || entry === "sectorcalc_free_v531_formula_blueprints") continue;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const sf = scan(fullPath);
        fixed += sf.fixed;
        total += sf.total;
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry) && stat.size < 5242880 && stat.size > 50) {
        total++;
        if (fixOneFile(fullPath)) {
          console.log(`  FIXED ${rel}`);
          fixed++;
        }
      }
    }
  } catch (e) {
    // dir not found
  }
  return { fixed, total };
}

console.log("Aggressive Turkish token fixer (V2 — handles all identifier patterns)");
console.log("Scanning src/...");
const r1 = scan(path.join(ROOT, "src"));
console.log(`src/: ${r1.fixed} fixed / ${r1.total}`);
console.log("Scanning scripts/...");
const r2 = scan(path.join(ROOT, "scripts"));
console.log(`scripts/: ${r2.fixed} fixed / ${r2.total}`);
console.log(`Total: ${r1.fixed + r2.fixed} fixed / ${r1.total + r2.total}`);
console.log("Done.");
