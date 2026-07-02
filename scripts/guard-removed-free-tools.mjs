import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const GOVERNANCE_FILE = path.join(ROOT_DIR, 'data/governance/removed-free-tools.json');

const ACTIVE_ROOTS = ['src', 'data', 'public', 'generated', 'scripts'];
const EXCLUDED_DIRS = ['.git', '.next', '.firebase', 'node_modules', 'out', 'dist', 'coverage', '.turbo'];
const EXCLUDED_FILES = [
  'data/governance/removed-free-tools.json',
  'scripts/guard-removed-free-tools.mjs'
];

function loadGovernanceList() {
  if (!fs.existsSync(GOVERNANCE_FILE)) {
    console.error(`Missing governance file: ${GOVERNANCE_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(GOVERNANCE_FILE, 'utf-8'));
}

const removedTools = loadGovernanceList();

// Ensure it has 57 entries per requirement
if (removedTools.length !== 57) {
  console.error(`Expected exactly 57 removed tools, found ${removedTools.length}.`);
  process.exit(1);
}

const tokensToSearch = [];
for (const tool of removedTools) {
  tokensToSearch.push(tool.slug);
  tokensToSearch.push(tool.name);
}

let scannedFilesCount = 0;
let failures = [];

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(ROOT_DIR, fullPath);

    // Skip excluded dirs
    if (EXCLUDED_DIRS.some(ex => relPath === ex || relPath.startsWith(ex + '/'))) {
      continue;
    }
    
    // Skip excluded files
    if (EXCLUDED_FILES.includes(relPath)) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile()) {
      // Check file name for slug
      for (const tool of removedTools) {
        if (file.includes(tool.slug)) {
          failures.push({ file: relPath, line: 'FILENAME', token: tool.slug, slug: tool.slug });
        }
      }

      // Check file content
      const ext = path.extname(file).toLowerCase();
      // Skip binary or large minified files
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.pdf', '.zip'].includes(ext)) {
        continue;
      }
      
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        scannedFilesCount++;
        
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Optimization: only search lines that might contain a match
          if (line.length === 0) continue;
          
          for (const tool of removedTools) {
            if (line.includes(tool.slug)) {
              failures.push({ file: relPath, line: i + 1, token: tool.slug, slug: tool.slug });
            } else if (line.includes(tool.name)) {
              failures.push({ file: relPath, line: i + 1, token: tool.name, slug: tool.slug });
            }
          }
        }
      } catch (err) {
        // Skip files that can't be read as utf-8
      }
    }
  }
}

for (const root of ACTIVE_ROOTS) {
  walkDir(path.join(ROOT_DIR, root));
}

if (failures.length > 0) {
  console.error("REMOVED_FREE_TOOLS_GUARD_FAIL=YES");
  console.error("Found removed Free Tools in active project surfaces:");
  for (const f of failures) {
    console.error(`- ${f.file}:${f.line} -> Found '${f.token}' (Slug: ${f.slug})`);
  }
  process.exit(1);
} else {
  console.log("REMOVED_FREE_TOOLS_GUARD_PASS=YES");
  console.log(`REMOVED_FREE_TOOLS_CHECKED=${removedTools.length}`);
  console.log(`ACTIVE_FILES_SCANNED=${scannedFilesCount}`);
  process.exit(0);
}
