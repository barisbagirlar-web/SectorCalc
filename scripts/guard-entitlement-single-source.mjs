#!/usr/bin/env node
/**
 * guard-entitlement-single-source.mjs
 *
 * Fails if session-create ve execute FARKLI Firestore path'lerinden entitlement okuyor.
 * Kanitlanmis bug: session-create -> users/{uid}/credits/balance
 *                  execute        -> users/{uid}.barisProKeys  (ESKI, YANLIS)
 * Fix sonrasi ikisi de credits/balance okumali.
 *
 * Kullanim: node guard-entitlement-single-source.mjs \
 *   src/lib/credits/tool-usage-session.server.ts \
 *   src/sectorcalc/pro-commerce/baris-entitlement-guard.ts
 */
import { readFileSync } from "node:fs";

const [sessionFile, executeFile] = process.argv.slice(2);
if (!sessionFile || !executeFile) {
  console.error(
    "kullanim: node guard-entitlement-single-source.mjs <session-create-dosyasi> <execute-entitlement-dosyasi>",
  );
  process.exit(2);
}

const s = readFileSync(sessionFile, "utf8");
const e = readFileSync(executeFile, "utf8");

// session-create'in okudugu path: users/{uid}/credits/balance
const sessionPath = /collection\(["']users["']\)\.doc\([^)]*\)\.collection\(["']credits["']\)\.doc\(["']balance["']\)/.test(
  s,
);
if (!sessionPath) {
  console.log(
    "FAIL  session-create dosyasinda beklenen users/{uid}/credits/balance path'i bulunamadi — dosya degismis olabilir, guard'i guncelle",
  );
  process.exit(1);
}

// execute'un HALA eski barisProKeys top-level path'i okuyup okumadigi (regresyon)
const stillReadsLegacy = /userData\??\.\s*barisProKeys|["']barisProKeys["']\s*in\s+userData|doc\(ctx\.userId\)\.get\(\)[^;]*barisProKeys/.test(
  e,
);
// execute'un yeni credits/balance path'ini okuyup okumadigi
const readsNewPath = /collection\(["']users["']\)\.doc\([^)]*\)\.collection\(["']credits["']\)\.doc\(["']balance["']\)/.test(
  e,
);

if (readsNewPath) {
  console.log("PASS  execute credits/balance'dan okuyor (tek-dogruluk kaynagi)");
  process.exit(0);
}
if (stillReadsLegacy) {
  console.log(
    "FAIL  execute hala SADECE barisProKeys okuyor, credits/balance yok -> musteri kredisi gorunmez (KANITLANMIS P0)",
  );
  process.exit(1);
}
console.log(
  "FAIL  execute'te ne credits/balance ne taninabilir bypass path'i bulundu -> guard'i elle dogrula",
);
process.exit(1);
