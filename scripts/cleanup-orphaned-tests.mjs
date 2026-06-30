import fs from "fs";
import path from "path";

const testsDir = path.join(process.cwd(), "src/lib/__tests__/generated");
const generatedDir = path.join(process.cwd(), "generated");

const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith(".test.ts"));

let removed = 0;
for (const testFile of testFiles) {
  const baseName = testFile.replace(".test.ts", "");
  const expectedSourceFile = path.join(generatedDir, `${baseName}.ts`);
  
  if (!fs.existsSync(expectedSourceFile)) {
    fs.unlinkSync(path.join(testsDir, testFile));
    removed++;
  }
}

console.log(`Cleaned up ${removed} orphaned test files.`);
