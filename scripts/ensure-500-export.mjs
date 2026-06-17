#!/usr/bin/env node
/** @deprecated Use scripts/finalize-next-build.mjs — kept for postbuild hook compatibility. */
import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/finalize-next-build.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
process.exit(result.status ?? 1);
