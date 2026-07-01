import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  "src/app/ai.txt/route.ts",
  "src/app/api/assistant/chat/route.ts",
  "src/app/api/assistant/route.ts",
  "src/app/api/external/webhook/route.ts",
  "src/app/faq-knowledge.txt/route.ts",
  "src/app/globals.css",
  "src/components/admin/CaseStudyAdminForm.tsx"
];

for (const file of filesToFix) {
  let content = readFileSync(file, 'utf8');

  // globals.css
  content = content.replace(/Tüm form elementleri için base stil/g, "Base style for all form elements");
  content = content.replace(/Select elementleri için özel düzenleme/g, "Custom layout for select elements");
  content = content.replace(/Form grupları için container/g, "Container for form groups");
  content = content.replace(/Input grupları \(prefix\/suffix için\)/g, "Input groups (for prefix/suffix)");
  content = content.replace(/Responsive düzenleme/g, "Responsive layout");
  content = content.replace(/Disabled ve readonly durumları/g, "Disabled and readonly states");
  content = content.replace(/Number input spinner kaldırma \(isteğe bağlı\)/g, "Remove number input spinner (optional)");

  // ai.txt
  content = content.replace(/Finansal analiz: Finans, Satış ve İşletme Sermayesi kategorisine bakın/g, "Financial analysis: See Finance, Sales and Working Capital category");

  // assistant chat
  content = content.replace(/Sistem şu anda yoğun\. Lütfen calculation ihtiyacınızı sektör araçlarıyla doğrudan tanımlayın\./g, "System is currently busy. Please define your calculation needs directly with sector tools.");

  // assistant route
  content = content.replace(/Çok fazla istek, lütfen biraz bekleyin\./g, "Too many requests, please wait a moment.");

  // webhook route
  content = content.replace(/Geçersiz webhook URL/g, "Invalid webhook URL");
  content = content.replace(/Webhook gönderilemedi/g, "Webhook failed to send");

  // faq-knowledge.txt
  content = content.replace(/\[de\] SectorCalc ist eine branchenspezifische Berechnungs- und Entscheidungsplattform\. Kostenlose Tools bieten schnelle/g, "[en] SectorCalc is a sector-specific calculation and decision platform. Free tools offer quick");
  content = content.replace(/\[de\] Pro-Berichte enthalten eine Aufschlüsselung versteckter Treiber, Schwellenwertinterpretation, Aktionsvorschläge un/g, "[en] Pro reports include a breakdown of hidden drivers, threshold interpretation, action suggestions an");
  content = content.replace(/\[de\] Nein\. SectorCalc-Ausgaben sind technische Schätzungen basierend auf Ihren Eingaben und genannten Annahmen\. Keine F/g, "[en] No. SectorCalc outputs are technical estimates based on your inputs and stated assumptions. No F");
  content = content.replace(/\[de\] Versteckte Verlustdiagnosen vergleichen Ihre Eingaben mit Schwellenwertbändern und decken Treiber auf, die kostenl/g, "[en] Hidden loss diagnostics compare your inputs with threshold bands and reveal drivers that costl");
  content = content.replace(/\[de\] Die Gesamtanlageneffektivität \(OEE\) kombiniert Verfügbarkeit, Leistung und Qualität, um die produktive Maschinenze/g, "[en] Overall Equipment Effectiveness (OEE) combines availability, performance, and quality to measure productive machine ti");

  // CaseStudyAdminForm.tsx
  content = content.replace(/Firestore\&apos;a yazılır ve public sayfa ISR ile güncellenir\./g, "written to Firestore and public page updated via ISR.");
  content = content.replace(/Slug\&apos;lar \(virgülle ayırın\)/g, "Slugs (comma separated)");
  content = content.replace(/Araç slug\&apos;larını virgülle ayırarak yazın\./g, "Enter tool slugs separated by commas.");

  writeFileSync(file, content, 'utf8');
}

console.log("Replacements done 2.");
