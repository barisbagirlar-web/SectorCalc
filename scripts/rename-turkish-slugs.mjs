import fs from 'fs';
import path from 'path';

const map = {
  'doviz-pozisyonu-kur-farki-riski-hesabi': 'fx-position-exchange-rate-risk-calculator',
  'gurultu-ve-titresim-maruziyet-risk-maliyet-calculator': 'noise-vibration-exposure-risk-cost-calculator',
  'isg-gurultu-osha-ve-titresim-iso-5349-maruziyet-finansi-calculator-105': 'osh-noise-vibration-exposure-finance-calculator-105',
  '7-israf-muda-avcisi-parasal-karsilik-calculator': '7-wastes-muda-hunter-financial-calculator'
};

const DIRS_TO_SCAN = [
  'src/lib/premium-schema',
  'src/tools',
  'src/data',
  'src/app'
];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

let allFiles = [];
for (const dir of DIRS_TO_SCAN) {
  allFiles = getAllFiles(dir, allFiles);
}

// 1. Rename inside files
for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [tr, en] of Object.entries(map)) {
    if (content.includes(tr)) {
      // Regex replace all occurrences
      const regex = new RegExp(tr, 'g');
      content = content.replace(regex, en);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated contents in ${file}`);
  }
}

// 2. Rename files themselves
for (const file of allFiles) {
  for (const [tr, en] of Object.entries(map)) {
    if (file.includes(tr)) {
      const newFile = file.replace(tr, en);
      fs.renameSync(file, newFile);
      console.log(`Renamed file ${file} -> ${newFile}`);
    }
  }
}

console.log("Renaming complete.");
