import "server-only";
import fs from "fs";
import path from "path";

export interface FreeFormulaModuleConfig {
  toolKey: string;
  file: string;
}

// Auto-discover all free-v531 formula modules
function discoverFreeFormulaModules(): FreeFormulaModuleConfig[] {
  const dir = path.join(process.cwd(), "src/sectorcalc/formulas/free-v531");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith(".formula.ts") && f !== "free-v531-formula-registry.ts")
    .sort();

  return files.map((f) => ({
    toolKey: f.replace(/\.formula\.ts$/, ""),
    file: f,
  }));
}

export const FREE_FORMULA_CONFIGS: FreeFormulaModuleConfig[] = discoverFreeFormulaModules();

// Lazy-loaded module cache
const moduleCache = new Map<string, any>();

export function getFreeFormulaModuleSync(toolKey: string): any | null {
  if (moduleCache.has(toolKey)) {
    return moduleCache.get(toolKey);
  }
  return null;
}

export function setFreeFormulaModule(toolKey: string, mod: any): void {
  moduleCache.set(toolKey, mod);
}

export async function loadFreeFormulaModule(
  toolKey: string,
): Promise<{ toolKey: string; formulaVersion: string; calculate: (inputs: Record<string, number>) => any } | null> {
  const cached = getFreeFormulaModuleSync(toolKey);
  if (cached) return cached;

  const config = FREE_FORMULA_CONFIGS.find((c) => c.toolKey === toolKey);
  if (!config) return null;

  try {
    const mod = await import(`./${config.file.replace(".ts", "")}`);
    const module_ = {
      toolKey: mod.toolKey,
      formulaVersion: mod.formulaVersion,
      calculate: mod.calculate,
    };
    setFreeFormulaModule(toolKey, module_);
    return module_;
  } catch {
    return null;
  }
}

export function listFreeFormulaToolKeys(): string[] {
  return FREE_FORMULA_CONFIGS.map((c) => c.toolKey).sort();
}
