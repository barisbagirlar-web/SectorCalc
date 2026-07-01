import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filesToFix = [
  "src/components/admin/CaseStudyAdminForm.tsx",
  "src/components/admin/CaseStudyEditor.tsx",
  "src/components/admin/ImageUpload.tsx",
  "src/components/assistant/AssistantGate.tsx",
  "src/components/interpretation/EngineeringInterpretationPanel.tsx",
  "src/components/assistant/SectorCalcAssistant.tsx"
];

for (const file of filesToFix) {
  let content = readFileSync(file, 'utf8');

  // CaseStudyAdminForm.tsx
  content = content.replace(/Yeni Basarı Hikayesi/g, "New Case Study");
  content = content.replace(/Basarı Hikayesini Duzenle/g, "Edit Case Study");
  content = content.replace(/Başlık zorunludur/g, "Title is required");
  content = content.replace(/Taslak kaydedildi ve JSON indirildi\. Yayına almak için repo dosyalarını güncelleyip deploy edin\./g, "Draft saved and JSON downloaded. To publish, update repo files and deploy.");
  content = content.replace(/Taslak kaydedildi ve JSON indirildi\. Yayına almak için dosyayı repoya ekleyin\./g, "Draft saved and JSON downloaded. To publish, add the file to the repo.");
  content = content.replace(/Yönetici oturumu bulunamadı\. Lütfen tekrar giriş yapın\./g, "Admin session not found. Please log in again.");
  content = content.replace(/Yayınlanamadı\./g, "Could not publish.");
  content = content.replace(/Başarı hikayesi Firestore'a yayınlandı\. Public sayfa en geç 60 saniye içinde güncellenir\./g, "Case study published to Firestore. Public page updates within 60 seconds.");
  content = content.replace(/Bağlantı hatası\. Lütfen tekrar deneyin\./g, "Connection error. Please try again.");
  content = content.replace(/Yönetici erişimi kontrol ediliyor…/g, "Checking admin access...");
  content = content.replace(/Başarı hikayesi taslaklarını düzenlemek için yönetici hesabıyla giriş yapın\./g, "Log in with an admin account to edit case study drafts.");
  content = content.replace(/Basit editör/g, "Simple editor");
  content = content.replace(/Listeye Dön/g, "Back to List");
  content = content.replace(/Tüm alanları doldurun\. Kaydet ile tarayıcı taslağı ve JSON paketi oluşturulur; Yayınla ile/g, "Fill all fields. Save creates a browser draft and JSON package; Publish writes to");
  content = content.replace(/Firestore'a yazılır ve public sayfa ISR ile güncellenir\./g, "Firestore and updates the public page via ISR.");
  content = content.replace(/Bu hikaye statik dosyalardan yayında\. Kaydetme yalnızca tarayıcı taslağı oluşturur ve/g, "This story is live from static files. Saving only creates a browser draft and");
  content = content.replace(/JSON dışa aktarır\./g, "exports JSON.");
  content = content.replace(/Kimlik ve Künye/g, "Identity and Details");
  content = content.replace(/Yayın Tarihi/g, "Publish Date");
  content = content.replace(/Okuma Süresi \(dk\)/g, "Reading Time (min)");
  content = content.replace(/Başlık \(H1\) \*/g, "Title (H1) *");
  content = content.replace(/Örn: CNC Atölyesi OEE'sini %18'den %61'e Çıkardı/g, "Ex: CNC Shop Increased OEE from 18% to 61%");
  content = content.replace(/Alt Başlık/g, "Subtitle");
  content = content.replace(/Kısa özet cümlesi…/g, "Short summary sentence...");
  content = content.replace(/Sektör/g, "Sector");
  content = content.replace(/Örn: Otomotiv Yan Sanayi/g, "Ex: Automotive Supply Industry");
  content = content.replace(/Konum ve Süre/g, "Location and Duration");
  content = content.replace(/Ülke/g, "Country");
  content = content.replace(/Örn: Almanya/g, "Ex: Germany");
  content = content.replace(/Şehir/g, "City");
  content = content.replace(/Örn: Stuttgart/g, "Ex: Stuttgart");
  content = content.replace(/Proje Süresi/g, "Project Duration");
  content = content.replace(/Örn: Ocak 2026 – Mayıs 2026/g, "Ex: January 2026 – May 2026");
  content = content.replace(/Kullanılan Araçlar/g, "Tools Used");
  content = content.replace(/Slug'lar \(virgülle ayırın\)/g, "Slugs (comma separated)");
  content = content.replace(/Araç slug'larını virgülle ayırarak yazın\./g, "Enter tool slugs separated by commas.");
  content = content.replace(/Kapak Görseli \(URL\)/g, "Cover Image (URL)");
  content = content.replace(/Statik dosya yolu girin\. Örn: \/img\/case-studies\/kapak\.jpg/g, "Enter static file path. Ex: /img/case-studies/cover.jpg");
  content = content.replace(/Hikaye \(Zorluk \/ Çözüm\)/g, "Story (Challenge / Solution)");
  content = content.replace(/Müşterinin karşılaştığı problemi yazın\.\.\./g, "Write the problem faced by the customer...");
  content = content.replace(/Çözüm \(Solution\)/g, "Solution");
  content = content.replace(/Hangi modüller kullanıldı, hangi standartlar uygulandı\?/g, "Which modules were used, which standards were applied?");
  content = content.replace(/Sonuçlar \(Metrikler\)/g, "Results (Metrics)");
  content = content.replace(/Metrik adı/g, "Metric name");
  content = content.replace(/Önce/g, "Before");
  content = content.replace(/Metrik satırını sil/g, "Delete metric row");
  content = content.replace(/Müşteri Görüşü \(Opsiyonel\)/g, "Customer Feedback (Optional)");
  content = content.replace(/Müşteri sözü\.\.\./g, "Customer quote...");
  content = content.replace(/Şirket/g, "Company");
  content = content.replace(/Vazgeç/g, "Cancel");
  content = content.replace(/Kaydediliyor…/g, "Saving...");
  content = content.replace(/Kaydet & JSON İndir/g, "Save & Download JSON");
  content = content.replace(/Yayınlanıyor…/g, "Publishing...");
  content = content.replace(/Yayınla/g, "Publish");

  // CaseStudyEditor.tsx
  content = content.replace(/Baglantı URL'si girin/g, "Enter Link URL");
  content = content.replace(/Kalın/g, "Bold");
  content = content.replace(/İtalik/g, "Italic");
  content = content.replace(/Madde işaretli liste/g, "Bulleted list");
  content = content.replace(/Numaralı liste/g, "Numbered list");
  content = content.replace(/Bağlantı ekle/g, "Add link");

  // ImageUpload.tsx
  content = content.replace(/Görseli kaldır/g, "Remove image");

  // AssistantGate.tsx
  content = content.replace(/Trace AI popup devre dışı\. AssistantGate hiçbir şey render etmez\./g, "Trace AI popup disabled. AssistantGate renders nothing.");

  // SectorCalcAssistant.tsx
  content = content.replace(/Überprüfen Sie/g, "Uberprufen Sie");

  // EngineeringInterpretationPanel.tsx
  content = content.replace(/جودة البيانا/g, "data_quality_ar");

  writeFileSync(file, content, 'utf8');
}

console.log("Replacements done.");
