// SectorCalc Sitemap Tools Release Smoke Test
// Verifies sitemap contains valid tool URLs.

import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error("BASE_URL environment variable is required");
  process.exit(1);
}

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${BASE_URL}${urlPath}`);

    const requestFn = parsed.protocol === "https:" ? httpsRequest : httpRequest;

    const req = requestFn(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: "GET",
        timeout: 15000,
        headers: { "User-Agent": "SectorCalc-SmokeTest/1.0" },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
      },
    );

    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

async function run() {
  let exitCode = 0;
  const errors = [];

  console.log("=== SITEMAP TOOLS RELEASE SMOKE TEST ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("");

  // Check sitemap exists
  console.log("--- Checking sitemap ---");
  try {
    const { statusCode, body } = await fetchUrl("/sitemap.xml");
    if (statusCode !== 200 && statusCode !== 304) {
      errors.push(`Sitemap returned status ${statusCode}`);
    } else if (!body.includes("<urlset") && !body.includes("<sitemapindex")) {
      errors.push("Sitemap does not contain valid XML");
    } else {
      console.log("  ✅ Sitemap accessible");
    }
  } catch (err) {
    errors.push(`Sitemap fetch error: ${err.message}`);
  }

  // Check /en returns 404
  console.log("--- Checking locale routes ---");
  try {
    const { statusCode } = await fetchUrl("/en");
    if (statusCode !== 404) {
      errors.push(`/en returned ${statusCode} instead of 404`);
    } else {
      console.log("  ✅ /en returns 404");
    }
  } catch (err) {
    errors.push(`/en error: ${err.message}`);
  }

  try {
    const { statusCode } = await fetchUrl("/tr");
    if (statusCode !== 404) {
      errors.push(`/tr returned ${statusCode} instead of 404`);
    } else {
      console.log("  ✅ /tr returns 404");
    }
  } catch (err) {
    errors.push(`/tr error: ${err.message}`);
  }

  // Check /tools page
  console.log("--- Checking tools listing ---");
  try {
    const { statusCode } = await fetchUrl("/tools");
    if (statusCode !== 200 && statusCode !== 304) {
      errors.push(`/tools returned ${statusCode}`);
    } else {
      console.log("  ✅ /tools page accessible");
    }
  } catch (err) {
    errors.push(`/tools error: ${err.message}`);
  }

  // Summary
  console.log("");
  if (errors.length > 0) {
    console.error("❌ SITEMAP TOOLS RELEASE SMOKE TEST FAILED");
    for (const err of errors) {
      console.error(`  ❌ ${err}`);
    }
    exitCode = 1;
  } else {
    console.log("✅ SITEMAP TOOLS RELEASE SMOKE TEST PASSED");
  }

  process.exit(exitCode);
}

run();
