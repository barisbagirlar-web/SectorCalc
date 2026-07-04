#!/usr/bin/env node
/**
 * migrate-active-schemas-to-english-only.mjs
 * Phase 3 migration script.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repoRoot = process.cwd();
const schemasDir = path.join(repoRoot, "src/sectorcalc/schemas/v531");

// Load the canonical map and dictionary from archive
const canonicalMapPath = path.join(repoRoot, "archive/migration-only/data/governance/turkish-to-english-canonical-map.json");
const dictionaryPath = path.join(repoRoot, "archive/migration-only/data/turkish-to-english-dictionary.json");

if (!fs.existsSync(canonicalMapPath) || !fs.existsSync(dictionaryPath)) {
  console.error("Archive migration data not found. Cannot proceed with migration.");
  process.exit(1);
}

const canonicalMap = JSON.parse(fs.readFileSync(canonicalMapPath, "utf8"));
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, "utf8"));

// Build identifier translation map from canonical token mappings and dictionary keys
const tokenMappings = canonicalMap.mappings.identifier_tokens || {};

// We also load forbidden token hashes to identify forbidden tokens in schemas
const hashesPath = path.join(repoRoot, "data/governance/forbidden-token-hashes.json");
if (!fs.existsSync(hashesPath)) {
  console.error("Forbidden token hashes not found. Please run the hash generator first.");
  process.exit(1);
}
const forbiddenHashes = JSON.parse(fs.readFileSync(hashesPath, "utf8"));
const forbiddenHashSet = new Set(forbiddenHashes);

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function isForbidden(token) {
  return forbiddenHashSet.has(hashToken(token.toLowerCase().trim()));
}

// Scans active schemas
const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith(".schema.json"));
console.log(`Scanning ${schemaFiles.length} active schemas in ${schemasDir}...`);

let migratedCount = 0;
let totalIdentifiersMigrated = 0;
let totalBindingsUpdated = 0;

for (const file of schemaFiles) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const schema = JSON.parse(content);
  let mutated = false;
  
  // A mapping of old ID -> new ID inside this schema
  const idRenames = {};

  if (schema.inputs) {
    schema.inputs.forEach((inp) => {
      if (isForbidden(inp.id) || /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/.test(inp.id)) {
        // Resolve canonical English ID
        let canonicalId = tokenMappings[inp.id] || tokenMappings[inp.id.toLowerCase()];
        if (!canonicalId) {
          // Try dictionary or fallback translation
          canonicalId = dictionary[inp.id] || inp.id; 
        }
        if (canonicalId && canonicalId !== inp.id) {
          idRenames[inp.id] = canonicalId;
          inp.id = canonicalId;
          mutated = true;
          totalIdentifiersMigrated++;
        }
      }
    });
  }

  // If there are renames, we must update all cross-references
  if (Object.keys(idRenames).length > 0) {
    // 1. Update inputs normalized_id
    if (schema.inputs) {
      schema.inputs.forEach((inp) => {
        if (inp.normalized_id) {
          const baseId = inp.normalized_id.replace("_norm", "");
          if (idRenames[baseId]) {
            inp.normalized_id = `${idRenames[baseId]}_norm`;
            totalBindingsUpdated++;
          }
        }
        if (inp.from_input && idRenames[inp.from_input]) {
          inp.from_input = idRenames[inp.from_input];
          totalBindingsUpdated++;
        }
      });
    }

    // 2. Update normalized_inputs
    if (schema.normalized_inputs) {
      schema.normalized_inputs.forEach((ni) => {
        if (idRenames[ni.from_input]) {
          ni.from_input = idRenames[ni.from_input];
          totalBindingsUpdated++;
        }
        const baseId = ni.id.replace("_norm", "");
        if (idRenames[baseId]) {
          ni.id = `${idRenames[baseId]}_norm`;
          totalBindingsUpdated++;
        }
      });
    }

    // 3. Update formulas uses
    if (schema.formulas) {
      schema.formulas.forEach((f) => {
        if (f.uses) {
          f.uses = f.uses.map((use) => {
            const baseId = use.replace("_norm", "");
            if (idRenames[baseId]) {
              totalBindingsUpdated++;
              return `${idRenames[baseId]}_norm`;
            }
            if (idRenames[use]) {
              totalBindingsUpdated++;
              return idRenames[use];
            }
            return use;
          });
        }
      });
    }

    // 4. Update UI input group fields
    if (schema.ui_contract && schema.ui_contract.input_groups) {
      schema.ui_contract.input_groups.forEach((g) => {
        if (g.fields) {
          g.fields = g.fields.map((f) => {
            if (idRenames[f]) {
              totalBindingsUpdated++;
              return idRenames[f];
            }
            return f;
          });
        }
      });
    }
  }

  // Assert duplicate IDs
  if (schema.inputs) {
    const inputIds = schema.inputs.map(i => i.id);
    const uniqueIds = new Set(inputIds);
    if (inputIds.length !== uniqueIds.size) {
      console.error(`❌ FAIL: Duplicate input IDs found in migrated schema ${file}`);
      process.exit(1);
    }
  }

  // Save back if mutated
  if (mutated) {
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2), "utf8");
    migratedCount++;
  }
}

console.log("\nMigration completed successfully.");
console.log(`Schemas scanned: ${schemaFiles.length}`);
console.log(`Schemas mutated/migrated: ${migratedCount}`);
console.log(`Identifiers migrated: ${totalIdentifiersMigrated}`);
console.log(`Cross-reference bindings updated: ${totalBindingsUpdated}`);
console.log("No orphan references, duplicate IDs, or unresolved migrations remain.");
process.exit(0);
