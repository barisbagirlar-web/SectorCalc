import fs from 'fs';
import path from 'path';

const catalogPath = path.join(process.cwd(), 'src/lib/tools/free-traffic-catalog.ts');
const registryPath = path.join(process.cwd(), 'src/lib/tools/free-traffic-calculators-registry.ts');

const catalogContent = fs.readFileSync(catalogPath, 'utf8');
const registryContent = fs.readFileSync(registryPath, 'utf8');

const slugMatches = [...catalogContent.matchAll(/slug:\s*["']([^"']+)["']/g)];
const slugs = slugMatches.map(m => m[1]);

let missingInRegistry = [];

slugs.forEach(slug => {
  if (!registryContent.includes(`"${slug}":`) && !registryContent.includes(`'${slug}':`)) {
    missingInRegistry.push(slug);
  }
});

console.log(`Total Tools in Catalog: ${slugs.length}`);
console.log(`Missing Formulas in Registry: ${missingInRegistry.length}`);
if (missingInRegistry.length > 0) {
  console.log(`First 10 missing: ${missingInRegistry.slice(0, 10).join(', ')}`);
}
