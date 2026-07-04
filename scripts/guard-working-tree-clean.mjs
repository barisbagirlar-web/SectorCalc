#!/usr/bin/env node

import { execFileSync } from "node:child_process";

function runGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message) {
  console.error("WORKING_TREE_CLEAN_GUARD=FAIL");
  console.error(message);
  process.exit(1);
}

function main() {
  const status = runGit(["status", "--short"]);

  if (status.length > 0) {
    fail(
      [
        "Working tree is not clean.",
        "Do not report FINAL_ACCEPTED while modified, staged, deleted, renamed, or untracked files exist.",
        "",
        "git status --short:",
        status,
        "",
        "Required resolution:",
        "1. Commit task-related files under the current task, or",
        "2. Revert/remove unrelated files, or",
        "3. Move unrelated work to a separate branch/stash before final acceptance.",
      ].join("\n"),
    );
  }

  console.log("WORKING_TREE_CLEAN_GUARD=PASS");
  console.log("git_status_short=EMPTY");
}

main();
