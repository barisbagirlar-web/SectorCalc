#!/usr/bin/env node
import { spawn } from 'node:child_process';

const ATTEMPTS = Number.parseInt(process.env.SEO_GUARD_PROCESS_ATTEMPTS || '3', 10);
const RETRY_DELAY_MS = Number.parseInt(process.env.SEO_GUARD_PROCESS_RETRY_MS || '5000', 10);
const STDERR_TAIL_LIMIT = Number.parseInt(process.env.SEO_GUARD_STDERR_TAIL_LIMIT || '32768', 10);

if (!Number.isInteger(ATTEMPTS) || ATTEMPTS < 1 || ATTEMPTS > 5) {
  throw new Error(`SEO_GUARD_PROCESS_ATTEMPTS must be an integer between 1 and 5; received ${process.env.SEO_GUARD_PROCESS_ATTEMPTS || '3'}`);
}
if (!Number.isInteger(RETRY_DELAY_MS) || RETRY_DELAY_MS < 0 || RETRY_DELAY_MS > 30000) {
  throw new Error(`SEO_GUARD_PROCESS_RETRY_MS must be an integer between 0 and 30000; received ${process.env.SEO_GUARD_PROCESS_RETRY_MS || '5000'}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function isTransientGuardFailure(text) {
  return /TimeoutError|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_SOCKET|fetch failed|network socket disconnected/i.test(String(text || ''));
}

function appendTail(current, chunk) {
  const next = `${current}${chunk}`;
  return next.length <= STDERR_TAIL_LIMIT ? next : next.slice(-STDERR_TAIL_LIMIT);
}

function runOnce() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['scripts/seo-live-guard.mjs'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderrTail = '';

    child.stdout.on('data', (chunk) => process.stdout.write(chunk));
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderrTail = appendTail(stderrTail, text);
      process.stderr.write(chunk);
    });
    child.on('error', (error) => {
      const text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      stderrTail = appendTail(stderrTail, text);
      resolve({ code: 1, stderrTail });
    });
    child.on('close', (code, signal) => resolve({ code: code ?? 1, signal, stderrTail }));
  });
}

async function main() {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    if (attempt > 1) console.error(`[RETRY] SEO live guard transport retry ${attempt}/${ATTEMPTS}`);
    const result = await runOnce();
    if (result.code === 0) return;

    const transient = isTransientGuardFailure(result.stderrTail);
    if (!transient || attempt === ATTEMPTS) {
      console.error(`[FAIL] SEO live guard wrapper: exit=${result.code}${result.signal ? ` signal=${result.signal}` : ''}; transient=${transient}`);
      process.exit(result.code || 1);
    }
    await sleep(RETRY_DELAY_MS * attempt);
  }
}

if (process.argv[1]?.endsWith('run-seo-live-guard.mjs')) {
  await main();
}
