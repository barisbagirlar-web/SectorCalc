import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const migrations = JSON.parse(fs.readFileSync('slug-migrations.json', 'utf8'));
const oldSlugs = Object.keys(migrations);

function getNewSlug(oldSlug) {
  return migrations[oldSlug];
}

const files = globSync('**/*.{ts,tsx,js,jsx,mjs,json,md,txt,py}', {
  ignore: ['node_modules/**', '.git/**', '.next/**', '_safe_vault/**', 'archive/**', 'dist/**', 'build/**'],
  nodir: true
});

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const oldSlug of oldSlugs) {
    if (content.includes(oldSlug)) {
      content = content.split(oldSlug).join(migrations[oldSlug]);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated content in ${file}`);
  }
}

// Now rename files that contain the old slug
const allFilesForRename = globSync('**/*', {
  ignore: ['node_modules/**', '.git/**', '.next/**', '_safe_vault/**', 'archive/**', 'dist/**', 'build/**'],
  nodir: true
});

for (const file of allFilesForRename) {
  const basename = path.basename(file);
  for (const oldSlug of oldSlugs) {
    if (basename.includes(oldSlug)) {
      const newBasename = basename.replace(oldSlug, migrations[oldSlug]);
      const newPath = path.join(path.dirname(file), newBasename);
      fs.renameSync(file, newPath);
      console.log(`Renamed file: ${file} -> ${newPath}`);
    }
  }
}

console.log("Renaming complete.");
