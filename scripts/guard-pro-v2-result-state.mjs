// Guard: After Calculate, result panel must show result or structured error.
// Verify that "No result yet" cannot appear after server_ok / error states.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const formFile = resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx");
const content = readFileSync(formFile, "utf-8");

const checks = [
  { pattern: "insightReport &&", desc: "insight report guard present" },
  { pattern: "SERVER_OK", desc: "SERVER_OK state dispatches result" },
  { pattern: "SERVER_REVIEW", desc: "SERVER_REVIEW state dispatch" },
  { pattern: "SERVER_BLOCKED", desc: "SERVER_BLOCKED state dispatch" },
  { pattern: "CONTRACT_ERROR", desc: "CONTRACT_ERROR state dispatch" },
  { pattern: "NETWORK_ERROR", desc: "NETWORK_ERROR state dispatch" },
  { pattern: "CLIENT_BLOCKED", desc: "CLIENT_BLOCKED state dispatch" },
  { pattern: "AUTH_REQUIRED", desc: "AUTH_REQUIRED state dispatch" },
  { pattern: "ENTITLEMENT_REQUIRED", desc: "ENTITLEMENT_REQUIRED state dispatch" },
];

let allPass = true;
for (const check of checks) {
  if (!content.includes(check.pattern)) {
    console.error(`GUARD FAIL: Missing pattern "${check.pattern}" (${check.desc})`);
    allPass = false;
  }
}

// Verify no "No result yet" string in pro-v2 files
import { readdirSync, statSync } from "fs";
import { join } from "path";
function findFilesV2(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) results.push(...findFilesV2(full));
      else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) results.push(full);
    }
  } catch { /* skip */ }
  return results;
}
const proV2DirRoot = resolve(root, "src/sectorcalc/pro-v2");
const proV2Files = findFilesV2(proV2DirRoot).map((f) => f.replace(root + "/", ""));
for (const file of proV2Files) {
  const fileContent = readFileSync(resolve(root, file), "utf-8");
  if (fileContent.includes("No result yet")) {
    console.error(`GUARD FAIL: "${file}" contains 'No result yet' string`);
    allPass = false;
  }
}

if (allPass) {
  console.log("GUARD PASS: Result state coverage verified");
} else {
  process.exit(1);
}
