import { execFileSync } from "node:child_process";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

const status = git(["status", "--porcelain"]).split("\n").filter(Boolean);

const deletedTracked = status
  .filter((line) => line.startsWith("D ") || line.startsWith(" D"))
  .map((line) => line.slice(3));

if (deletedTracked.length > 0) {
  console.error("REPO_GUARD_FAIL=TRACKED_DELETIONS_PRESENT");
  for (const file of deletedTracked) console.error(`DELETED_TRACKED=${file}`);
  process.exit(1);
}

const envDirty = status
  .map((line) => line.slice(3))
  .filter((file) => /(^|\/)\.env(\.|$)|(^|\/)\.env$/.test(file));

if (envDirty.length > 0) {
  console.error("REPO_GUARD_FAIL=ENV_FILE_DIRTY");
  for (const file of envDirty) console.error(`ENV_FILE=${file}`);
  process.exit(1);
}

console.log("REPO_GUARD_PASS=YES");
