/**
 * Stripe kredi ürünleri — key sonra doldurulacak.
 *
 * Key yoksa: env şablonu basar, hata vermez.
 * Key varsa: Stripe'da ürün+fiyat oluşturur.
 *
 *   node scripts/create-stripe-credit-products.js
 */

const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const isPlaceholderKey =
  !stripeSecretKey ||
  stripeSecretKey === "sk_test_sonra_doldur" ||
  stripeSecretKey === "sk_live_sonra_doldur";

const products = [
  { envKey: "STRIPE_PRICE_CREDITS_1", name: "1 Credit", credits: 1, price: 199 },
  { envKey: "STRIPE_PRICE_CREDITS_5", name: "5 Credits", credits: 5, price: 499 },
  { envKey: "STRIPE_PRICE_CREDITS_15", name: "15 Credits", credits: 15, price: 799 },
  { envKey: "STRIPE_PRICE_CREDITS_30", name: "30 Credits", credits: 30, price: 1199 },
  { envKey: "STRIPE_PRICE_CREDITS_100", name: "100 Credits", credits: 100, price: 2499 },
];

function printEnvTemplate() {
  console.log("Stripe key henüz yok — şimdilik bu şablon yeterli:\n");
  console.log("# functions/.env veya Firebase params");
  console.log("STRIPE_SECRET_KEY=sk_test_sonra_doldur");
  console.log("STRIPE_WEBHOOK_SECRET=whsec_sonra_doldur");
  for (const pack of products) {
    console.log(`${pack.envKey}=price_xxx`);
  }
  console.log("\n# .env.local (frontend — opsiyonel, project id varsa gerek yok)");
  console.log("NEXT_PUBLIC_CREDIT_CHECKOUT_FUNCTION_URL=");
  console.log("NEXT_PUBLIC_SPEND_CREDITS_FUNCTION_URL=");
  console.log("\nKey gelince tekrar çalıştır: node scripts/create-stripe-credit-products.js");
  console.log("Price ID olmadan da checkout çalışır (price_data fallback).\n");
}

async function createProducts() {
  if (isPlaceholderKey) {
    printEnvTemplate();
    return;
  }

  let Stripe;
  try {
    Stripe = require(path.resolve(__dirname, "../functions/node_modules/stripe"));
  } catch {
    console.log("stripe paketi yok — önce: cd functions && npm install");
    printEnvTemplate();
    return;
  }

  const stripe = new Stripe(stripeSecretKey);
  console.log("Stripe kredi ürünleri oluşturuluyor…\n");

  const lines = [];
  for (const pack of products) {
    const product = await stripe.products.create({
      name: pack.name,
      metadata: { credits: String(pack.credits), createdBy: "sectorcalc-script" },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pack.price,
      currency: "usd",
    });
    console.log(`✅ ${pack.name} → ${price.id}`);
    lines.push(`${pack.envKey}=${price.id}`);
  }

  console.log("\nfunctions/.env'e yapıştır:\n");
  console.log(lines.join("\n"));
}

createProducts().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  console.log("\nKey tarafı sonra tamamlanacak — şimdilik price_data fallback kullanılır.");
});
