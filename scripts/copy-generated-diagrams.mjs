import * as fs from "node:fs";
import * as path from "node:path";

const SOURCE_DIR = path.join(process.cwd(), "generated", "schemas");
const TARGET_DIR = path.join(process.cwd(), "public", "generated", "schemas");

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.warn("copy-generated-diagrams: source directory missing, skipping.");
    return;
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });

  const svgFiles = fs.readdirSync(SOURCE_DIR).filter((name) => name.endsWith("-diagram.svg"));
  for (const fileName of svgFiles) {
    fs.copyFileSync(path.join(SOURCE_DIR, fileName), path.join(TARGET_DIR, fileName));
  }

  console.log(`copy-generated-diagrams: copied ${svgFiles.length} SVG files to public/generated/schemas/`);
}

main();
