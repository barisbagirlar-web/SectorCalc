import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const SCHEMAS_DIR = path.join(ROOT, 'generated', 'schemas');

if (!fs.existsSync(SCHEMAS_DIR)) {
  console.log("No schemas directory found.");
  process.exit(0);
}

const files = fs.readdirSync(SCHEMAS_DIR, { withFileTypes: true });

let movedCount = 0;

for (const file of files) {
  if (file.isFile() && file.name.endsWith('-schema.json')) {
    const firstChar = file.name.charAt(0).toLowerCase();
    // Use alphanumeric only, otherwise fallback to 'other'
    let dirName = 'other';
    if (/[a-z0-9]/.test(firstChar)) {
      dirName = firstChar;
    }
    
    const targetDir = path.join(SCHEMAS_DIR, dirName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const oldPath = path.join(SCHEMAS_DIR, file.name);
    const newPath = path.join(targetDir, file.name);
    fs.renameSync(oldPath, newPath);
    movedCount++;
  }
}

console.log(`Sharded ${movedCount} schemas into subdirectories.`);
