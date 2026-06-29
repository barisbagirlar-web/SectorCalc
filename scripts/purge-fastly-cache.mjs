#!/usr/bin/env node
/**
 * Purge Fastly CDN cache by Surrogate-Key after deploy.
 *
 * Environment:
 *   FASTLY_SERVICE_ID  — Fastly service ID (required)
 *   FASTLY_API_TOKEN   — Fastly API token (required)
 *
 * Usage:
 *   node scripts/purge-fastly-cache.mjs
 *   FAStLY_SERVICE_ID=abc FASTLY_API_TOKEN=xyz node scripts/purge-fastly-cache.mjs
 *
 * Purges only surrogate-key "html" so fingerprinted static assets stay warm.
 */

const SERVICE_ID = process.env.FASTLY_SERVICE_ID;
const API_TOKEN = process.env.FASTLY_API_TOKEN;

const SURROGATE_KEY = "html";

function fail(message) {
  console.error(`purge-fastly-cache: FAIL — ${message}`);
  process.exitCode = 1;
}

async function main() {
  if (!SERVICE_ID) {
    fail("FASTLY_SERVICE_ID is not set");
    return;
  }
  if (!API_TOKEN) {
    fail("FASTLY_API_TOKEN is not set");
    return;
  }

  const url = `https://api.fastly.com/service/${SERVICE_ID}/purge/${SURROGATE_KEY}`;
  console.log(`purge-fastly-cache: soft-purging surrogate-key "${SURROGATE_KEY}"…`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Fastly-Key": API_TOKEN,
        "Fastly-Soft-Purge": "1",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "(no body)");
      fail(`Fastly API returned ${response.status}: ${body}`);
      return;
    }

    const data = await response.json();
    console.log(`purge-fastly-cache: OK — status=${response.status}`);
    if (data.status) console.log(`  status: ${data.status}`);
    if (data.id) console.log(`  purge-id: ${data.id}`);
  } catch (err) {
    fail(`request failed: ${err.message}`);
  }
}

main();
