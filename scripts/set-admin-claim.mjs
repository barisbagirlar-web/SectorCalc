// DOSYA: scripts/set-admin-claim.mjs

import admin from "firebase-admin";

const uid = process.argv[2];

if (!uid) {
  console.error("Kullanım: node scripts/set-admin-claim.mjs FIREBASE_AUTH_UID");
  process.exit(1);
}

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!rawServiceAccount) {
  console.error("Eksik env: FIREBASE_SERVICE_ACCOUNT_JSON");
  process.exit(1);
}

let serviceAccount;

try {
  serviceAccount = JSON.parse(rawServiceAccount);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON geçerli JSON değil.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

try {
  await admin.auth().setCustomUserClaims(uid, { admin: true });

  console.log("✅ Admin claim verildi.");
  console.log(`UID: ${uid}`);
  console.log("Claim: { admin: true }");
  console.log("Kullanıcı çıkış/giriş yapmalı veya token yenilemeli.");
} catch (error) {
  console.error("Admin claim verilemedi:", error);
  process.exit(1);
}
