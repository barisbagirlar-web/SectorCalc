import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

type TestResult = { file: string; status: "PASS" | "FAIL"; error?: string };

async function main(): Promise<void> {
  const generatedDir = path.join(process.cwd(), "generated");
  const testResults: TestResult[] = [];

  if (!fs.existsSync(generatedDir)) {
    console.log("🧪 generated/ yok — 0 tool dosyası (clean slate OK)\n");
    console.log("📊 RAPOR:");
    console.log("Toplam: 0, Başarılı: 0, Başarısız: 0");
    console.log("🎉 Tüm dosyalar geçti.");
    return;
  }

  const toolFiles = fs
    .readdirSync(generatedDir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();

  console.log(`🧪 Test ediliyor: ${toolFiles.length} tool dosyası\n`);

  for (const file of toolFiles) {
    const filePath = path.join(generatedDir, file);
    const importUrl = pathToFileURL(filePath).href;
    console.log(`🔍 ${file} ...`);
    try {
      await import(importUrl);
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
    process.exitCode = 1;
    return;
  }

  console.log("🎉 Tüm dosyalar geçti.");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`❌ test:generated runner failed: ${message}`);
  process.exit(1);
});
