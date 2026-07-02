import fs from "fs";
import { globSync } from "glob";
import path from "path";

// 1. FREE Schemas (JSON)
const freeSchemas = globSync("generated/schemas/**/*.json");
let freeCount = 0;
for (const file of freeSchemas) {
  const content = fs.readFileSync(file, "utf8");
  const data = JSON.parse(content);
  let changed = false;
  if (Array.isArray(data.inputs)) {
    for (const inp of data.inputs) {
      if (inp.type === "number" && !inp.unit) {
        inp.unit = "scalar";
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    freeCount++;
  }
}
console.log(`Injected units into ${freeCount} free schemas.`);

// 2. PRO Schemas (TS)
const proSchemas = globSync("src/lib/features/premium-schema/schemas/*.ts");
let proCount = 0;
for (const file of proSchemas) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('unit: ""')) {
      lines[i] = lines[i].replace('unit: ""', 'unit: "scalar"');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, lines.join("\n"));
    proCount++;
  }
}
console.log(`Injected units into ${proCount} premium schemas.`);
