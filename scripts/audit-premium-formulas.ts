import fs from "fs";
import path from "path";
import { getAllPremiumSchemas } from "../src/lib/features/premium-schema/schema-registry";
import { FORMULA_META } from "../src/lib/features/premium-schema/formula-registry";

function runAudit() {
  const schemas = getAllPremiumSchemas();
  const fails: any[] = [];
  const warns: any[] = [];
  const reviews: any[] = [];

  // Extract percent smell from registry source code
  const regSrc = fs.readFileSync(path.join(process.cwd(), "src/lib/features/premium-schema/formula-registry.ts"), "utf8");
  const percentSmellMetaKeys = new Set<string>();
  
  // To map from registry keys back to formula requiredInputs, it's a bit tricky because
  // the regex finds the variable name used inside num(i, "key").
  // So we just collect all keys that are used in (1 +/- key) patterns.
  for (const m of regSrc.matchAll(/1\s*[+\-]\s*num\(\s*(?:inputs|i)\s*,\s*["']([^"']+)["']\s*\)/g)) {
    const k = m[1];
    if (!new RegExp(`["']${k}["']\\s*\\)\\s*/\\s*100`).test(regSrc)) {
      percentSmellMetaKeys.add(k);
    }
  }

  for (const schema of schemas) {
    const toolId = schema.id;
    const fileFails: string[] = [];
    const fileWarns: string[] = [];
    const fileReviews: string[] = [];

    const definedVars = new Set(schema.inputs.map((i: any) => i.id));
    const usedInputIds = new Set<string>();
    const usedVars = new Set<string>();

    for (const step of schema.formulaPipeline || []) {
      const { formulaId, inputMap, outputId } = step;
      const meta = FORMULA_META[formulaId];

      if (!meta) {
        fileFails.push(`[UNKNOWN FN] Formula ID '${formulaId}' not found in registry`);
        definedVars.add(outputId);
        continue;
      }

      for (const req of meta.requiredInputs || []) {
        const mappedVar = inputMap[req];
        if (!mappedVar) {
          fileFails.push(`[UNDEFINED VAR] Formula '${formulaId}' requires input '${req}', but it is missing from inputMap`);
        } else {
          usedVars.add(mappedVar);
          if (definedVars.has(mappedVar)) {
            // It's a valid mapped var
            // Check if it's one of the original inputs
            if (schema.inputs.some((i: any) => i.id === mappedVar)) {
              usedInputIds.add(mappedVar);
            }
          } else {
            fileFails.push(`[UNDEFINED VAR] Formula '${formulaId}' uses mapped variable '${mappedVar}', which is neither an input nor a previous output`);
          }
          
          // Check percent smell
          if (percentSmellMetaKeys.has(req)) {
            const schemaInput = schema.inputs.find((i: any) => i.id === mappedVar);
            if (schemaInput && schemaInput.unit !== "percent" && schemaInput.unit !== "fraction") {
               fileReviews.push(`[PERCENT SMELL] '${mappedVar}' maps to '${req}' in '${formulaId}' — uses (1±x) pattern, but unit is '${schemaInput.unit || "—"}' (CLASS C candidate)`);
            }
          }
        }
      }
      
      // Output becomes available for next formulas
      definedVars.add(outputId);
    }

    for (const inp of schema.inputs) {
      if (inp.type === "number" && !inp.unit) {
        fileFails.push(`[MISSING UNIT] Input '${inp.id}' is numeric but has no unit — risk of conversion error`);
      }
      if (!usedInputIds.has(inp.id)) {
        fileWarns.push(`[GHOST INPUT] '${inp.id}' is not used in any formula (might be used in thresholds/insights)`);
      }
    }

    if (fileFails.length) fails.push({ toolId, issues: fileFails });
    if (fileWarns.length) warns.push({ toolId, issues: fileWarns });
    if (fileReviews.length) reviews.push({ toolId, issues: fileReviews });
  }

  console.log(`\n=== SectorCalc Premium Formula-Input Gate ===`);
  console.log(`Scanned schemas: ${schemas.length}`);
  console.log(`FAIL (build breaks): ${fails.length} tool | WARN: ${warns.length} tool | REVIEW: ${reviews.length} tool\n`);
  
  if (reviews.length) {
    console.log("--- REVIEW (verify with golden tests, do not blindly break) ---");
    for (const t of reviews) {
      console.log(`? ${t.toolId}`);
      for (const i of t.issues) console.log(`    ${i}`);
    }
    console.log("");
  }

  if (warns.length) {
    console.log("--- WARN ---");
    for (const t of warns) {
      console.log(`• ${t.toolId}`);
      for (const i of t.issues) console.log(`    ${i}`);
    }
    console.log("");
  }

  if (fails.length) {
    console.log("--- FAIL ---");
    for (const t of fails) {
      console.log(`✗ ${t.toolId}`);
      for (const i of t.issues) console.log(`    ${i}`);
    }
    console.error(`\n❌ ${fails.length} tools violate the contract.`);
    process.exit(1);
  }
  
  console.log("✅ All premium tools passed input↔formula↔unit contract.");
}

runAudit();
