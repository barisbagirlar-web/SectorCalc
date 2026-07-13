#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";

const strict = process.argv.includes("--strict");
const baseUrl = process.env.BARIS_PDF_BASE_URL || "http://127.0.0.1:3000";
const rawTargets = process.env.BARIS_PDF_TEST_TARGETS || "";
const cookie = process.env.BARIS_PDF_SESSION_COOKIE || "";
const outDir = path.resolve(process.env.BARIS_PDF_OUTPUT_DIR || "artifacts/pdf-industrial");

function fail(message) {
  console.error(`PDF_CONTRACT_FAIL=${message}`);
  process.exit(1);
}

function parseTargets(raw) {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("target list must be an array");
    return parsed;
  } catch (error) {
    fail(`BARIS_PDF_TEST_TARGETS must be JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const targets = parseTargets(rawTargets);
if (targets.length === 0) {
  if (strict) fail("no PDF test targets configured");
  console.log("PDF_CONTRACT_SKIP=no targets configured");
  process.exit(0);
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

if (cookie) {
  const url = new URL(baseUrl);
  await context.addCookies([
    {
      name: "__session",
      value: cookie,
      domain: url.hostname,
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "Lax",
    },
  ]);
}

const requiredText = [
  "SectorCalc",
  "Report ID",
  "Tool",
  "Formula",
  "Decision",
];

let passed = 0;
try {
  for (const target of targets) {
    if (!target || typeof target !== "object") fail("each target must be an object");
    const name = String(target.name || "report").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
    const url = new URL(String(target.url || ""), baseUrl).toString();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

    const reportSelector = target.readySelector || "[data-sectorcalc-report-ready='true']";
    await page.locator(reportSelector).waitFor({ state: "visible", timeout: 30_000 });

    const bodyText = await page.locator("body").innerText();
    for (const marker of [...requiredText, ...(target.requiredText || [])]) {
      if (!bodyText.includes(marker)) fail(`${name}: missing report marker: ${marker}`);
    }

    await page.emulateMedia({ media: "print" });
    const pdfPath = path.join(outDir, `${name}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: target.format || "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
      outline: true,
      margin: { top: "12mm", right: "10mm", bottom: "14mm", left: "10mm" },
    });

    const bytes = await fs.readFile(pdfPath);
    if (bytes.length < 10_000) fail(`${name}: suspiciously small PDF (${bytes.length} bytes)`);
    if (bytes.length > 25_000_000) fail(`${name}: PDF exceeds 25 MB (${bytes.length} bytes)`);

    const document = await PDFDocument.load(bytes, { updateMetadata: false });
    if (document.getPageCount() < 1) fail(`${name}: zero-page PDF`);

    const title = document.getTitle() || "";
    const subject = document.getSubject() || "";
    const keywords = document.getKeywords() || "";
    const metadataText = `${title} ${subject} ${keywords}`;
    if (!metadataText.includes("SectorCalc")) fail(`${name}: metadata does not identify SectorCalc`);

    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    await fs.writeFile(`${pdfPath}.sha256`, `${hash}  ${path.basename(pdfPath)}\n`, "utf8");

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        horizontal: root.scrollWidth > root.clientWidth + 2,
        reportOverflow: Array.from(document.querySelectorAll("[data-pdf-section]"))
          .filter((element) => element.scrollWidth > element.clientWidth + 2)
          .map((element) => element.getAttribute("data-pdf-section") || "unnamed"),
      };
    });
    if (overflow.horizontal || overflow.reportOverflow.length > 0) {
      fail(`${name}: print overflow detected (${overflow.reportOverflow.join(", ") || "document"})`);
    }

    await page.screenshot({ path: path.join(outDir, `${name}-first-page.png`), fullPage: false });
    await page.close();
    passed += 1;
    console.log(`PDF_CONTRACT_PASS=${name};pages=${document.getPageCount()};bytes=${bytes.length};sha256=${hash}`);
  }
} finally {
  await browser.close();
}

console.log(`PDF_CONTRACT_RESULT=PASS;reports=${passed};failures=0`);
