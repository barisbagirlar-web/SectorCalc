#!/usr/bin/env npx tsx
/**
 * Quick DeepSeek API connectivity check.
 */

import { loadEnvLocal } from "./deepseek/load-env";

loadEnvLocal();

async function main(): Promise<void> {
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!API_KEY) {
    console.error("❌ DEEPSEEK_API_KEY ortam değişkeni tanımlı değil.");
    process.exit(1);
  }

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`❌ DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
    process.exit(1);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    console.error("❌ DeepSeek boş yanıt döndü.");
    process.exit(1);
  }

  console.log("✅ API çalışıyor:", content);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
