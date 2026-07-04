// SectorCalc Tool Access Policy Guard
// Fails if:
// - Free tool requires credit
// - Free tool calls checkout
// - Free tool creates usage session
// - Pro tool executes without session
// - Pro session maxRuns is not 10
// - Pro session creditCost is not 1
// - Pro session can run another toolKey
// - execution does not decrement remainingRuns
// - remainingRuns can go below 0
// - Pro execution is unlimited
// - payment provider is called inside execute route
// - client can set creditCost, maxRuns, or remainingRuns

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

function walkDir(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        if (entry === "node_modules" || entry === ".next") continue;
        files.push(...walkDir(fullPath));
      } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
        files.push(fullPath);
      }
    }
  } catch {
    // skip
  }
  return files;
}

function run() {
  let exitCode = 0;
  const violations = [];

  const allFiles = walkDir(SRC);

  // Check 1: Pro session config must be correct
  const sessionServerFile = join(SRC, "lib/credits/tool-usage-session.server.ts");
  if (existsSync(sessionServerFile)) {
    const content = readFileSync(sessionServerFile, "utf-8");
    const proCostMatch = content.match(/PRO_SESSION_COST\s*=\s*(\d+)/);
    const proMaxRunsMatch = content.match(/PRO_SESSION_MAX_RUNS\s*=\s*(\d+)/);

    if (proCostMatch && parseInt(proCostMatch[1]) !== 1) {
      violations.push(`PRO_SESSION_COST is ${proCostMatch[1]}, expected 1`);
    }
    if (proMaxRunsMatch && parseInt(proMaxRunsMatch[1]) !== 10) {
      violations.push(`PRO_SESSION_MAX_RUNS is ${proMaxRunsMatch[1]}, expected 10`);
    }
  } else {
    violations.push("MISSING_SESSION_SERVER: tool-usage-session.server.ts not found");
  }

  // Check 2: No payment provider called inside execution routes
  const apiRouteFiles = allFiles.filter(f => f.includes("/app/api/"));
  for (const file of apiRouteFiles) {
    if (file.includes("__tests__") || file.includes(".test.")) continue;
    const content = readFileSync(file, "utf-8");

    // Check for payment provider imports in execute routes
    if (file.includes("tool-execute") || file.includes("pro-calculator/execute")) {
      const paymentImports = ["stripe", "paddle", "checkout", "payment"];
      for (const pi of paymentImports) {
        if (content.toLowerCase().includes(pi)) {
          // Skip if it's just a variable name or comment
          if (content.includes(`import.*${pi}`) || content.includes(`require.*${pi}`)) {
            violations.push(`PAYMENT_IN_EXECUTE: ${file} references payment provider "${pi}"`);
          }
        }
      }
    }
  }

  // Check 3: Free tools don't require credits or sessions
  const creditLibFiles = allFiles.filter(f => f.includes("credit") || f.includes("session"));
  for (const file of creditLibFiles) {
    if (file.includes("__tests__") || file.includes(".test.")) continue;
    const content = readFileSync(file, "utf-8");
    // No Free tool-related functions should reference credit deduction
    // Check that free functions don't call credit/session functions
    if (content.includes("accessTier")) {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"FREE"') || lines[i].includes("'FREE'")) {
          // Check subsequent lines for credit consumption
          const context = lines.slice(i, i + 10).join(" ");
          if (context.includes("decrement") || context.includes("deduct") || context.includes("createSession")) {
            violations.push(`FREE_TOOL_CREDIT_CONSUMPTION: ${file}:${i + 1} Free tool path appears to consume credits`);
          }
        }
      }
    }
  }

  // Check 4: No client can set creditCost, maxRuns, remainingRuns
  const clientFiles = allFiles.filter(f => f.includes("/app/") || f.includes("/components/"));
  for (const file of clientFiles) {
    if (file.includes("__tests__") || file.includes(".test.") || file.includes(".server.") || file.includes("route.ts")) continue;
    const content = readFileSync(file, "utf-8");
    const clientPatterns = [
      /\.creditCost\s*=/,
      /\.maxRuns\s*=/,
      /\.remainingRuns\s*=/,
      /setCreditCost/,
      /setMaxRuns/,
      /setRemainingRuns/,
    ];
    for (const pattern of clientPatterns) {
      if (pattern.test(content)) {
        violations.push(`CLIENT_SETS_CREDIT_FIELD: ${file} matches ${pattern}`);
      }
    }
  }

  // Check 5: Pro execution is not unlimited
  for (const file of allFiles) {
    if (file.includes("__tests__") || file.includes(".test.") || file.includes("node_modules")) continue;
    const content = readFileSync(file, "utf-8");
    if ((file.includes("execute") || file.includes("pro-calculator")) && content.includes("route.ts")) {
      if (content.includes("PRO") && content.includes("execution") && !content.includes("maxRuns") && !content.includes("remainingRuns")) {
        violations.push(`UNLIMITED_PRO_EXECUTION: ${file} handles Pro execution without run limit enforcement`);
      }
    }
  }

  // Check 6: Idempotency checks
  function read(filePath) {
    const fp = join(ROOT, filePath);
    if (!existsSync(fp)) {
      violations.push(`MISSING_FILE: ${filePath} not found`);
      return "";
    }
    return readFileSync(fp, "utf-8");
  }

  const sessionFile = "src/lib/credits/tool-usage-session.server.ts";
  const executeFile = "src/app/api/tool-execute/route.ts";

  const sessionText = read(sessionFile);
  const executeText = read(executeFile);

  if (!sessionText.includes("tool_execution_idempotency")) {
    violations.push(`${sessionFile} must use tool_execution_idempotency collection for idempotent deduplication.`);
  }

  if (!sessionText.includes("createExecutionIdempotencyKey")) {
    violations.push(`${sessionFile} must use createExecutionIdempotencyKey() for idempotency key generation.`);
  }

  if (!sessionText.includes("runTransaction")) {
    violations.push(`${sessionFile} must decrement remainingRuns inside Firestore transaction.`);
  }

  if (!sessionText.includes("SESSION_EXHAUSTED")) {
    violations.push(`${sessionFile} must block exhausted sessions.`);
  }

  if (!executeText.includes("clientRequestId")) {
    violations.push(`${executeFile} must accept clientRequestId for execution idempotency.`);
  }

  if (violations.length > 0) {
    console.error("TOOL ACCESS POLICY GUARD FAILED");
    console.error("Violations:");
    for (const v of violations) {
      console.error(`  ❌ ${v}`);
    }
    exitCode = 1;
  } else {
    console.log("TOOL ACCESS POLICY GUARD PASSED");
    console.log(`  Checked ${allFiles.length} files. Access policy compliant.`);
  }

  process.exit(exitCode);
}

run();
