#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve(process.cwd(), "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
let source = readFileSync(path, "utf8");

function replaceOnce(from, to, label) {
  const first = source.indexOf(from);
  const last = source.lastIndexOf(from);
  if (first < 0 || first !== last) {
    throw new Error(`${label}: expected exactly one match`);
  }
  source = source.slice(0, first) + to + source.slice(first + from.length);
}

replaceOnce(
  `  audit: "Audit view — source verification, traceability, and report controls.",
};`,
  `  audit: "Audit view — source verification, traceability, and report controls.",
  diagnostic: "Diagnostic view — blockers, normalization, and execution-state diagnostics.",
};`,
  "diagnostic profile copy",
);

replaceOnce(
  `  audit: "Audit",
};`,
  `  audit: "Audit",
  diagnostic: "Diagnostic",
};`,
  "diagnostic profile label",
);

replaceOnce(
  `(["quick", "engineering", "cost", "audit"] as ProfileMode[])`,
  `(["quick", "engineering", "cost", "audit", "diagnostic"] as ProfileMode[])`,
  "diagnostic profile tab",
);

writeFileSync(path, source, "utf8");
console.log("V531_DIAGNOSTIC_PROFILE=ENABLED");
