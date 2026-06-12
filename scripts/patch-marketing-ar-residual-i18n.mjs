#!/usr/bin/env node
/** Fix remaining AR marketing strings with English fragments / glossary corruption. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const path = join(ROOT, "messages/ar.json");
const messages = JSON.parse(readFileSync(path, "utf8"));

Object.assign(messages.premiumSeo, {
  intro:
    "يساعدك {tool} على اختبار العمل قبل الالتزام بالسعر. يحوّل تكاليفك وكمياتك ونسبك إلى قراءة واضحة للهامش والمخاطر حتى تلاحظ العوامل الخفية التي تآكل الربح وتقرر بثقة بدلاً من التخمين.",
  help: "يطبّق محرك الحساب الحتمي في SectorCalc على مدخلاتك ثم يبرز العوامل الأكثر تأثيراً على النتيجة. تحصل على قراءة منظمة يمكنك الدفاع عنها — وليس رقماً في صندوق أسود.",
});

Object.assign(messages.auditArchive, {
  signInPrompt: "سجّل الدخول لتحميل خزينة التدقيق الشخصية من Firestore.",
});

Object.assign(messages.errors, {
  networkError: "فشل الاتصال. تحقق من الشبكة وحاول مرة أخرى.",
});

Object.assign(messages.premiumAccess, {
  publicPreviewDescription:
    "أدخل مدخلات العمل وتحقق من النموذج وشغّل حساباً تجريبياً. التصدير والتقارير المحفوظة وملخص الحساب يتطلبان SectorCalc Pro.",
  signedInPreviewDescription:
    "يمكنك تشغيل الحاسبة ومراجعة قرار المعاينة. تصدير PDF وسجل المحفوظات وملخص الحساب يتطلبان خطة Pro نشطة أو شراء تقرير واحد.",
  panelDescription:
    "سجّل الدخول عبر Google للوصول إلى الحاسبات المميزة أو متابعة الدفع. تسجيل دخول المسؤول منفصل في الأعلى.",
  getPro: "احصل على Pro",
  signInErrors: {
    ...messages.premiumAccess.signInErrors,
    "unauthorized-domain":
      "هذا النطاق غير مصرّح لتسجيل الدخول عبر Google. استخدم sectorcalc.com أو أضف النطاق في Firebase Console → Authentication → Authorized domains.",
    network: "خطأ في الشبكة أثناء تسجيل الدخول. تحقق من الاتصال وحاول مرة أخرى.",
    generic: "فشل تسجيل الدخول. حاول مرة أخرى أو استخدم متصفحاً مختلفاً.",
  },
});

writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
console.log("Patched AR residual marketing strings");
