import fs from 'fs';

const filePath = 'src/lib/tools/runtime-trust-engine.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /let calculationEligible = surface === "free" \? status === "ready" : paymentEligible;/g,
  'let calculationEligible = surface === "free" ? status !== "blocked" : paymentEligible;'
);

fs.writeFileSync(filePath, content);
