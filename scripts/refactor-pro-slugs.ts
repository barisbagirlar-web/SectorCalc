import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const schemasDir = path.join(process.cwd(), "src/lib/premium-schema/schemas");
const calcsDir = path.join(process.cwd(), "src/lib/premium-schema/calculators");
const schemaRegPath = path.join(process.cwd(), "src/lib/premium-schema/schema-registry.ts");
const formulaRegPath = path.join(process.cwd(), "src/lib/premium-schema/formula-registry.ts");

async function run() {
  const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith(".ts"));
  
  // Find all slugs that end with -{number} and contain "ve" or turkish words
  // To be safe, let's just find all slugs that match -\d+$
  const targetSlugs = schemaFiles
    .map(f => f.replace(".ts", ""))
    .filter(slug => /-\d+$/.test(slug));

  console.log(`Found ${targetSlugs.length} slugs to refactor.`);

  if (targetSlugs.length === 0) return;

  const batchSize = 100;
  const slugMap: Record<string, string> = {};

  for (let i = 0; i < targetSlugs.length; i += batchSize) {
    const batch = targetSlugs.slice(i, i + batchSize);
    console.log(`Asking AI to translate batch ${i} to ${i + batch.length}...`);

    const prompt = `
    You are an expert SEO specialist and technical translator.
    I have a list of URL slugs that are currently a mix of Turkish and English, and end with an ID number (e.g. 'ai-intelligence-token-cost-ve-latency-calculator-1').
    Translate them into clean, pure English URL slugs.
    Rules:
    1. Output MUST be ONLY valid JSON mapping old_slug to new_slug.
    2. The new slug MUST be all lowercase, separated by dashes (kebab-case).
    3. REMOVE the ID number at the end (e.g. '-1', '-38').
    4. MUST end with '-calculator' if it doesn't already.
    5. Translate Turkish words like 've' -> 'and', 'maliyeti' -> 'cost', 'baski' -> 'print', 'geridonusum' -> 'recycling'. Keep it short and SEO friendly (max 5-6 words).
    
    Example:
    {
      "3d-baski-filament-geri-donusum-roi-ve-mukavemet-kaybi-calculator-38": "3d-print-filament-recycling-roi-calculator",
      "aiag-msa-olcum-sistemi-dogrusallik-linearity-ve-yanlilik-analysis-calculator-181": "msa-measurement-system-linearity-bias-calculator"
    }

    Slugs:
    ${batch.join("\n")}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const text = response.choices[0].message.content || "{}";
      const result = JSON.parse(text);
      Object.assign(slugMap, result);
    } catch (e) {
      console.error(`Error with batch ${i}:`, e);
    }
  }

  console.log(`Received ${Object.keys(slugMap).length} translated slugs.`);

  // Load Registries
  let schemaRegContent = fs.readFileSync(schemaRegPath, "utf-8");
  let formulaRegContent = fs.readFileSync(formulaRegPath, "utf-8");

  let updatedCount = 0;
  for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
    if (!newSlug || oldSlug === newSlug) continue;
    
    const oldSchemaPath = path.join(schemasDir, `${oldSlug}.ts`);
    const oldCalcPath = path.join(calcsDir, `${oldSlug}.ts`);
    const newSchemaPath = path.join(schemasDir, `${newSlug}.ts`);
    const newCalcPath = path.join(calcsDir, `${newSlug}.ts`);

    let didUpdate = false;

    // 1. Update Schema File
    if (fs.existsSync(oldSchemaPath)) {
      let content = fs.readFileSync(oldSchemaPath, "utf-8");
      // Replace id: "old-slug" with id: "new-slug"
      const idRegex = new RegExp(`id:\\s*"${oldSlug}"`, "g");
      content = content.replace(idRegex, `id: "${newSlug}"`);
      fs.writeFileSync(oldSchemaPath, content, "utf-8");
      fs.renameSync(oldSchemaPath, newSchemaPath);
      didUpdate = true;
    }

    // 2. Update Calculator File
    if (fs.existsSync(oldCalcPath)) {
      fs.renameSync(oldCalcPath, newCalcPath);
      didUpdate = true;
    }

    // 3. Update Registries
    if (didUpdate) {
      // In Schema Registry: import { ... } from "./schemas/old-slug";
      const importRegSchema = new RegExp(`"./schemas/${oldSlug}"`, "g");
      schemaRegContent = schemaRegContent.replace(importRegSchema, `"./schemas/${newSlug}"`);
      // Also the key in PREMIUM_SCHEMA_REGISTRY
      const keyRegSchema = new RegExp(`"${oldSlug}":`, "g");
      schemaRegContent = schemaRegContent.replace(keyRegSchema, `"${newSlug}":`);

      // In Formula Registry: import { ... } from "./calculators/old-slug";
      const importRegFormula = new RegExp(`"./calculators/${oldSlug}"`, "g");
      formulaRegContent = formulaRegContent.replace(importRegFormula, `"./calculators/${newSlug}"`);
      // Also the key in PREMIUM_FORMULA_REGISTRY
      const keyRegFormula = new RegExp(`"${oldSlug}":`, "g");
      formulaRegContent = formulaRegContent.replace(keyRegFormula, `"${newSlug}":`);

      updatedCount++;
    }
  }

  // Save registries
  fs.writeFileSync(schemaRegPath, schemaRegContent, "utf-8");
  fs.writeFileSync(formulaRegPath, formulaRegContent, "utf-8");

  console.log(`Successfully refactored ${updatedCount} pro slugs.`);
}

run().catch(console.error);
