import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const generatedDir = path.join(process.cwd(), "generated");
const toolFiles = fs
  .readdirSync(generatedDir)
  .filter((f) => f.endsWith(".ts"));

async function main(): Promise<void> {
  console.log("🚦 Smoke Test Başlıyor...");

  try {
    execSync("npx tsc --noEmit --project tsconfig.json", { stdio: "inherit" });
    console.log("✅ TypeScript derleme başarılı.");
  } catch {
    console.error("❌ TypeScript derleme hatası!");
    process.exit(1);
  }

  const samples = toolFiles.slice(0, 5);
  for (const file of samples) {
    const filePath = path.join(generatedDir, file);
    try {
      await import(pathToFileURL(filePath).href);
      console.log(`✅ ${file} import edildi.`);
    } catch (err) {
      console.error(`❌ ${file} import hatası:`, err);
      process.exit(1);
    }
  }

  console.log("🎉 Smoke test başarılı.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
