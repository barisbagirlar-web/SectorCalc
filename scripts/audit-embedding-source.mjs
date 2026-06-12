#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

const jsonlPath = join(ROOT, "public/ai-embedding-source.jsonl");
if (!existsSync(jsonlPath)) {
  fail("public/ai-embedding-source.jsonl missing");
} else {
  const lines = readFileSync(jsonlPath, "utf8").split("\n").filter(Boolean);
  pass(`ai-embedding-source.jsonl exists (${lines.length} lines)`);

  let trCount = 0;
  let enCount = 0;
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (!obj.id || !obj.text || !obj.metadata?.chunkVersion) {
        fail("JSONL line missing id/text/metadata.chunkVersion");
        continue;
      }
      if (obj.metadata.locale === "tr") trCount += 1;
      if (obj.metadata.locale === "en") enCount += 1;
    } catch {
      fail("invalid JSONL line");
    }
  }

  if (trCount > 0) pass(`JSONL includes TR locale rows (${trCount})`);
  else fail("JSONL missing TR locale rows");

  if (enCount > 0) pass(`JSONL includes EN locale rows (${enCount})`);
  else fail("JSONL missing EN locale rows");
}

console.log(`\naudit:embedding-source — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
