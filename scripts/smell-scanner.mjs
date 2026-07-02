#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

async function run() {
  const files = globSync(path.join(process.cwd(), "src/**/formula-registry.*"));
  const text = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const lineAt = (idx) => text.slice(0, idx).split("\n").length;
  const nearestId = (idx) => {
    const before = text.slice(0, idx);
    const m = [...before.matchAll(/["']([a-z_]+\.[a-z0-9_]+)["']/gi)].pop();
    return m ? m[1] : "(unknown fn)";
  };

  const hits = [];
  const push = (kind, idx, detail) => hits.push({ kind, line: lineAt(idx), id: nearestId(idx), detail });

  // DUP ADD
  for (const m of text.matchAll(/num\(\s*i\s*,\s*["'](\w+)["']\s*\)\s*\+\s*num\(\s*i\s*,\s*["']\1["']\s*\)/g))
    push("DUP ADD", m.index, `${m[1]} + ${m[1]}`);
  // SELF SQ
  for (const m of text.matchAll(/num\(\s*i\s*,\s*["'](\w+)["']\s*\)\s*\*\s*num\(\s*i\s*,\s*["']\1["']\s*\)/g))
    push("SELF SQ", m.index, `${m[1]} * ${m[1]}`);

  // DEAD REQ + TRIVIAL: meta ile (varsa)
  try {
    const { FORMULA_REGISTRY_META } = await import("file://" + path.join(process.cwd(), "src/lib/features/premium-schema/formula-registry.ts"));
    for (const id of Object.keys(FORMULA_REGISTRY_META)) {
      const meta = FORMULA_REGISTRY_META[id];
      if (!meta || !id) continue;
      const re = new RegExp(`["']${id.replace(".", "\\.")}["'][\\s\\S]{0,600}?fn:\\s*\\(i\\)\\s*=>([\\s\\S]{0,400}?)\\n`, "");
      const bm = re.exec(text); if (!bm) continue;
      const body = bm[1];
      const refs = new Set([...body.matchAll(/num\(\s*i\s*,\s*["'](\w+)["']\s*\)/g)].map((x) => x[1]));
      for (const req of meta.requiredInputs || [])
        if (!refs.has(req)) push("DEAD REQ", bm.index, `${id}: '${req}' required ama gövdede yok`);
      if ((meta.requiredInputs || []).length >= 3 && refs.size < 2)
        push("TRIVIAL", bm.index, `${id}: ${meta.requiredInputs.length} required ama ${refs.size} kullanılıyor`);
    }
  } catch (e) { console.log(`(meta yüklenemedi, DEAD REQ/TRIVIAL atlandı: ${e.message})`); }

  const order = { "DUP ADD": 0, "SELF SQ": 1, "TRIVIAL": 2, "DEAD REQ": 3 };
  hits.sort((a, b) => order[a.kind] - order[b.kind] || a.line - b.line);

  console.log(`\n=== Formula Hallucination Smell Scan ===`);
  console.log(`Registry: ${files.join(", ")} | şüpheli: ${hits.length}\n`);
  for (const h of hits) console.log(`  [${h.kind}] L${h.line}  ${h.id}\n     ${h.detail}`);
  console.log(`\nNOT: Bunlar KOKU, kanıt değil. Her şüpheliye atıflı-referanslı golden yaz.`);
}

run();
