const fs = require("fs");
let content = fs.readFileSync("docs/full_user_request_combined.txt", "utf8");
content = content.replace("n * Sicaklik * 8.314", "MaddeMiktari * Sicaklik * 8.314");
content = content.replace("Girdi (Sayı), ProsesGurultusu (Sayı)", "Girdi (Sayı), ProsesGurultusu (Sayı), KontrolGirdisi (Sayı)"); // tool 353
fs.writeFileSync("docs/full_user_request_combined.txt", content);

let script = fs.readFileSync("scripts/generate-new-free-tools.mjs", "utf8");
script = script.replace('registryBody += `    const ${varName} = normalizeNumber(values.${varName.toLowerCase()});\\n`;', `if (varType === "Metin") {
      registryBody += \`    const \${varName} = String(values.\${varName.toLowerCase()} || "");\\n\`;
    } else {
      registryBody += \`    const \${varName} = normalizeNumber(values.\${varName.toLowerCase()});\\n\`;
    }`);
fs.writeFileSync("scripts/generate-new-free-tools.mjs", script);
console.log("Done");
