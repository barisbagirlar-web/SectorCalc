#!/usr/bin/env node
// SectorCalc Guard: No Duplicate or Empty Input Controls
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const formContent = fs.readFileSync(path.join(ROOT, "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx"), "utf8");
const failures = [];

// Check field grid uses .map with key={field.id}
if (!formContent.includes("key={field.id}")) {
  failures.push("Field map must use field.id as React key");
}
// Check renderValueInput exists
if (!formContent.includes("function renderValueInput")) {
  failures.push("renderValueInput function not found");
}
// Check CalculatorInputField renders exactly one value input
const fieldFnMatch = formContent.match(/function CalculatorInputField\([\s\S]*?(?=\nfunction |\n\/\/|$)/);
if (fieldFnMatch) {
  const fieldFn = fieldFnMatch[0];
  const renderValueCalls = (fieldFn.match(/renderValueInput/g) || []).length;
  if (renderValueCalls !== 1) {
    failures.push(`Expected 1 renderValueInput call, found ${renderValueCalls}`);
  }
}

if (failures.length > 0) {
  console.error("NO_DUPLICATE_EMPTY_INPUTS=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("NO_DUPLICATE_EMPTY_INPUTS=PASS");
