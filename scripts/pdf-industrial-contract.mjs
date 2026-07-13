#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";

const strict = process.argv.includes("--strict");
const artifactArgIndex = process.argv.indexOf("--artifact-dir");
const artifactDir = path.resolve(
  artifactArgIndex >= 0 && process.argv[artifactArgIndex + 1]
    ? process.argv[artifactArgIndex + 1]
    : process.env.BARIS_PDF_ARTIFACT_DIR || "artifacts/break-even-browser-e2e",
);

function fail(message) {
  console.error(`PDF_CONTRACT_FAIL=${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

async function inspectPdf(fileName) {
  const filePath = path.join(artifactDir, fileName);
  assert(existsSync(filePath), `missing PDF artifact: ${fileName}`);
  const bytes = readFileSync(filePath);
  assert(bytes.length >= 10_000, `${fileName}: suspiciously small PDF (${bytes.length} bytes)`);
  assert(bytes.length <= 25_000_000, `${fileName}: PDF exceeds 25 MB (${bytes.length} bytes)`);

  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const pageCount = pdf.getPageCount();
  assert(pageCount >= 1 && pageCount <= 20, `${fileName}: invalid page count ${pageCount}`);

  const title = pdf.getTitle() ?? "";
  const subject = pdf.getSubject() ?? "";
  const keywords = pdf.getKeywords() ?? "";
  assert(`${title} ${subject} ${keywords}`.includes("SectorCalc"), `${fileName}: metadata does not identify SectorCalc`);

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const hashPath = `${filePath}.sha256`;
  assert(existsSync(hashPath), `${fileName}: missing SHA-256 evidence`);
  const declaredHash = readFileSync(hashPath, "utf8").trim().split(/\s+/)[0];
  assert(declaredHash === sha256, `${fileName}: SHA-256 mismatch`);

  return { fileName, bytes: bytes.length, pageCount, title, sha256 };
}

if (!existsSync(artifactDir)) {
  if (strict) fail(`artifact directory not found: ${artifactDir}`);
  console.log(`PDF_CONTRACT_SKIP=artifact directory not found: ${artifactDir}`);
  process.exit(0);
}

const primary = await inspectPdf("break-even-survival-cash-report-a4.pdf");
const repeat = await inspectPdf("break-even-survival-cash-report-a4-repeat.pdf");

assert(primary.pageCount === repeat.pageCount, "repeat PDF page count changed");
const sizeDelta = Math.abs(primary.bytes - repeat.bytes);
const allowedDelta = Math.max(4096, Math.round(primary.bytes * 0.02));
assert(sizeDelta <= allowedDelta, `repeat PDF size drift too high: delta=${sizeDelta};allowed=${allowedDelta}`);

const evidencePath = path.join(artifactDir, "pdf-evidence.json");
assert(existsSync(evidencePath), "missing pdf-evidence.json");
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
assert(evidence?.format === "A4", "PDF evidence format is not A4");
assert(evidence?.primary?.sha256 === primary.sha256, "primary evidence hash does not match artifact");
assert(evidence?.repeat?.sha256 === repeat.sha256, "repeat evidence hash does not match artifact");
assert(evidence?.primary?.pageCount === primary.pageCount, "primary evidence page count mismatch");
assert(evidence?.repeat?.pageCount === repeat.pageCount, "repeat evidence page count mismatch");

console.log(
  `PDF_CONTRACT_RESULT=PASS;reports=2;pages=${primary.pageCount};` +
  `primaryBytes=${primary.bytes};repeatBytes=${repeat.bytes};sizeDelta=${sizeDelta}`,
);
