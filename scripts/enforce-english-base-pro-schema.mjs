import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

const schemaFiles = globSync(["data/pro-tools/**/*.json", "data/pro-tools-universal/**/*.json"]);
let updatedCount = 0;

for (const file of schemaFiles) {
  const content = fs.readFileSync(file, "utf8");
  let data;
  try {
    data = JSON.parse(content);
  } catch(e) {
    continue;
  }
  
  let changed = false;

  // Process inputs
  if (Array.isArray(data.inputs)) {
    for (const input of data.inputs) {
      const fields = ["label", "placeholder", "helper", "businessContext"];
      for (const field of fields) {
        const i18nField = `${field}_i18n`;
        if (input[i18nField] && input[i18nField].en) {
          if (input[field] !== input[i18nField].en) {
            input[field] = input[i18nField].en;
            changed = true;
          }
        }
      }
      // If it has options
      if (Array.isArray(input.options)) {
        for (const opt of input.options) {
          if (opt.label_i18n && opt.label_i18n.en && opt.label !== opt.label_i18n.en) {
            opt.label = opt.label_i18n.en;
            changed = true;
          }
        }
      }
    }
  }

  // Process outputs
  if (data.outputs) {
    if (data.outputs.breakdown_i18n && data.outputs.breakdown) {
      for (const key of Object.keys(data.outputs.breakdown)) {
        if (data.outputs.breakdown_i18n[key] && data.outputs.breakdown_i18n[key].en) {
          if (data.outputs.breakdown[key] !== data.outputs.breakdown_i18n[key].en) {
            data.outputs.breakdown[key] = data.outputs.breakdown_i18n[key].en;
            changed = true;
          }
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
    updatedCount++;
  }
}

console.log(`Enforced English base strings in ${updatedCount} PRO schema files.`);
