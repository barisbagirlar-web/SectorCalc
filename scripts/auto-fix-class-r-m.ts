import fs from "fs";
import path from "path";
import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { FORMULA_REGISTRY_META } from "../src/lib/features/premium-schema/formula-registry";

function sim(a: string, b: string) {
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a === b) return 1;
  const bg = (s: string) => { const g = []; for (let i = 0; i < s.length - 1; i++) g.push(s.slice(i, i + 2)); return g; };
  const A = bg(a), B = bg(b); if (!A.length || !B.length) return 0;
  const m = new Map(); for (const g of A) m.set(g, (m.get(g) || 0) + 1);
  let hit = 0; for (const g of B) if (m.get(g) > 0) { hit++; m.set(g, m.get(g) - 1); }
  return (2 * hit) / (A.length + B.length);
}

const bestMatch = (arg: string, pool: string[]) => {
  const matches = pool.map((p) => ({ p, s: sim(arg, p) })).sort((x, y) => y.s - x.s);
  return matches[0] || { p: null, s: 0 };
};

const schemas = getAllPremiumSchemas();
const R: any[] = [];
const M: any[] = [];

for (const schema of schemas) {
  const tool = schema.id;
  const inputIds = schema.inputs.map((x: any) => x.id);
  const valid = new Set(inputIds);
  const formulaDef = require("../src/lib/features/premium-schema/formula-registry").FORMULA_REGISTRY;

  for (const step of schema.formulaPipeline || []) {
    const fnDef = formulaDef[step.formulaId];
    if (!fnDef) continue;
    
    const fnStr = fnDef.toString();
    const requiredInputs = new Set<string>();
    for (const m of fnStr.matchAll(/num\(\s*(?:inputs|i)\s*,\s*["']([^"']+)["']\s*\)/g)) {
      requiredInputs.add(m[1]);
    }
    
    for (const arg of Array.from(requiredInputs)) {
      const mapped = (step.inputMap && step.inputMap[arg]);
      if (!mapped) continue;
      
      if (valid.has(mapped)) continue;
      
      const cand = bestMatch(mapped, inputIds);
      if (cand.s >= 0.55) {
        R.push({ tool, formulaId: step.formulaId, arg, wrong: mapped, fix: cand.p, score: cand.s });
      } else {
        M.push({ tool, formulaId: step.formulaId, arg, wrong: mapped });
      }
    }
    if (step.outputId) valid.add(step.outputId);
  }
}

console.log(`Found ${R.length} Class R and ${M.length} Class M`);

// Auto-fix Class R
for (const r of R) {
  const p = path.join(__dirname, `../src/lib/features/premium-schema/schemas/${r.tool}.ts`);
  if (!fs.existsSync(p)) continue;
  let txt = fs.readFileSync(p, "utf8");
  
  const regex = new RegExp(`${r.arg}\\s*:\\s*["']${r.wrong}["']`, "g");
  txt = txt.replace(regex, `${r.arg}: "${r.fix}"`);
  fs.writeFileSync(p, txt);
  console.log(`Fixed Class R in ${r.tool}: ${r.arg}: "${r.wrong}" -> "${r.fix}"`);
}

// Auto-fix Class M
for (const m of M) {
  const p = path.join(__dirname, `../src/lib/features/premium-schema/schemas/${m.tool}.ts`);
  if (!fs.existsSync(p)) continue;
  let txt = fs.readFileSync(p, "utf8");
  
  const label = m.wrong.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const newFieldStr = `
    {
      id: "${m.wrong}",
      label: "${label}",
      label_i18n: { en: "${label}" },
      type: "number",
      unit: "—",
      placeholder: "Enter ${label}",
      group: "General"
    },`;
    
  if (!txt.includes(`id: "${m.wrong}"`)) {
    txt = txt.replace(/inputs:\s*\[/, `inputs: [${newFieldStr}`);
    fs.writeFileSync(p, txt);
    console.log(`Fixed Class M in ${m.tool}: Added missing input "${m.wrong}"`);
  }
}
