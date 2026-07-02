import fs from 'fs';
import path from 'path';

const premiumSlugs = JSON.parse(fs.readFileSync('premium-slugs.json', 'utf8'));
const freeSlugs = JSON.parse(fs.readFileSync('free-slugs.json', 'utf8'));

const schemasDir = 'src/lib/features/premium-schema/schemas';
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let deletedTs = 0;
for (const file of files) {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/id:\s*"([^"]+)"/);
  if (match) {
    const id = match[1];
    if (!premiumSlugs.includes(id)) {
      console.log(`Deleting unused TS schema: ${file} (id: ${id})`);
      fs.unlinkSync(filePath);
      deletedTs++;
    }
  } else {
    // No ID match, maybe delete?
    console.log(`Warning: Could not parse id in ${file}`);
  }
}
console.log(`Deleted ${deletedTs} orphaned TS files.`);

// Delete data/pro-tools/_merged.json and data/pro-tools-universal/_merged.json
if (fs.existsSync('data/pro-tools/_merged.json')) {
  fs.unlinkSync('data/pro-tools/_merged.json');
}
if (fs.existsSync('data/pro-tools-universal/_merged.json')) {
  fs.unlinkSync('data/pro-tools-universal/_merged.json');
}

// Clean generated schemas completely because they will be rebuilt or are obsolete?
// No, the generated schemas are built by npm run build. If we delete them, we need to rebuild them. 
