#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];
const CALC_ROOTS = new Set([
  "freeToolInputs",
  "freeToolUi",
  "smartForm",
  "calculator",
  "premiumSchema",
  "toolDefinitions",
  "reports",
  "seoPages",
  "freeTrafficCatalog",
]);

function leaves(obj, path = []) {
  if (typeof obj === "string") return [{ path: path.join("."), v: obj }];
  if (Array.isArray(obj)) return obj.flatMap((x, i) => leaves(x, [...path, String(i)]));
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [];
}

function getAt(obj, path) {
  let cur = obj;
  for (const p of path.split(".")) {
    cur = cur?.[p];
    if (cur === undefined) return undefined;
  }
  return cur;
}

const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const enLeaves = leaves(en);

for (const locale of LOCALES) {
  const data = JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
  const leaks = [];
  for (const { path, v } of enLeaves) {
    const root = path.split(".")[0];
    if (CALC_ROOTS.has(root)) continue;
    const cur = getAt(data, path);
    if (typeof cur === "string" && cur === v && v.length > 6 && /[a-zA-Z]{4,}/.test(v)) {
      leaks.push(path);
    }
  }
  console.log(`${locale}: ${leaks.length} EN-identical (non-calc)`);
}
