#!/usr/bin/env node
/**
 * Generate Turkish→English formula ID aliases.
 * Uses schema `name` field to match with tool comment headers
 * in user-premium-formulas.ts.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const USER_FILE = path.join(ROOT, "src/lib/premium-schema/user-premium-formulas.ts");

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\sçşğüöı]/g, " ")
    .replace(/ç/g,"c").replace(/ş/g,"s").replace(/ğ/g,"g")
    .replace(/ü/g,"u").replace(/ö/g,"o").replace(/ı/g,"i")
    .replace(/\s+/g, " ").trim().replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseUserFormulas() {
  const text = fs.readFileSync(USER_FILE, "utf8");
  const lines = text.split("\n");
  const re = /\/\/\s*─+\s*(.+?)\s+\((\d+)\s+formulas\)\s*─+/;
  const idRe = /id:\s*"(user\.[^"]+)"/;
  const groups = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(re);
    if (m) {
      if (current) groups.push(current);
      current = { name: m[1].trim(), normalized: normalize(m[1].trim()), count: parseInt(m[2],10), ids: [] };
      continue;
    }
    if (current) {
      const im = line.match(idRe);
      if (im) current.ids.push(im[1]);
    }
  }
  if (current) groups.push(current);
  return groups;
}

function parseSchemas() {
  const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".ts")).sort();
  const schemas = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf8");
    const idMatch = content.match(/name:\s*"([^"]+)"/);
    const displayName = idMatch ? idMatch[1] : file.replace(".ts", "");
    
    const re = /formulaId:\s*"(user\.[^"]+)"/g;
    const ids = [];
    let m;
    while ((m = re.exec(content)) !== null) ids.push(m[1]);
    
    if (ids.length > 0) {
      schemas.push({ 
        file, 
        displayName, 
        normalized: normalize(displayName), 
        ids, 
        count: ids.length, 
        content 
      });
    }
  }
  return schemas;
}

function main() {
  console.log("=== Generate Formula Aliases (name-based) ===\n");
  
  const groups = parseUserFormulas();
  const schemas = parseSchemas();
  
  console.log(`User groups: ${groups.length}`);
  console.log(`Schemas with user formulas: ${schemas.length}\n`);
  
  // Build lookup from normalized name
  const groupByNormalized = new Map();
  for (const g of groups) {
    const key = g.normalized;
    if (groupByNormalized.has(key)) {
      console.warn(`  DUPLICATE normalized key: "${key}"`);
    }
    groupByNormalized.set(key, g);
  }
  
  const aliases = [];
  const stats = { exact: 0, aliased: 0, unmatched: [] };
  
  for (const schema of schemas) {
    let matchedGroup = groupByNormalized.get(schema.normalized);
    
    // Try partial match if exact fails
    if (!matchedGroup) {
      for (const [key, group] of groupByNormalized) {
        if (schema.normalized.includes(key) || key.includes(schema.normalized)) {
          if (group.ids.length === schema.count) {
            matchedGroup = group;
            console.warn(`  PARTIAL: ${schema.file} (${schema.displayName}) ↔ ${group.name}`);
            break;
          }
        }
      }
    }
    
    if (!matchedGroup) {
      stats.unmatched.push(schema.file);
      console.error(`  UNMATCHED: ${schema.file} (${schema.displayName})`);
      continue;
    }
    
    let changed = 0;
    for (let j = 0; j < schema.ids.length; j++) {
      const englishId = j < matchedGroup.ids.length ? matchedGroup.ids[j] : matchedGroup.ids[matchedGroup.ids.length - 1];
      if (schema.ids[j] !== englishId) {
        aliases.push(`  "${schema.ids[j]}": "${englishId}"`);
        changed++;
      }
    }
    
    if (changed > 0) stats.aliased++;
    else stats.exact++;
  }
  
  console.log(`\nResults:`);
  console.log(`  Already matching: ${stats.exact}`);
  console.log(`  Will be aliased:  ${stats.aliased}`);
  console.log(`  Unmatched:        ${stats.unmatched.length}`);
  if (stats.unmatched.length > 0) {
    console.log(`  Unmatched files:  ${stats.unmatched.join(", ")}`);
  }
  console.log(`  Alias entries:    ${aliases.length}`);
  
  // Write aliases
  const output = `// Auto-generated Turkish→English formula ID aliases
// ${aliases.length} entries, ${stats.aliased} schemas with changes
// Generated: ${new Date().toISOString()}
export const SCHEMA_TO_ENGLISH_ALIASES: Record<string, string> = {
${aliases.join(",\n")}
};`;
  
  fs.writeFileSync(path.join(ROOT, "generated", "formula-aliases.ts"), output);
  console.log(`\n✓ Written to generated/formula-aliases.ts`);
}

main();
