import fs from "fs";
import { globSync } from "glob";

const schemaFiles = globSync("generated/schemas/**/*.json");
const trRegex = /[çğıöşüÇĞİÖŞÜ]/;
const findings = new Set();

for (const file of schemaFiles) {
  let content = fs.readFileSync(file, "utf8");
  try {
    const data = JSON.parse(content);
    // Find all 'en' keys
    const findEn = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'en' && typeof v === 'string' && trRegex.test(v)) {
          findings.add(v);
        } else {
          findEn(v);
        }
      }
    };
    findEn(data);
  } catch(e) {}
}

console.log(Array.from(findings).join('\n'));
