const fs = require('fs');

function replaceFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  content = replacer(content);
  fs.writeFileSync(path, content);
}

// 1. PremiumPrintableReport.tsx
replaceFile('src/components/reports/PremiumPrintableReport.tsx', c => c.replace(/Record<"en" \| "tr"/g, 'Record<SupportedLocale').replace(/formatLocale === "tr"/g, 'false'));

// 2. metadata.ts
replaceFile('src/lib/metadata.ts', c => c.replace(/locale\.toUpperCase\(\)/g, '"EN"').replace(/locale === "tr"/g, 'false').replace(/locale === "de"/g, 'false').replace(/locale === "fr"/g, 'false').replace(/locale === "es"/g, 'false').replace(/locale === "ar"/g, 'false'));

// 3. premium-report-export.ts
replaceFile('src/lib/premium-schema/premium-report-export.ts', c => c.replace(/locale === "tr"/g, 'false'));

// 4. runtime-readiness.ts
replaceFile('src/lib/tools/runtime-readiness.ts', c => c.replace(/locale === "tr"/g, 'false'));

// 5. regional-parameters.ts
replaceFile('src/lib/regional/regional-parameters.ts', c => c.replace(/TR: "TRY",/g, ''));

// 6. regions.ts
replaceFile('src/lib/regional/regions.ts', c => c.replace(/"TR", "DE", "FR", "ES", "AR"/g, '""').replace(/"TR"/g, '""').replace(/"DE"/g, '""'));

// 7. unit-defaults.ts
replaceFile('src/lib/regional/unit-defaults.ts', c => c.replace(/regionCode === "AR"/g, 'false'));

// 8. unit-systems.ts
replaceFile('src/lib/regional/unit-systems.ts', c => c.replace(/TR: \["metric"\],/g, ''));

