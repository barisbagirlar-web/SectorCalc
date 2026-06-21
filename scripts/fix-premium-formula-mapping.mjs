#!/usr/bin/env node
/**
 * Fix formula ID mapping between schemas (Turkish) and user-premium-formulas.ts (English).
 *
 * Strategy: Use POSITION-BASED matching since both were generated from the
 * same batch in the same order.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const USER_FORMULAS_FILE = path.join(ROOT, "src/lib/premium-schema/user-premium-formulas.ts");

function parseUserFormulas() {
  const text = fs.readFileSync(USER_FORMULAS_FILE, "utf8");
  const lines = text.split("\n");
  const toolCommentRe = /\/\/\s*─+\s*(.+?)\s+\((\d+)\s+formulas\)\s*─+/;
  const formulaIdRe = /id:\s*"(user\.[^"]+)"/;
  const groups = [];
  let currentGroup = null;
  for (const line of lines) {
    const commentMatch = line.match(toolCommentRe);
    if (commentMatch) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        toolName: commentMatch[1].trim(),
        expectedCount: parseInt(commentMatch[2], 10),
        formulaIds: [],
      };
      continue;
    }
    if (currentGroup) {
      const formulaMatch = line.match(formulaIdRe);
      if (formulaMatch) currentGroup.formulaIds.push(formulaMatch[1]);
    }
  }
  if (currentGroup && currentGroup.formulaIds.length > 0) groups.push(currentGroup);
  return groups;
}

function parseSchemas() {
  const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".ts")).sort();
  const schemas = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf8");
    const formulaIdRe = /formulaId:\s*"(user\.[^"]+)"/g;
    const formulaIds = [];
    let m;
    while ((m = formulaIdRe.exec(content)) !== null) formulaIds.push(m[1]);
    if (formulaIds.length > 0) schemas.push({ file, schemaId: file.replace(/\.ts$/, ""), formulaIds, count: formulaIds.length, content });
  }
  return schemas;
}

function buildAliasMappingByPosition(schemas, groups) {
  // Both are in the same order (schemas alphabetically, groups in file order)
  // Match by position if counts align, otherwise try next
  const aliases = [];
  const schemaChanges = []; // { schema, oldIds[], newIds[] }
  let groupIdx = 0;
  
  for (const schema of schemas) {
    // Find the matching user group by count and position
    let matchedGroup = null;
    let matchedGroupIdx = -1;
    
    // Try forward from current group position
    for (let gi = groupIdx; gi < groups.length; gi++) {
      if (groups[gi].formulaIds.length === schema.count || 
          Math.abs(groups[gi].formulaIds.length - schema.count) <= 2) {
        matchedGroup = groups[gi];
        matchedGroupIdx = gi;
        break;
      }
    }
    
    if (!matchedGroup) {
      // Try any group
      for (let gi = 0; gi < groups.length; gi++) {
        if (groups[gi].formulaIds.length === schema.count) {
          matchedGroup = groups[gi];
          matchedGroupIdx = gi;
          break;
        }
      }
    }
    
    if (!matchedGroup) {
      console.warn(`  WARN: No user group matches ${schema.file} (${schema.count} formulas)`);
      continue;
    }
    
    groupIdx = matchedGroupIdx + 1;
    
    // Build ID mapping
    const oldIds = schema.formulaIds;
    const newIds = matchedGroup.formulaIds.slice(0, oldIds.length);
    
    const schemaAliases = [];
    let hasChanges = false;
    for (let i = 0; i < oldIds.length; i++) {
      const newId = i < newIds.length ? newIds[i] : oldIds[i];
      if (oldIds[i] !== newId) {
        aliases.push(`  "${oldIds[i]}": "${newId}"`);
        schemaAliases.push({ old: oldIds[i], new: newId });
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      schemaChanges.push({ schema, aliases: schemaAliases, groupName: matchedGroup.toolName });
    }
  }
  
  return { aliases, schemaChanges };
}

function patchSchemaFiles(schemaChanges) {
  for (const change of schemaChanges) {
    let content = fs.readFileSync(path.join(SCHEMAS_DIR, change.schema.file), "utf8");
    for (const { old, new: newId } of change.aliases) {
      const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const before = content;
      content = content.replace(new RegExp(`"${escaped}"`), `"${newId}"`);
      if (content === before) {
        console.warn(`  FAILED: ${old} → ${newId} in ${change.schema.file}`);
      }
    }
    fs.writeFileSync(path.join(SCHEMAS_DIR, change.schema.file), content);
    console.log(`  ✓ ${change.schema.file} → ${change.groupName} (${change.aliases.length} IDs)`);
  }
}

function main() {
  console.log("=== Fix Premium Formula Mapping ===\n");
  
  const groups = parseUserFormulas();
  console.log(`User formula groups: ${groups.length}`);
  
  const schemas = parseSchemas();
  console.log(`Schemas with user.* formulas: ${schemas.length}\n`);
  
  const { aliases, schemaChanges } = buildAliasMappingByPosition(schemas, groups);
  
  console.log(`\nAliases to create: ${aliases.length}`);
  console.log(`Schemas to patch: ${schemaChanges.length}\n`);
  
  // First, write alias code for formula-registry.ts
  const aliasCode = `// Auto-generated Turkish→English formula ID aliases
const SCHEMA_TO_ENGLISH_ALIASES: Record<string, string> = {
${aliases.join(",\n")}
};`;
  fs.writeFileSync(path.join(ROOT, "generated", "formula-aliases.txt"), aliasCode);
  console.log("Alias code → generated/formula-aliases.txt");
  
  // Now patch schema files
  if (schemaChanges.length > 0) {
    console.log("\nPatching schema formulaPipeline IDs...");
    patchSchemaFiles(schemaChanges);
  }
  
  console.log("\nDone.");
}

main();
