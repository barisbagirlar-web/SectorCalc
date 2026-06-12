#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = {
  en: {
    required: "{label} is required.",
    invalidNumber: "{label} must be a valid number.",
    min: "{label} must be at least {min}.",
    max: "{label} must be at most {max}.",
    contractNotFound: "Smart form contract not found for this tool.",
  },
  tr: {
    required: "{label} zorunludur.",
    invalidNumber: "{label} geçerli bir sayı olmalıdır.",
    min: "{label} en az {min} olmalıdır.",
    max: "{label} en fazla {max} olmalıdır.",
    contractNotFound: "Bu araç için akıllı form sözleşmesi bulunamadı.",
  },
  de: {
    required: "{label} ist erforderlich.",
    invalidNumber: "{label} muss eine gültige Zahl sein.",
    min: "{label} muss mindestens {min} sein.",
    max: "{label} darf höchstens {max} sein.",
    contractNotFound: "Smart-Form-Vertrag für dieses Tool nicht gefunden.",
  },
  fr: {
    required: "{label} est obligatoire.",
    invalidNumber: "{label} doit être un nombre valide.",
    min: "{label} doit être au moins {min}.",
    max: "{label} doit être au plus {max}.",
    contractNotFound: "Contrat de formulaire intelligent introuvable pour cet outil.",
  },
  es: {
    required: "{label} es obligatorio.",
    invalidNumber: "{label} debe ser un número válido.",
    min: "{label} debe ser al menos {min}.",
    max: "{label} debe ser como máximo {max}.",
    contractNotFound: "Contrato de formulario inteligente no encontrado para esta herramienta.",
  },
  ar: {
    required: "{label} مطلوب.",
    invalidNumber: "{label} يجب أن يكون رقماً صالحاً.",
    min: "{label} يجب أن يكون على الأقل {min}.",
    max: "{label} يجب ألا يزيد عن {max}.",
    contractNotFound: "لم يتم العثور على عقد النموذج الذكي لهذه الأداة.",
  },
};

for (const [locale, fieldValidation] of Object.entries(LOCALES)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.freeToolUi.fieldValidation = fieldValidation;
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched freeToolUi.fieldValidation → messages/${locale}.json`);
}
