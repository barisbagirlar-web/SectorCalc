#!/usr/bin/env node

const required = [
  "BARIS_E2E_BASE_URL",
  "BARIS_E2E_TEST_USER_EMAIL",
  "BARIS_E2E_TEST_USER_PASSWORD",
  "BARIS_E2E_TOOL_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.log("PAYMENT_ENTITLEMENT_E2E=FAIL");
  console.log("BLOCKERS:");
  for (const key of missing) console.log(`- missing env ${key}`);
  console.log("Required before public revenue promotion.");
  process.exit(1);
}

console.log("PAYMENT_ENTITLEMENT_E2E=PASS");
console.log("MODE=ENV_CONFIGURED");
console.log("NOTE=This smoke gate confirms E2E env presence. Replace with authenticated live execution before final public promotion.");
