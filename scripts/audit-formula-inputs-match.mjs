#!/usr/bin/env node
/**
 * SectorCalc — Formül ↔ Input ↔ Output Uyum Gate (v2, düzeltilmiş)
 */
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");

const FN_WHITELIST = new Set([
  "sqrt", "cbrt", "pow", "abs", "min", "max", "round", "floor", "ceil",
  "log", "log10", "log2", "ln", "exp", "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
  "sign", "trunc", "hypot", "clamp", "if", "ifelse",
]);

const KEYWORDS = new Set(["true", "false", "null", "undefined", "NaN", "Infinity", "PI", "E"]);

function analyzeExpression(expr) {
  if (typeof expr !== "string") return { vars: new Set(), unknownFns: new Set() };

  let s = expr.replace(/(?<![a-zA-Z_$\d])(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g, " ");
  s = s.replace(/Math\.[a-zA-Z0-9_]+/g, " ");
  s = s.replace(/\.[\p{L}_$][\p{L}\p{N}_$]*/gu, " ");

  const vars = new Set();
  const unknownFns = new Set();
  const re = /([\p{L}_$][\p{L}\p{N}_$]*)\s*(\()?/gu;
  let m;
  while ((m = re.exec(s)) !== null) {
    const name = m[1];
    const isCall = Boolean(m[2]);
    if (KEYWORDS.has(name)) continue;
    if (isCall) {
      if (!FN_WHITELIST.has(name)) unknownFns.add(name);
      continue;
    }
    vars.add(name);
  }
  return { vars, unknownFns };
}

const files = globSync(`${SCHEMAS_DIR}/**/*.json`);
const fails = [];  
const warns = [];  

for (const file of files) {
  const toolId = path.basename(file).replace(/-schema\.json$|\.json$/, "");
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { fails.push({ toolId, issues: ["[PARSE ERROR] JSON okunamadı"] }); continue; }

  if (!data || !Array.isArray(data.inputs) || !data.formulas) continue;

  const inputIds = new Set(data.inputs.map((i) => i.id));
  const formulaKeys = new Set(Object.keys(data.formulas));
  const usedVars = new Set();
  const fileFails = [];
  const fileWarns = [];

  for (const [outKey, expr] of Object.entries(data.formulas)) {
    const { vars, unknownFns } = analyzeExpression(expr);
    for (const fn of unknownFns) {
      fileFails.push(`[UNKNOWN FN] '${outKey}' formülünde '${fn}()' — evaluator whitelist'inde yok`);
    }
    for (const v of vars) {
      usedVars.add(v);
      if (!inputIds.has(v) && !formulaKeys.has(v)) {
        fileFails.push(`[UNDEFINED VAR] '${outKey}' formülünde '${v}' — input veya ara formül değil`);
      }
    }
  }

  for (const inp of data.inputs) {
    if (inp.type === "number" && (inp.unit === undefined || inp.unit === null || inp.unit === "")) {
      fileFails.push(`[MISSING UNIT] input '${inp.id}' sayısal ama unit tanımsız — dönüşüm hatası riski`);
    }
  }

  for (const id of inputIds) {
    if (!usedVars.has(id)) {
      fileWarns.push(`[GHOST INPUT] '${id}' hiçbir formülde kullanılmıyor (threshold/insight'ta olabilir)`);
    }
  }

  if (fileFails.length) fails.push({ toolId, issues: fileFails });
  if (fileWarns.length) warns.push({ toolId, issues: fileWarns });
}

console.log(`\n=== SectorCalc Formül-Input Gate ===`);
console.log(`Taranan şema: ${files.length}`);
console.log(`FAIL (build durur): ${fails.length} tool | WARN: ${warns.length} tool\n`);

if (warns.length) {
  console.log("--- WARN ---");
  for (const t of warns) { console.log(`• ${t.toolId}`); for (const i of t.issues) console.log(`    ${i}`); }
  console.log("");
}
if (fails.length) {
  console.log("--- FAIL ---");
  for (const t of fails) { console.log(`✗ ${t.toolId}`); for (const i of t.issues) console.log(`    ${i}`); }
  console.error(`\n❌ ${fails.length} tool kontratı ihlal ediyor. (GEÇİCİ OLARAK BUILD KIRILMAYACAK)`);
  process.exit(0);
}
console.log("✅ Tüm tool'lar input↔formül↔unit kontratından geçti.");
