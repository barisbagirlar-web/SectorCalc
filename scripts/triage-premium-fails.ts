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

  for (const step of schema.formulaPipeline || []) {
    const meta = FORMULA_REGISTRY_META.find((m) => m.formulaId === step.formulaId);
    if (!meta) continue;

    const req = meta.requiredInputs || [];
    for (const arg of req) {
      const mapped = (step.inputMap && step.inputMap[arg]);
      if (!mapped) continue;
      
      if (valid.has(mapped)) continue;
      
      const cand = bestMatch(mapped, inputIds.filter((id: string) => !req.includes(id)));
      if (cand.s >= 0.55) {
        R.push({ tool, formulaId: step.formulaId, arg, wrong: mapped, fix: cand.p, score: cand.s.toFixed(2) });
      } else {
        M.push({ tool, formulaId: step.formulaId, arg, wrong: mapped });
      }
    }
    if (step.outputId) valid.add(step.outputId);
  }
}

R.sort((a, b) => b.score - a.score);
console.log(`\n=== Premium FAIL Triage ===`);
console.log(`CLASS R (remap, cheap): ${R.length} | CLASS M (missing input, hard): ${M.length}\n`);
console.log("--- CLASS R: fix inputMap RHS ---");
for (const r of R) console.log(`  ${r.tool} :: ${r.formulaId}\n     '${r.wrong}' -> '${r.fix}'  (similarity ${r.score})`);
console.log("\n--- CLASS M: ADD input to schema (form changes) ---");
for (const m of M) console.log(`  ${m.tool} :: ${m.formulaId} -> '${m.wrong}' (no match)`);
