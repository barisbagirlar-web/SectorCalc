import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const CATEGORIES = [
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body"
];

async function run() {
  const catalogPath = path.join(process.cwd(), "src/lib/tools/free-traffic-catalog.ts");
  let content = fs.readFileSync(catalogPath, "utf-8");

  const regex = /slug:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
  let match;
  const tools = [];
  while ((match = regex.exec(content)) !== null) {
    tools.push({ slug: match[1], category: match[2], title: match[3] });
  }

  console.log(`Found ${tools.length} tools in catalog.`);
  
  if (tools.length === 0) {
    console.error("No tools found. Please verify the regex pattern.");
    return;
  }

  const batchSize = 150;
  const updates: Record<string, string> = {};

  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    console.log(`Processing batch ${i} to ${i + batch.length} of ${tools.length}...`);
    
    const prompt = `
    Assign each of the following tools to EXACTLY ONE of the following categories based on their title and domain:
    [${CATEGORIES.join(", ")}]

    Rules: 
    1. Look at the title and choose the most relevant industrial/business category.
    2. If it's about investing, taxes, payroll, select 'finance-business'.
    3. If it's about concrete, land, building, select 'construction-measurement'.
    4. If it's about factory, machining, OEE, select 'manufacturing-workshop'.
    5. ONLY return valid JSON mapping tool slugs to categories. No extra text, markdown block, or explanations. Example output:
    { "fin-001": "finance-business", "geo-003": "construction-measurement" }

    Tools:
    ${batch.map(t => `${t.slug}: ${t.title}`).join("\n")}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0].message.content || "{}";
      const result = JSON.parse(text);
      Object.assign(updates, result);
    } catch (e) {
      console.error(`Error processing batch ${i}:`, e);
    }
  }

  console.log(`Received updates for ${Object.keys(updates).length} tools.`);

  let updatedCount = 0;
  for (const tool of tools) {
    if (updates[tool.slug] && CATEGORIES.includes(updates[tool.slug])) {
      const targetCategory = updates[tool.slug];
      if (tool.category !== targetCategory) {
        const toolRegex = new RegExp(`(slug:\\s*"${tool.slug}",\\s*category:\\s*)"([^"]+)"`, "g");
        content = content.replace(toolRegex, `$1"${targetCategory}"`);
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(catalogPath, content, "utf-8");
  console.log(`Updated ${updatedCount} tools to new categories! Saved catalog.`);
}

run().catch(console.error);
