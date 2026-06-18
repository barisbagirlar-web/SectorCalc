import { execSync } from "child_process";

console.log("🔍 Build hatalarını tespit ediyorum...");

try {
  execSync("npm run build 2>&1", {
    encoding: "utf-8",
    maxBuffer: 50 * 1024 * 1024,
    stdio: "pipe",
  });
  console.log("✅ Build başarılı!");
} catch (error: unknown) {
  const execError = error as { stdout?: string; stderr?: string };
  const output = execError.stdout || execError.stderr || String(error);
  const lines = output.split("\n");
  const errors = lines.filter(
    (line) =>
      line.includes("Error:") ||
      line.includes("Error occurred") ||
      line.includes("Failed to compile") ||
      line.includes("Failed to build") ||
      line.includes("prerender-error") ||
      line.includes("Export encountered an error"),
  );

  console.log("❌ Hata içeren satırlar:");
  errors.forEach((line) => console.log("  ", line.trim()));

  const pageErrors = lines.filter(
    (line) => line.includes("/page:") || line.includes("Generating static pages"),
  );
  console.log("\n📄 Sayfa bazlı hatalar:");
  pageErrors.forEach((line) => console.log("  ", line.trim()));

  process.exit(1);
}
