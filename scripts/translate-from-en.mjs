import fs from 'fs';
import path from 'path';

function translateFreeCatalog() {
  const enJsonPath = path.join(process.cwd(), 'messages/en.json');
  if (!fs.existsSync(enJsonPath)) return;
  const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));
  const freeTranslations = enJson.free;
  if (!freeTranslations) return;

  const freeFile = path.join(process.cwd(), 'src/lib/tools/free-traffic-catalog.ts');
  let content = fs.readFileSync(freeFile, 'utf-8');

  // We have translation objects keyed by slug like 'fin-001'
  for (const [slug, data] of Object.entries(freeTranslations)) {
    if (!content.includes(`slug: "${slug}"`)) continue;
    
    // Replace title
    if (data.title) {
      // Find the block for this slug
      // A safe way is to find the index of `slug: "fin-001"` and then replace the FIRST title/description after it.
      const index = content.indexOf(`slug: "${slug}"`);
      if (index !== -1) {
        const nextTitleIndex = content.indexOf('title: "', index);
        const endTitleIndex = content.indexOf('"', nextTitleIndex + 8);
        content = content.substring(0, nextTitleIndex + 8) + data.title + content.substring(endTitleIndex);

        const nextDescIndex = content.indexOf('description: "', index);
        const endDescIndex = content.indexOf('"', nextDescIndex + 14);
        content = content.substring(0, nextDescIndex + 14) + data.description + content.substring(endDescIndex);

        const nextSeoTitleIndex = content.indexOf('seoTitle: "', index);
        const endSeoTitleIndex = content.indexOf('"', nextSeoTitleIndex + 11);
        content = content.substring(0, nextSeoTitleIndex + 11) + data.seoTitle + content.substring(endSeoTitleIndex);

        const nextSeoDescIndex = content.indexOf('seoDescription: "', index);
        const endSeoDescIndex = content.indexOf('"', nextSeoDescIndex + 17);
        content = content.substring(0, nextSeoDescIndex + 17) + data.seoDescription + content.substring(endSeoDescIndex);
        
        // Let's add seoSlug dynamically from English title if missing or replace the slug property?
        // User wants SEO URLs: "url yapısı seo uyumlu olacak".
        // Currently the free tools are mapped by `slug: "fin-001"`. The URL becomes `/tools/free/fin-001`.
        // If we want SEO URLs, `slug` should be `percentage-rule`.
        // BUT changing `slug` means changing IDs all over the code? No, `FREE_TRAFFIC_CATALOG` uses `slug` directly in the routing `[slug]/page.tsx`!
        // We can just add `seoSlug: "percentage-rule"` and change `[slug]` to find it by `seoSlug` OR `slug`.
      }
    }
  }

  fs.writeFileSync(freeFile, content, 'utf-8');
  console.log("Free catalog mapped with English strings from en.json!");
}

translateFreeCatalog();
