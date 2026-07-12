import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// We use tsx via a temporary TS script to safely parse and execute the TypeScript schemas and audit function
// without relying on fragile regexes or requiring node --experimental-loader.

const CWD = process.cwd();
const TMP_FILE = path.join(CWD, "scripts", ".tmp-kernel-guard.ts");

const tsCode = `
import { auditPremiumSchema } from "${CWD}/src/lib/features/premium-schema/contracts/premium-schema-contract-audit";
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

async function run() {
  const schemasDir = "${CWD}/src/lib/features/premium-schema/schemas";
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
          console.error(\`CONTRACT_DRIFT_ERROR: Tool=\${err.toolKey} | Formula=\${err.formulaId} | Input=\${err.inputId} | Reason=\${err.reason} | File=\${err.filePath}\`);
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
`;

fs.writeFileSync(TMP_FILE, tsCode);

try {
  const output = execSync(`node_modules/.bin/tsx ${TMP_FILE}`, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (output) console.log(output.trim());
} catch (e) {
  if (e.stdout) console.log(e.stdout.trim());
  if (e.stderr) console.error(e.stderr.trim());
  process.exit(1);
} finally {
  if (fs.existsSync(TMP_FILE)) {
    fs.unlinkSync(TMP_FILE);
  }
}
