import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const generatedDir = path.join(process.cwd(), "generated");
const testResults: { file: string; status: "PASS" | "FAIL"; error?: string }[] =
  [];

const toolFiles = fs
  .readdirSync(generatedDir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts");

console.log(`🧪 Test ediliyor: ${toolFiles.length} tool dosyası\n`);

for (const file of toolFiles) {
  const filePath = path.join(generatedDir, file);
  const importUrl = pathToFileURL(filePath).href;
  console.log(`🔍 ${file} ...`);
  try {
    execSync(
      `npx tsx -e "import('${importUrl}').then(() => { console.log('✅ import ok'); process.exit(0); }).catch((err) => { console.error(err); process.exit(1); })"`,
      {
        stdio: "pipe",
        timeout: 10000,
      },
    );
    testResults.push({ file, status: "PASS" });
    console.log("   ✅ PASS");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    testResults.push({ file, status: "FAIL", error: message });
    console.log(`   ❌ FAIL: ${message}`);
  }
}

console.log("\n📊 RAPOR:");
console.log(
  `Toplam: ${testResults.length}, Başarılı: ${testResults.filter((r) => r.status === "PASS").length}, Başarısız: ${testResults.filter((r) => r.status === "FAIL").length}`,
);
if (testResults.some((r) => r.status === "FAIL")) {
  console.log("Başarısız dosyalar:");
  testResults
    .filter((r) => r.status === "FAIL")
    .forEach((r) => console.log(`  - ${r.file}: ${r.error}`));
  process.exit(1);
} else {
  console.log("🎉 Tüm dosyalar geçti.");
}
