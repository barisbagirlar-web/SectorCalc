import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src", "data");

function processJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    let modified = false;

    // A generic deep clean function to delete any 'tr' keys and remove _i18n objects if they only contain 'en'
    function deepClean(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(deepClean);
      } else if (obj !== null && typeof obj === "object") {
        if ("tr" in obj) {
          delete obj["tr"];
          modified = true;
        }
        for (const key in obj) {
          deepClean(obj[key]);
        }
      }
    }

    deepClean(data);

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
      console.log(`Cleaned JSON: ${filePath}`);
    }
  } catch (e) {
    console.error(`Error processing JSON ${filePath}:`, e);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      walk(fullPath);
    } else if (file.isFile() && fullPath.endsWith(".json")) {
      processJsonFile(fullPath);
    }
  }
}

walk(ROOT);
console.log("Purge complete.");
