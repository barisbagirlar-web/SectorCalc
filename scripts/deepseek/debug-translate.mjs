#!/usr/bin/env npx tsx
/**
 * Debug: Test DeepSeek translation API response format.
 */
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || (await import("./load-env")).loadEnv() || "";

import { loadEnv } from "./load-env";
loadEnv();

async function main() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) { console.error("No API key"); process.exit(1); }

  const testStrings = [
    "Vehicle Mass (kg)",
    "Calculate acceleration time.",
    "Annual COGS (USD)",
    "Target X (m)",
    "Enter the vehicle mass in kilograms.",
  ];

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an industrial translator. Return ONLY valid JSON." },
        { role: "user", content: `Translate these English strings to German.

CRITICAL: Translate ALL text. Units in parentheses MUST stay exactly as-is.
Return ONLY a JSON object mapping numeric index to translated string.

INPUT:
  "0": "Vehicle Mass (kg)"
  "1": "Calculate acceleration time."
  "2": "Annual COGS (USD)"
  "3": "Target X (m)"
  "4": "Enter the vehicle mass in kilograms."

OUTPUT:` },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Raw response:");
  console.log(text);
  console.log("\n---");

  try {
    const json = JSON.parse(text);
    const content = json.choices?.[0]?.message?.content;
    console.log("\nContent:");
    console.log(content);
    console.log("\n---");
    const cleaned = content?.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/s, "$1").trim();
    console.log("Cleaned:");
    console.log(cleaned);
    const parsed = JSON.parse(cleaned);
    console.log("\nParsed map:");
    for (const [k, v] of Object.entries(parsed)) {
      console.log(`  ${k} => ${v}`);
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
}

main();
