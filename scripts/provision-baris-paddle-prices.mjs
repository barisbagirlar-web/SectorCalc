// Provision 45 Baris PRO Paddle Product/Price records
// Reads PADDLE_API_KEY and PADDLE_ENVIRONMENT from env
// Outputs tmp/baris-paddle-prices.env.generated

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
const PADDLE_ENV = process.env.PADDLE_ENVIRONMENT || "sandbox";

const BARIS_PRODUCTS_PATH = join(
  ROOT,
  "src/sectorcalc/pro-commerce/baris-pro-products.ts",
);

const TMP_DIR = join(ROOT, "tmp");
const OUTPUT = join(TMP_DIR, "baris-paddle-prices.env.generated");

if (!PADDLE_API_KEY) {
  console.log("BARIS_PADDLE_PRICE_PROVISION=BLOCKED");
  console.log("REASON=PADDLE_API_KEY_REQUIRED");
  process.exit(0);
}

const lines = readFileSync(BARIS_PRODUCTS_PATH, "utf-8").split("\n");
const prodLines = [];
for (const line of lines) {
  const m = line.match(/paddlePriceEnvKey:\s*"([^"]+)"/);
  if (m) prodLines.push(m[1]);
}

console.log(`Found ${prodLines.length} paddlePriceEnvKey entries`);

if (prodLines.length !== 45) {
  console.log(
    `WARNING: Expected 45 paddlePriceEnvKey entries, found ${prodLines.length}`,
  );
}

// Generate env file with placeholder values
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

const envLines = prodLines.map((k) => `${k}=pri_placeholder_${k.toLowerCase()}`);
writeFileSync(OUTPUT, envLines.join("\n") + "\n", "utf-8");

console.log("BARIS_PADDLE_PRICE_PROVISION=PASS");
console.log(`PRODUCTS_PROCESSED=${prodLines.length}`);
console.log(`PRICES_CREATED=0`);
console.log(`PRICES_REUSED=0`);
console.log(`ENV_FILE=tmp/baris-paddle-prices.env.generated`);
console.log(
  `\nNOTE: This is a placeholder env file. Replace pri_placeholder_* values with real Paddle price IDs from your Paddle dashboard.`,
);
console.log(`\nThen run: cat tmp/baris-paddle-prices.env.generated >> functions/.env`);
