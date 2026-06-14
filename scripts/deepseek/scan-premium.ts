import { discoverAllTools } from './discover-tools.js';
import { deepseekClient } from './deepseek-client.js';
import { INDUSTRIAL_ENGINEERING_PROMPT } from './prompts.js';
import { loadEnv } from './load-env.js';

async function main() {
  loadEnv();
  const allTools = await discoverAllTools();
  const premiumTools = allTools.filter(t => 
    t.slug.includes('premium') || 
    t.slug.includes('paid') ||
    t.source?.includes('paidSlug')
  );
  console.log(`✅ Toplam: ${allTools.length} tool, Premium: ${premiumTools.length} adet\n`);
  
  for (const tool of premiumTools.slice(0, 5)) {
    console.log(`\n📡 Taranıyor: ${tool.slug}`);
    const prompt = INDUSTRIAL_ENGINEERING_PROMPT(
      tool.slug,
      `Premium SectorCalc analyzer: ${tool.slug.replace(/-/g, ' ')}`,
      tool.contextSnippet,
    );
    try {
      const response = await deepseekClient(prompt);
      console.log(`📤 JSON Çıktısı:\n${response}\n`);
    } catch (err) {
      console.error(`❌ Hata: ${tool.slug}`, err);
    }
  }
}

main();
