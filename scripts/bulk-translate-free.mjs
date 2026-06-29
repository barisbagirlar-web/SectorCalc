import fs from 'fs';
import path from 'path';

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error("No DEEPSEEK_API_KEY found!");
  process.exit(1);
}

async function translateText(text) {
  if (!text || typeof text !== 'string') return text;
  // If it's already english, keep it. If turkish, translate.
  // Actually, we can just send it to DeepSeek.
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert translator. Translate the following Turkish text to high-quality industrial English. If it is already in English, return it as is. Do not include quotes, explanations, or any extra text. Just the exact translated string."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    console.error("Deepseek error", await response.text());
    return text;
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const file = 'src/lib/tools/free-traffic-catalog.ts';
  let content = fs.readFileSync(file, 'utf8');
  
  // To avoid breaking the 14k line file, we will use regex to find tools:
  const regex = /slug:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?seoTitle:\s*"([^"]+)",[\s\S]*?seoDescription:\s*"([^"]+)",/g;
  
  let match;
  let matches = [];
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      slug: match[1],
      category: match[2],
      title: match[3],
      description: match[4],
      seoTitle: match[5],
      seoDescription: match[6]
    });
  }

  console.log(`Found ${matches.length} free tools to translate.`);

  // Let's translate the first 10 for safety in this batch.
  for (let i = 0; i < Math.min(10, matches.length); i++) {
    const m = matches[i];
    console.log(`Translating: ${m.title}`);
    
    const enTitle = await translateText(m.title);
    const enDesc = await translateText(m.description);
    const enSeoTitle = await translateText(m.seoTitle);
    const enSeoDesc = await translateText(m.seoDescription);
    const newSlug = slugify(enTitle);

    const replacement = `slug: "${newSlug}",
    category: "${m.category}",
    title: "${enTitle}",
    description: "${enDesc}",
    seoTitle: "${enSeoTitle}",
    seoDescription: "${enSeoDesc}",`;

    content = content.replace(m.fullMatch, replacement);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log("Finished batch translation.");
}

run();
