#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [, , sourceArgument, destinationArgument] = process.argv;

if (!sourceArgument || !destinationArgument) {
  console.error("Usage: node scripts/redact-deploy-log.mjs <source> <destination>");
  process.exit(2);
}

const sourcePath = resolve(sourceArgument);
const destinationPath = resolve(destinationArgument);
const maximumBytes = 25 * 1024 * 1024;

const source = readFileSync(sourcePath);
if (source.length > maximumBytes) {
  throw new Error(`Deploy log exceeds ${maximumBytes} bytes: ${sourcePath}`);
}
if (source.includes(0)) {
  throw new Error(`Refusing to publish binary deploy log: ${sourcePath}`);
}

let text = source.toString("utf8");

const exactSecrets = [
  process.env.FIREBASE_TOKEN,
  process.env.GH_TOKEN,
  process.env.GITHUB_TOKEN,
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
]
  .filter((value) => typeof value === "string" && value.length >= 8)
  .sort((left, right) => right.length - left.length);

for (const secret of exactSecrets) {
  text = text.split(secret).join("[REDACTED]");
}

const redactionRules = [
  [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi,
    "[REDACTED_PRIVATE_KEY]",
  ],
  [
    /((?:authorization|proxy-authorization)\s*[:=]\s*(?:bearer|basic)\s+)[^\s"']+/gi,
    "$1[REDACTED]",
  ],
  [
    /([?&](?:access_token|refresh_token|token|firebase_token|auth|key)=)[^&\s"']+/gi,
    "$1[REDACTED]",
  ],
  [
    /("(?:access_token|refresh_token|token|firebase_token|private_key|client_secret|password)"\s*:\s*")[^"]*(")/gi,
    "$1[REDACTED]$2",
  ],
  [
    /((?:FIREBASE_TOKEN|GH_TOKEN|GITHUB_TOKEN|GOOGLE_APPLICATION_CREDENTIALS|CLIENT_SECRET|PRIVATE_KEY|PASSWORD)\s*=\s*)[^\s]+/gi,
    "$1[REDACTED]",
  ],
  [
    /(ya29\.[A-Za-z0-9._-]+)/g,
    "[REDACTED_GOOGLE_ACCESS_TOKEN]",
  ],
];

for (const [pattern, replacement] of redactionRules) {
  text = text.replace(pattern, replacement);
}

mkdirSync(dirname(destinationPath), { recursive: true });
writeFileSync(destinationPath, text, "utf8");
console.log(`DEPLOY_LOG_REDACTION=PASS source=${sourcePath} destination=${destinationPath}`);
