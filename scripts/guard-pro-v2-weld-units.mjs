// Guard: Verify weld field contract has correct unit families and forbidden units are absent.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const weldFile = resolve(root, "src/sectorcalc/pro-v2/proWeldFieldContract.ts");
const content = readFileSync(weldFile, "utf-8");

const checks = [
  // Required unit families present
  { pattern: "unitFamily: \"length\"", desc: "weld_length uses length family" },
  { pattern: "unitFamily: \"small_length\"", desc: "weld_throat uses small_length family" },
  { pattern: "unitFamily: \"material_cost\"", desc: "wire_cost uses material_cost family" },
  { pattern: "unitFamily: \"time\"", desc: "arc_time/total_job_time uses time family" },
  { pattern: "unitFamily: \"labor_rate\"", desc: "labor_rate uses labor_rate family" },
  { pattern: "unitFamily: \"shop_rate\"", desc: "shop_overhead_rate uses shop_rate family" },
  { pattern: "unitFamily: \"percentage\"", desc: "deposition_efficiency uses percentage family" },
  { pattern: "unitFamily: \"currency\"", desc: "planned_quote uses currency family" },

  // Specific allowed units for weld fields
  { pattern: '{ unit: "m", label: "m" }', desc: "weld_length allows m" },
  { pattern: '{ unit: "ft", label: "ft" }', desc: "weld_length allows ft" },
  { pattern: '{ unit: "in", label: "in" }', desc: "weld_length allows in" },
  { pattern: '{ unit: "mm", label: "mm" }', desc: "weld_length allows mm" },
  { pattern: '{ unit: "mile", label: "mi" }', desc: "weld_length allows mile" },

  // Weld throat specific
  { pattern: '{ unit: "mm", label: "mm" }', desc: "weld_throat allows mm" },
  { pattern: '{ unit: "µm", label: "µm" }', desc: "weld_throat allows µm" },

  // Wire cost units
  { pattern: '"USD/kg"', desc: "wire_cost allows USD/kg" },
  { pattern: '"USD/lb"', desc: "wire_cost allows USD/lb" },
  { pattern: '"TRY/kg"', desc: "wire_cost allows TRY/kg" },

  // Gas cost units
  { pattern: '"USD/min"', desc: "gas_cost allows USD/min" },
  { pattern: '"USD/h"', desc: "gas_cost allows USD/h" },

  // Percentage alternatives
  { pattern: '"basis points"', desc: "deposition_efficiency allows basis points" },
  { pattern: '"ppm"', desc: "deposition_efficiency allows ppm" },

  // Currencies
  { pattern: '"CHF"', desc: "planned_quote allows CHF" },
  { pattern: '"JPY"', desc: "planned_quote allows JPY" },
];

let allPass = true;
for (const check of checks) {
  if (!content.includes(check.pattern)) {
    console.error(`GUARD FAIL: Missing "${check.pattern}" (${check.desc})`);
    allPass = false;
  }
}

if (allPass) {
  console.log("GUARD PASS: Weld field contract unit validation OK");
} else {
  process.exit(1);
}
