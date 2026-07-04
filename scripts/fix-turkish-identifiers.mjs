/**
 * Aggressive Turkish token fixer that handles camelCase identifiers.
 * Finds Turkish tokens inside camelCase and replaces them with English.
 * Run: node scripts/fix-turkish-identifiers.mjs
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = new URL("..", import.meta.url).pathname;

// Load forbidden hash set
const hashes = JSON.parse(fs.readFileSync(path.join(ROOT, "data/governance/forbidden-token-hashes.json"), "utf8"));
const hashSet = new Set(hashes);

// Build reverse map: hash → token
const hashToToken = {};
// Known Turkish tokens (the ones we've been replacing)
const knownTokens = [
  "production","manufacturing","cost","labor","investment","average","material","unit","example",
  "volume","total","quantity","weight","inventory","input","output","calculate","result","payment",
  "efficiency","product","part","supplier","construction","engineer","realestate","environment","wood",
  "hydraulic","railway","budget","mass","force","stress","steel","roof","beam",
  "column","wall","concrete","solar","wind","slope","surface","area","flow","speed",
  "user","safety","pressure","temperature","design","resistance","capacity","power",
  "value","period","ratio","count","height","length","width","sustainability",
  "energy","project","site","technical","margin","waste","loss","productivity","quality",
  "maintenance","solution","structure","management","planning","customer","tool","waste","resource",
  "savings","potential","performance","monitoring","audit","report","document","record",
  "update","repair","status","installation","operation","shutdown","emergency","crisis",
  "notification","warning","intervention","recovery","period","instant","peak","trough","change",
  "momentum","acceleration","start","finish","phase","step","sequence","repeat","cycle",
  "execute","successful","failed","pending","completed","cancelled","approved",
  "waiting","active","degradation","signal","image","modeling","prediction","numerical",
  "validation","analysis","synthetic","generator","component","algorithm","cumulative",
  "distribution","probability","expected","compound","increase","limit","condition","constraint",
  "control","variable","uncertainty","sensitivity","contribution","weighted","blended",
  "historical","current","future","actual","planned","deviation","accuracy",
  "level","frequency","behavior","process","pressure","temperature","pneumatic","demand",
  "setup","sales","price","operation","day","year","error","share","spare","devreye",
  "alma","sureci","cycle","duration","correct","performed","incorrect","delay","trend",
  "difficulty","coefficient"
];

const TR_TO_EN = {
  production:"production", manufacturing:"manufacturing", cost:"cost", labor:"labor",
  investment:"investment", average:"average", material:"material", unit:"unit",
  example:"example", volume:"volume", total:"total", quantity:"quantity",
  weight:"weight", inventory:"inventory", input:"input", output:"output",
  calculate:"calculate", result:"result", payment:"payment", efficiency:"efficiency",
  product:"product", part:"part", supplier:"supplier", construction:"construction",
  engineer:"engineer", realestate:"realestate", environment:"environment", wood:"wood",
  hydraulic:"hydraulic", railway:"railway", budget:"budget", mass:"mass",
  force:"force", stress:"stress", steel:"steel", roof:"roof",
  beam:"beam", column:"column", wall:"wall", concrete:"concrete",
  solar:"solar", wind:"wind", slope:"slope", surface:"surface",
  area:"area", flow:"flow", speed:"speed", user:"user",
  safety:"safety", pressure:"pressure", temperature:"temperature", design:"design",
  resistance:"resistance", capacity:"capacity", power:"power", value:"value",
  period:"period", ratio:"ratio", count:"count", height:"height",
  length:"length", width:"width", sustainability:"sustainability",
  energy:"energy", project:"project", site:"site", technical:"technical",
  margin:"margin", waste:"waste", loss:"loss", productivity:"productivity",
  quality:"quality", maintenance:"maintenance", solution:"solution",
  structure:"structure", management:"management", planning:"planning",
  customer:"customer", tool:"tool", waste:"waste", resource:"resource",
  savings:"savings", potential:"potential", performance:"performance",
  monitoring:"monitoring", audit:"audit", report:"report", document:"document",
  record:"record", update:"update", repair:"repair",
  status:"status", installation:"installation", operation:"operation",
  shutdown:"shutdown", emergency:"emergency", crisis:"crisis",
  notification:"notification", warning:"warning", intervention:"intervention",
  recovery:"recovery", period:"period", instant:"instant",
  peak:"peak", trough:"trough", change:"change",
  momentum:"momentum", acceleration:"acceleration", start:"start",
  finish:"finish", phase:"phase", step:"step",
  sequence:"sequence", repeat:"repeat", cycle:"cycle",
  execute:"execute", successful:"successful", failed:"failed",
  pending:"pending", completed:"completed", cancelled:"cancelled",
  approved:"approved", waiting:"waiting", active:"active",
  degradation:"degradation", signal:"signal", image:"image",
  modeling:"modeling", prediction:"prediction", numerical:"numerical",
  validation:"validation", analysis:"analysis", synthetic:"synthetic",
  generator:"generator", component:"component", algorithm:"algorithm",
  cumulative:"cumulative", distribution:"distribution", probability:"probability",
  expected:"expected", compound:"compound", increase:"increase",
  limit:"limit", condition:"condition", constraint:"constraint",
  control:"control", variable:"variable", uncertainty:"uncertainty",
  sensitivity:"sensitivity", contribution:"contribution", weighted:"weighted",
  blended:"blended", historical:"historical", current:"current",
  future:"future", actual:"actual", planned:"planned",
  deviation:"deviation", accuracy:"accuracy", level:"level",
  frequency:"frequency", behavior:"behavior", process:"process",
  pneumatic:"pneumatic", demand:"demand", setup:"setup",
  sales:"sales", price:"price", day:"day", year:"year",
  error:"error", share:"share", spare:"spare", cycle:"cycle",
  correct:"correct", performed:"performed", incorrect:"incorrect",
  delay:"delay", trend:"trend", difficulty:"difficulty",
  coefficient:"coefficient"
};

// Sort by length descending
const sortedTokens = Object.keys(TR_TO_EN).sort((a, b) => b.length - a.length);

function replaceInContent(content) {
  let result = content;
  
  // Strategy: for each Turkish token, replace it as an ALPHABETIC substring
  // (not just word boundary). This catches camelCase embedded tokens.
  // BUT we must be careful to only replace the Turkish form, not English words
  // that happen to contain the Turkish substring.
  
  for (const tr of sortedTokens) {
    const en = TR_TO_EN[tr];
    
    // Case 1: Word boundary (standalone word) — case-insensitive
    const wordRe = new RegExp("(?<=^|[^a-zA-Z0-9])" + tr + "(?=[^a-zA-Z0-9]|$)", "gi");
    result = result.replace(wordRe, (match) => {
      if (match === tr) return en;
      if (match === tr.charAt(0).toUpperCase() + tr.slice(1))
        return en.charAt(0).toUpperCase() + en.slice(1);
      if (match === tr.toUpperCase()) return en.toUpperCase();
      const firstUpper = match.charAt(0) === match.charAt(0).toUpperCase();
      return firstUpper ? en.charAt(0).toUpperCase() + en.slice(1) : en;
    });
    
    // Case 2: CamelCase embedded — search for [A-Z]tr[A-Z] or [a-z]tr[A-Z] patterns
    // This handles patterns like "gunlukProductionHizi" → "gunlukProductionHizi"
    // Only do this for tokens that are 3+ chars to avoid false positives
    if (tr.length >= 3) {
      // Pattern: at least one uppercase variant followed by the token followed by uppercase
      // The token itself can be lowercase or uppercase
      const trUpper = tr.charAt(0).toUpperCase() + tr.slice(1);
      const ccRe = new RegExp(
        trUpper + "(?=[A-Z])", // ...ProductionHizi... → ...ProductionHizi...
        "g"
      );
      result = result.replace(ccRe, (match) => {
        return en.charAt(0).toUpperCase() + en.slice(1);
      });
      
      // Also handle all-lowercase in the middle of identifiers like "production_hizi"
      // This is handled by the word boundary regex (underscore is a word boundary)
    }
  }
  
  return result;
}

function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    
    // Quick check: does this file contain any Turkish-coded pattern?
    const lower = content.toLowerCase();
    let needsFix = false;
    for (const tr of sortedTokens) {
      if (lower.includes(tr)) { needsFix = true; break; }
    }
    if (!needsFix) return false;
    
    const fixed = replaceInContent(content);
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, "utf8");
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function scan(dir) {
  let fixed = 0, total = 0;
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
      fixed += sf.fixed; total += sf.total;
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry) && stat.size < 5242880 && stat.size > 50) {
      total++;
      if (fixFile(fullPath)) {
        console.log(`FIXED ${rel}`);
        fixed++;
      }
    }
  }
  return { fixed, total };
}

console.log("Aggressive Turkish identifier fixer...");
console.log("Scanning src/...");
const r1 = scan(path.join(ROOT, "src"));
console.log(`src/: ${r1.fixed} files fixed out of ${r1.total}`);
console.log("Scanning scripts/...");
const r2 = scan(path.join(ROOT, "scripts"));
console.log(`scripts/: ${r2.fixed} files fixed out of ${r2.total}`);
console.log(`Total: ${r1.fixed + r2.fixed} files fixed out of ${r1.total + r2.total}`);
console.log("Done.");
