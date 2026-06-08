#!/usr/bin/env npx tsx
/**
 * Release proof score CLI — scores existing proof JSON or runs release-gate-check.
 */

import { readFileSync } from "node:fs";

import { computeReleaseProofScore } from "@/lib/release/release-proof-score";
import type { ReleaseProofInput, ReleaseProofResult } from "@/lib/release/release-proof-types";
import { runReleaseGateCheck } from "./release-gate-check";

function readJsonFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function parseProofInput(raw: string): ReleaseProofInput {
  const parsed = JSON.parse(raw) as ReleaseProofInput | ReleaseProofResult;
  if ("input" in parsed && parsed.input) {
    return parsed.input;
  }
  return parsed as ReleaseProofInput;
}

async function main(): Promise<void> {
  const inputArg = process.argv.find((arg) => arg.startsWith("--input="))?.split("=")[1];
  const runCheck = process.argv.includes("--run-check");
  const jsonOnly = process.argv.includes("--json");

  let result: ReleaseProofResult;

  if (runCheck) {
    result = await runReleaseGateCheck();
  } else if (inputArg) {
    result = computeReleaseProofScore(parseProofInput(readFileSync(inputArg, "utf8")));
  } else if (!process.stdin.isTTY) {
    const raw = await readJsonFromStdin();
    result = computeReleaseProofScore(parseProofInput(raw));
  } else {
    console.error(
      "Usage: npx tsx scripts/release-proof-score.ts [--run-check] [--input=proof.json] [--json]",
    );
    process.exit(2);
  }

  if (!jsonOnly) {
    console.log(`Release verdict: ${result.verdict}`);
    console.log(`Proof score: ${result.score.proofScore}/${result.score.maxScore}`);
    console.log("");
  }

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.verdict === "SYSTEM_APPROVABLE" ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
