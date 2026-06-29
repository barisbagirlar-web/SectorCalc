import fs from 'fs';
import path from 'path';

// Note: To run this, you need process.env.DEEPSEEK_API_KEY

async function translate() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("No DEEPSEEK_API_KEY found");
    return;
  }

  // We could use fetch instead of openai SDK to avoid dependencies if it's missing
  async function callDeepseek(prompt) {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an expert translator and SEO specialist. Return ONLY a valid JSON object. No markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  }

  const freeFile = path.join(process.cwd(), 'src/lib/tools/free-traffic-catalog.ts');
  let freeContent = fs.readFileSync(freeFile, 'utf-8');

  // We will find all title: "...", description: "...", seoTitle: "...", seoDescription: "..."
  // This is best done with a simple regex or AST. 
  // Given the size, doing it block by block is safer.
  
  const toolBlocks = freeContent.split('slug: "').slice(1); // skip the first part
  
  for (let i = 0; i < toolBlocks.length; i++) {
    const block = toolBlocks[i];
    const slug = block.split('"')[0];
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const descMatch = block.match(/description:\s*"([^"]+)"/);
    if (!titleMatch || !descMatch) continue;

    const originalTitle = titleMatch[1];
    if (originalTitle.match(/^[A-Za-z0-9 -]+$/)) {
      // already english mostly? No, might have some turkish. But let's translate anyway.
    }

    console.log(`Translating: ${originalTitle}`);
    try {
      const prompt = `Translate the following industrial/engineering calculator title and description into pure English. Also provide an SEO-friendly slug (lowercase, hyphenated).
Title: ${originalTitle}
Description: ${descMatch[1]}

Output format (strict JSON):
{
  "title": "English Title",
  "description": "English Description",
  "seoTitle": "English SEO Title | SectorCalc",
  "seoDescription": "English SEO Description",
  "seoSlug": "english-seo-slug"
}`;
      const translated = await callDeepseek(prompt);
      
      // Now replace in content
      const regexTitle = new RegExp(`title:\\s*"${originalTitle}"`, 'g');
      const regexDesc = new RegExp(`description:\\s*"${descMatch[1]}"`, 'g');
      const regexSeoTitle = /seoTitle:\s*"[^"]+"/g;
      const regexSeoDesc = /seoDescription:\s*"[^"]+"/g;

      // Note: we must replace it only within this block's region to be safe, or globally if unique.
      freeContent = freeContent.replace(regexTitle, `title: "${translated.title}"`);
      freeContent = freeContent.replace(regexDesc, `description: "${translated.description}"`);
      
      // Also inject seoSlug if not exists
      if (!freeContent.includes(`seoSlug: "${translated.seoSlug}"`) && freeContent.includes(`slug: "${slug}"`)) {
         freeContent = freeContent.replace(`slug: "${slug}",`, `slug: "${slug}",\n    seoSlug: "${translated.seoSlug}",`);
      }
      
    } catch (e) {
      console.error(`Failed to translate ${originalTitle}:`, e.message);
    }
  }

  fs.writeFileSync(freeFile, freeContent, 'utf-8');
  console.log("Translation complete for free tools.");
}

translate();
