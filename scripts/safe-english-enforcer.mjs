import fs from 'fs';
import path from 'path';

console.log("=== SAFKAN İNGİLİZCE (ZORUNLU KÖK YÖNLENDİRME) BAŞLADI ===");

const routingConfigPath = path.join(process.cwd(), 'src/i18n/routing-config.ts');
if (fs.existsSync(routingConfigPath)) {
  let content = fs.readFileSync(routingConfigPath, 'utf8');
  content = content.replace(/localePrefix:\s*["']as-needed["']/, 'localePrefix: "never"');
  fs.writeFileSync(routingConfigPath, content, 'utf8');
  console.log("[+] routing-config.ts 'never' yapıldı.");
}

const dataDir = path.join(process.cwd(), 'src/data');
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f.includes('i18n'));
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (content.en) {
      ['tr', 'de', 'fr', 'es', 'ar'].forEach(lang => {
        if (content[lang]) {
          content[lang] = JSON.parse(JSON.stringify(content.en)); // Deep copy English to all
        }
      });
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      console.log(`[+] ${file} içindeki tüm yabancı diller EN ile overwrite edildi.`);
    }
  });
}

const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
if (fs.existsSync(middlewarePath)) {
  let content = fs.readFileSync(middlewarePath, 'utf8');
  
  // matcher güncellemesi
  content = content.replace(
    /"\/\(tr\|de\|fr\|es\|ar\)\/:path\*"\s*,/, 
    ''
  );

  // Eski dil rotalarına girenleri ana domain kök dizinine (en) yönlendir.
  // middleware() fonksiyonunun en başına şunu ekleyelim:
  const redirectInjection = `
  const urlPath = request.nextUrl.pathname;
  const langMatch = urlPath.match(/^\\/(tr|de|fr|es|ar)(\\/|$)(.*)/);
  if (langMatch) {
    const url = request.nextUrl.clone();
    url.pathname = '/' + (langMatch[3] || '');
    return NextResponse.redirect(url, 301);
  }
`;
  if (!content.includes('langMatch = urlPath.match')) {
    content = content.replace(
      'export default function middleware(request: NextRequest) {',
      'export default function middleware(request: NextRequest) {' + redirectInjection
    );
  }
  
  fs.writeFileSync(middlewarePath, content, 'utf8');
  console.log("[+] middleware.ts kök domain yönlendirmeleri active edildi.");
}

const localeSwitcherPath = path.join(process.cwd(), 'src/components/layout/LocaleSwitcher.tsx');
if (fs.existsSync(localeSwitcherPath)) {
  fs.writeFileSync(localeSwitcherPath, 'export default function LocaleSwitcher() { return null; }\n', 'utf8');
  console.log("[+] LocaleSwitcher arayüzden gizlendi.");
}

console.log("=== SAFKAN İNGİLİZCE OPERASYONU BİTTİ ===");
