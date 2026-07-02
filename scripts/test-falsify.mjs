import fs from "fs";
import { globSync } from "glob";
const files=globSync("src/**/formula-registry.*");
const reg=files.map(f=>fs.readFileSync(f,"utf8")).join("\n");
const keys=new Set([...reg.matchAll(/num\(\s*i\s*,\s*["']([^"']+)["']\s*\)/g)].map(m=>m[1]));
console.log("registry files:",files);
console.log("registry chars:",reg.length);
console.log("used keys:",keys.size);
console.log("rawVolume present?",keys.has("rawVolume"));
