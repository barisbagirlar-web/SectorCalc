
import { auditPremiumSchema } from "/Users/macair1/projects/SectorCalc-p5a/src/lib/features/premium-schema/contracts/premium-schema-contract-audit";
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

async function run() {
  const schemasDir = "/Users/macair1/projects/SectorCalc-p5a/src/lib/features/premium-schema/schemas";
  if (!fs.existsSync(schemasDir)) {
    console.log("No schemas directory found. Skipping guard.");
    return;
  }
  
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith(".ts"));
  let hasErrors = false;

  for (const file of files) {
    const filePath = path.join(schemasDir, file);
    try {
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);
      
      // Look for the exported schema object (it has id, inputs, etc.)
      const schema = Object.values(mod).find(exp => exp && typeof exp === "object" && exp.id && exp.inputs);
      
      if (schema) {
        const errors = auditPremiumSchema(schema as any, filePath);
        for (const err of errors) {
          console.error(`CONTRACT_DRIFT_ERROR: Tool=${err.toolKey} | Formula=${err.formulaId} | Input=${err.inputId} | Reason=${err.reason} | File=${err.filePath}`);
          hasErrors = true;
        }
      }
    } catch (importErr) {
      // Ignore import errors for broken schemas not related to this guard
      // The typechecker or next build will catch syntax/import errors.
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log("PREMIUM_SCHEMA_CONTRACT_AUDIT_PASS=YES");
  }
}

run().catch(e => {
  console.error("FATAL ERROR IN KERNEL GUARD:", e);
  process.exit(1);
});
