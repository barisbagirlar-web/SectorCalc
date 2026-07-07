#!/usr/bin/env node
// SectorCalc PRO V5.3.1 — Baris Stripe Price Provisioning Script
// Creates Stripe Products and Prices for all 45 Baris PRO products.
// Usage: BARIS_STRIPE_MODE=test|live STRIPE_SECRET_KEY="sk_..." node scripts/provision-baris-stripe-prices.mjs
// Output: tmp/baris-stripe-prices.env.generated

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = resolve(__dirname, "../src/sectorcalc/pro-commerce/baris-pro-products.ts");
const OUTPUT_DIR = resolve(__dirname, "../tmp");
const OUTPUT_FILE = resolve(OUTPUT_DIR, "baris-stripe-prices.env.generated");

const MODE = process.env.BARIS_STRIPE_MODE || "test";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.log("BARIS_STRIPE_PRICE_PROVISION=BLOCKED");
  console.log("REASON=STRIPE_SECRET_KEY_REQUIRED");
  process.exit(1);
}

// Parse products from TS file using regex
const content = readFileSync(PRODUCTS_FILE, "utf-8");
const productBlocks = [];
let depth = 0;
let currentBlock = "";
let inBlock = false;

for (const line of content.split("\n")) {
  if (line.includes("BARIS_PRO_PRODUCTS:")) {
    inBlock = true;
    continue;
  }
  if (!inBlock) continue;
  for (const ch of line) {
    if (ch === "{") {
      depth++;
      if (depth === 1) currentBlock = "{";
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        currentBlock += "}";
        productBlocks.push(currentBlock);
        currentBlock = "";
      }
    } else if (depth >= 1) {
      currentBlock += ch;
    }
  }
}

function extractField(block, field) {
  const re = new RegExp(field + ":\\s*(true|false|\"[^\"]*\"|\\d+)");
  const m = block.match(re);
  if (!m) return null;
  const val = m[1];
  if (val === "true" || val === "false") return val;
  if (/^\d+$/.test(val)) return parseInt(val, 10);
  return val.replace(/^"|"$/g, "");
}

const products = productBlocks
  .map(function(block) {
    return {
      toolKey: extractField(block, "toolKey"),
      toolName: extractField(block, "toolName"),
      priceUsd: extractField(block, "priceUsd"),
      productMode: extractField(block, "productMode"),
      paymentProductType: extractField(block, "paymentProductType"),
      executionMode: extractField(block, "executionMode"),
      stripePriceEnvKey: extractField(block, "stripePriceEnvKey"),
      visible: extractField(block, "visible") === "true",
      sellable: extractField(block, "sellable") === "true",
    };
  })
  .filter(function(p) { return p.toolKey && p.priceUsd; });

console.log("\n=== Baris Stripe Price Provisioning ===");
console.log("  Mode: " + MODE.toUpperCase());
console.log("  Products parsed: " + products.length + "\n");

if (products.length !== 45) {
  console.log("  Warning: Expected 45 products, found " + products.length);
}

var created = 0;
var reused = 0;
var envLines = [];

var apiBase = "https://api.stripe.com/v1";
var headers = {
  Authorization: "Bearer " + STRIPE_SECRET_KEY,
  "Content-Type": "application/x-www-form-urlencoded",
};

function postForm(path, body) {
  var params = new URLSearchParams();
  for (var k in body) {
    if (body.hasOwnProperty(k)) {
      params.set(k, body[k]);
    }
  }
  return fetch(apiBase + path, {
    method: "POST",
    headers: headers,
    body: params.toString(),
  }).then(function(res) {
    return res.json().then(function(data) {
      if (!res.ok) throw new Error("Stripe API error: " + (data.error ? data.error.message : res.status));
      return data;
    });
  });
}

function searchPrices(key) {
  var query = "metadata['stripe_env_key']:'" + key + "'";
  return fetch(apiBase + "/prices/search?query=" + encodeURIComponent(query), {
    headers: headers,
  }).then(function(res) {
    return res.json().then(function(data) {
      if (!res.ok) return { data: [] };
      return data;
    });
  });
}

function processProduct(product) {
  var envKey = product.stripePriceEnvKey;
  return searchPrices(envKey).then(function(searchResult) {
    if (searchResult.data && searchResult.data.length > 0) {
      envLines.push(envKey + "=" + searchResult.data[0].id);
      reused++;
      return;
    }
    return postForm("/products", {
      name: product.toolName,
      "metadata[tool_key]": product.toolKey,
      "metadata[sectorcalc_product_mode]": product.productMode,
      "metadata[payment_product_type]": product.paymentProductType,
      "metadata[sectorcalc_release]": "BARIS_PRO_V531",
    }).then(function(stripeProduct) {
      var unitAmount = String(Math.round(product.priceUsd * 100));
      return postForm("/prices", {
        currency: "usd",
        unit_amount: unitAmount,
        product: stripeProduct.id,
        "metadata[tool_key]": product.toolKey,
        "metadata[stripe_env_key]": envKey,
      }).then(function(stripePrice) {
        envLines.push(envKey + "=" + stripePrice.id);
        created++;
      });
    });
  });
}

var promiseChain = Promise.resolve();
for (var i = 0; i < products.length; i++) {
  promiseChain = promiseChain.then(function(prod) {
    return processProduct(prod);
  }.bind(null, products[i]));
}

promiseChain.then(function() {
  // Write env file
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, envLines.join("\n") + "\n", "utf-8");

  console.log("  Products processed: " + products.length);
  console.log("  Prices created: " + created);
  console.log("  Prices reused: " + reused);
  console.log("  Env file: " + OUTPUT_FILE);
  console.log("\n  BARIS_STRIPE_PRICE_PROVISION=PASS");

  // Verify no duplicates
  var keys = envLines.map(function(l) { return l.split("=")[0]; });
  var prices = envLines.map(function(l) { return l.split("=")[1]; });
  var dupKeys = keys.filter(function(k, i) { return keys.indexOf(k) !== i; });
  var dupPrices = prices.filter(function(p, i) { return prices.indexOf(p) !== i; });
  if (dupKeys.length > 0) console.log("  Duplicate env keys: " + dupKeys.join(", "));
  if (dupPrices.length > 0) console.log("  Duplicate price IDs: " + dupPrices.join(", "));

  console.log();
  process.exit(0);
}).catch(function(err) {
  console.error("  ERROR: " + err.message);
  process.exit(1);
});
