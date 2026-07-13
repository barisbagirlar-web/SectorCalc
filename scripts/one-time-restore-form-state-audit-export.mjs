#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve(process.cwd(), "src/sectorcalc/pro-form/form-state-machine.ts");
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
  `  ExecutionState,
  ProfileMode,`,
  `  ExecutionState,
  NormalizedInputAudit,
  ProfileMode,`,
  "NormalizedInputAudit import",
);

replaceOnce(
  `  return labels[state] ?? "Unknown state";
}
`,
  `  return labels[state] ?? "Unknown state";
}

export function createNormalizedAuditFromPreview(
  items: NormalizedPreviewItem[],
): NormalizedInputAudit[] {
  return items.map((item) => ({
    input_id: item.input_id,
    normalized_id: item.normalized_id,
    display_value: item.display_value,
    display_unit: item.display_unit,
    base_value: item.base_value,
    base_unit: item.base_unit,
    source_status: "CONTEXT_ONLY",
  }));
}
`,
  "createNormalizedAuditFromPreview export",
);

writeFileSync(path, source, "utf8");
console.log("FORM_STATE_NORMALIZED_AUDIT_EXPORT=RESTORED");
