#!/usr/bin/env node
/**
 * audit:load — Concurrent Load Test
 *
 * Simulates multiple users hitting the site simultaneously to measure
 * scalability. Fails if response time exceeds 10s under concurrency.
 *
 * Usage: node scripts/audit/audit-load.mjs --concurrency=100
 *        node scripts/audit/audit-load.mjs --concurrency=50 --duration=30
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/load-report.json");

const TEST_ROUTES = ["/", "/tr", "/pricing", "/free-tools", "/premium-tools",
  "/tools/premium/cnc-quote-risk-analyzer", "/tools/free/roi-calculator"];

const TIMEOUT_MS = 30000;
const MAX_ACCEPTABLE_MS = 10000; // 10s spec
const WARN_MS = 3000;

function parseArg(name, defaultVal) {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`));
  return arg ? parseInt(arg.split("=")[1], 10) : defaultVal;
}

async function fetchWithTiming(url) {
  const start = Date.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const duration = Date.now() - start;
    return { ok: response.ok, status: response.status, duration, error: null };
  } catch (err) {
    return { ok: false, status: 0, duration: Date.now() - start, error: err.message };
  }
}

async function main() {
  const concurrency = parseArg("concurrency", 100);
  const duration = parseArg("duration", 15);
  const baseUrl = getBaseUrl();

  console.log("=".repeat(60));
  console.log("LOAD TEST — Concurrent User Simulation");
  console.log(`Concurrency: ${concurrency} users`);
  console.log(`Duration: ${duration}s`);
  console.log(`Target: ${baseUrl}`);
  console.log("=".repeat(60));

  const allResults = [];
  const startTime = Date.now();
  const deadline = startTime + (duration * 1000);
  let activeRequests = 0;
  let totalRequests = 0;
  let timeouts = 0;
  let errors = 0;

  // Launch concurrent requests in waves
  while (Date.now() < deadline) {
    const batch = [];
    const batchSize = Math.min(concurrency - activeRequests, 20);
    if (batchSize <= 0) {
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    for (let i = 0; i < batchSize; i++) {
      const route = TEST_ROUTES[Math.floor(Math.random() * TEST_ROUTES.length)];
      const url = `${baseUrl}${route}`;
      activeRequests++;
      totalRequests++;
      batch.push(
        fetchWithTiming(url).then(result => {
          activeRequests--;
          return { route, url, ...result };
        })
      );
    }

    const batchResults = await Promise.all(batch);
    allResults.push(...batchResults);
  }

  // Wait for remaining active requests
  while (activeRequests > 0) {
    await new Promise(r => setTimeout(r, 200));
  }

  // Analyze
  const durations = allResults.map(r => r.duration);
  const successful = allResults.filter(r => r.ok);
  const failed = allResults.filter(r => !r.ok);
  const slow = allResults.filter(r => r.duration > WARN_MS);
  const critical = allResults.filter(r => r.duration > MAX_ACCEPTABLE_MS);

  const avgMs = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;
  const sorted = [...durations].sort((a, b) => a - b);
  const p50Ms = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95Ms = sorted[Math.floor(sorted.length * 0.95)] || 0;
  const p99Ms = sorted[Math.floor(sorted.length * 0.99)] || 0;
  const maxMs = sorted[sorted.length - 1] || 0;
  const rps = totalRequests / duration;

  console.log("\n--- Results ---");
  console.log(`Total requests: ${totalRequests}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Slow (>3s): ${slow.length}`);
  console.log(`Critical (>10s): ${critical.length}`);
  console.log(`Requests/sec: ${rps.toFixed(1)}`);
  console.log(`\nLatency:`);
  console.log(`  Avg: ${avgMs}ms`);
  console.log(`  P50: ${p50Ms}ms`);
  console.log(`  P95: ${p95Ms}ms`);
  console.log(`  P99: ${p99Ms}ms`);
  console.log(`  Max: ${maxMs}ms`);

  const passed = critical.length === 0;
  console.log(`\n${passed ? "✅" : "❌"} LOAD TEST: ${passed ? "PASS" : "FAIL"} (${critical.length} requests exceeded 10s)`);

  const report = {
    timestamp: new Date().toISOString(),
    concurrency,
    durationSeconds: duration,
    baseUrl,
    totalRequests,
    successful: successful.length,
    failed: failed.length,
    slowCount: slow.length,
    criticalCount: critical.length,
    rps: Math.round(rps * 10) / 10,
    latencyMs: { avg: avgMs, p50: p50Ms, p95: p95Ms, p99: p99Ms, max: maxMs },
    passed,
  };

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error("audit:load FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
