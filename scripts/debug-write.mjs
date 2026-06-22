import fs from "fs";
import path from "path";

const file = path.resolve(process.cwd(), "src/lib/premium-schema/schemas/kaizen-savings-tracker-analyzer.ts");

// Read before
const before = fs.readFileSync(file, "utf-8");
console.log("BEFORE length:", before.length);
console.log("BEFORE name_i18n has Turkish:", before.includes('name_i18n: {"en":"Kaizen Tasarruf Takipçisi'));

// Write a test marker
const marker = "// DEBUG_MARKER\n";
const testContent = marker + before;

// Check if write is successful
try {
  fs.writeFileSync(file, testContent, "utf-8");
  console.log("Write successful");
} catch (e) {
  console.log("Write FAILED:", e.message);
}

// Read back immediately
const afterWrite = fs.readFileSync(file, "utf-8");
console.log("AFTER WRITE length:", afterWrite.length);
console.log("AFTER WRITE has marker:", afterWrite.startsWith("// DEBUG_MARKER"));

// Wait and read again
await new Promise(r => setTimeout(r, 500));

const afterDelay = fs.readFileSync(file, "utf-8");
console.log("AFTER DELAY length:", afterDelay.length);
console.log("AFTER DELAY has marker:", afterDelay.startsWith("// DEBUG_MARKER"));
console.log("Content REVERTED:", afterDelay === before);

// Restore
fs.writeFileSync(file, before, "utf-8");
console.log("RESTORED");
