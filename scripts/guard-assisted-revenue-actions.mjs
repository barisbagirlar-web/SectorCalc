#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const rootDirs = ["src/app", "src/components", "src/sectorcalc"];
const ctaPhrases = [
  "Request assisted dossier",
  "Book review",
  "Submit source files",
  "Contact for quote",
  "Start assisted analysis",
];

const commercialPhrases = [
  "source data required",
  "assisted review required",
  "not instant execution",
  "not available as instant execution",
  "commercial next step",
  "expected deliverable",
];

function collectFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const item of readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (["node_modules", ".next", "archive", "backup", "quarantine"].includes(item)) continue;
      collectFiles(full, out);
    } else if (/\.(ts|tsx|js|jsx|json|mdx?)$/.test(item)) {
      out.push(full);
    }
  }
  return out;
}

const files = rootDirs.flatMap((dir) => collectFiles(dir));
const text = files.map((file) => readFileSync(file, "utf8")).join("\n");

const hasCta = ctaPhrases.some((phrase) => text.includes(phrase));
const hasCommercialMeaning = commercialPhrases.some((phrase) => text.toLowerCase().includes(phrase.toLowerCase()));

if (!hasCta || !hasCommercialMeaning) {
  console.log("ASSISTED_REVENUE_ACTIONS=FAIL");
  console.log("ASSISTED_UI_CTA=0/15");
  console.log("BLOCKERS:");
  if (!hasCta) console.log("- visible assisted revenue CTA phrase not found in public UI/source tree");
  if (!hasCommercialMeaning) console.log("- assisted commercial meaning not found in public UI/source tree");
  process.exit(1);
}

console.log("ASSISTED_REVENUE_ACTIONS=PASS");
console.log("ASSISTED_UI_CTA=15/15");
console.log("BLOCKERS=NONE");
