import fs from "fs";
const reg = fs.readFileSync("src/lib/features/premium-schema/formula-registry.ts", "utf8");
const percentSmell = new Set();
for (const m of reg.matchAll(/1\s*[+\-]\s*num\(\s*(?:inputs|i)\s*,\s*["']([^"']+)["']\s*\)/g)) {
  const k = m[1];
  if (!new RegExp(`["']${k}["']\\s*\\)\\s*/\\s*100`).test(reg)) {
    percentSmell.add(k);
  }
}
console.log("Percent Smells:", Array.from(percentSmell));
