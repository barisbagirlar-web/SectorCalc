#!/usr/bin/env node
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error("DEEPSEEK_API_KEY required");
  process.exit(1);
}

const texts = [
  { slug: "beer-pairing-calculator", id: "foodSpiciness", field: "label_i18n", locale: "es", text: "Food Spiciness Level" },
  { slug: "beer-pairing-calculator", id: "foodSpiciness", field: "businessContext_i18n", locale: "es", text: "From 1 (not spicy) to 10 (very spicy)" },
];

async function translate(text, targetLang) {
  const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `You are a professional translator. Translate the following text to ${targetLang}. Return ONLY the translation, no explanations, no quotes.` },
        { role: "user", content: text },
      ],
      temperature: 0.1,
      max_tokens: 200,
    }),
  });
  const data = await resp.json();
  const translated = data.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error(`DeepSeek failed: ${JSON.stringify(data)}`);
  return translated;
}

import fs from "node:fs";
import path from "node:path";

console.log("Translating ES fields...");
for (const job of texts) {
  const fp = path.resolve(process.cwd(), `generated/schemas/${job.slug}-schema.json`);
  const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
  let found = false;
  for (const input of raw.inputs ?? []) {
    if (input.id === job.id && input[job.field]) {
      console.log(`  Translating ${job.slug}.${job.id}.${job.field}.es: "${job.text}" → Spanish`);
      const translated = await translate(job.text, "Spanish");
      input[job.field].es = translated;
      console.log(`    → "${translated}"`);
      fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + "\n", "utf8");
      found = true;
    }
  }
  if (!found) console.error(`  NOT FOUND: ${job.slug}.${job.id}`);
}
console.log("Done.");
