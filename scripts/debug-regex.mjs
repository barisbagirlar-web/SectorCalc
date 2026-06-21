import { readFileSync } from "node:fs";

const c = readFileSync(
  "src/lib/premium-schema/schemas/absenteeism-cost-analyzer.ts",
  "utf8"
);

// Direct regex test
console.log("Char at 369:", c.charCodeAt(369), JSON.stringify(c[369]));
console.log("Char at 370:", c.charCodeAt(370), JSON.stringify(c[370]));

// Build the same way as the script
const reStr = "\\\\b" + "painStatement" + "\\\\s*\"";
console.log("reStr:", JSON.stringify(reStr));
const re = new RegExp(reStr, "g");
console.log("RegExp source:", re.source);
console.log("Match:", re.exec(c) ? "YES" : "NO");

// Try without g flag
const re2 = new RegExp(reStr);
console.log("Match2:", re2.exec(c) ? "YES" : "NO");

// Check what the script actually produces:
const key = "painStatement";
const scriptRe = new RegExp(`\\b${key}:\\s*"`, "g");
console.log("Script regex source:", scriptRe.source);
console.log("Script match:", scriptRe.exec(c) ? "YES" : "NO");
