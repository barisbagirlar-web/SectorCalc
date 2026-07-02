import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const premiumSlugs = JSON.parse(fs.readFileSync('premium-slugs.json', 'utf-8'));
const freeSlugs = JSON.parse(fs.readFileSync('free-slugs.json', 'utf-8'));
const allSlugs = [...premiumSlugs, ...freeSlugs];
const isPremium = (slug) => premiumSlugs.includes(slug);

const outDir = 'generated/schemas';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const INDUSTRIAL_PROMPT = (slug, premium) => `
You are an industrial engineering expert. Generate a complete industrial-grade JSON schema for the calculation tool with slug "${slug}".

CRITICAL: All text fields (label, businessContext, description, category, sector, toolName) must be in English ONLY. No Turkish, no other languages.

Requirements:
- Only valid JSON output, no extra text.
- Inputs: each input must have id, label, type (number/select/boolean), unit, default, min, max, businessContext (in English).
- validation: rules (conditional rules) and thresholds (alert conditions).
- formulas: at least 3-7 sub-formulas leading to a primary result.
- outputs: primary, breakdown (object with component values), hiddenLossDrivers (array), suggestedActions (array), dataConfidenceAdjusted (number).
- premiumRequired: ${premium}.
- premiumFeatures: array of strings (e.g., "PDF export", "CSV export", "Trend analysis").

Use your knowledge of industrial engineering standards (ISO, Lean, Six Sigma, WERC, etc.). 
Output only JSON. All strings must be in English.
`;

async function main() {
  for (let i = 0; i < allSlugs.length; i++) {
    const slug = allSlugs[i];
    const outPath = path.join(outDir, `${slug}-schema.json`);
    // Overwrite existing schemas (regenerate from scratch)
    if (fs.existsSync(outPath)) {
      console.log(`[${i+1}/${allSlugs.length}] OVERWRITE ${slug}`);
    } else {
      console.log(`[${i+1}/${allSlugs.length}] ${slug}`);
    }
    const prompt = INDUSTRIAL_PROMPT(slug, isPremium(slug));
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });
      let content = response.choices[0].message.content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) content = jsonMatch[1];
      const schema = JSON.parse(content);
      fs.writeFileSync(outPath, JSON.stringify(schema, null, 2));
      console.log(`  ✅ ${slug}`);
    } catch (err) {
      console.error(`  ❌ ${slug}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
}

main();
