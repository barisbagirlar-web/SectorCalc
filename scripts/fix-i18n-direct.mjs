import { readFileSync, writeFileSync } from 'fs';
const D = '/Users/macair1/projects/SectorCalc/src/lib/premium-schema/schemas';

const fixes = {
  'scaffold-rental-cost-analyzer.ts': {
    name: ['"en":"İskele Kiralama & Süre Optimizasyonu"', '"en":"Scaffold Rental & Duration Optimization"'],
    pain: [
      '"en":"İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur.","tr":"İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur."',
      '"en":"If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur.","tr":"İskele kiralama süresi ve alanı optimize edilmezse gereksiz kira, işçilik ve nakliye maliyeti oluşur."'
    ],
  },
  'sewing-line-balance-analyzer-pro.ts': {
    name: ['"en":"Dikiş Hattı Dengeleyici (Pro)"', '"en":"Sewing Line Balancer (Pro)"'],
    pain: [
      '"en":"Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir.","tr":"Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir."',
      '"en":"If SMV distribution is not balanced on the sewing line, line efficiency drops, WIP accumulates, and delivery is delayed.","tr":"Dikiş hattında SMV dağılımı dengelenmezse hat verimliliği düşer, WIP birikir ve teslimat gecikir."'
    ],
  },
  'subcontractor-margin-leak-analyzer.ts': {
    name: ['"en":"Taşeron Marj Kaçağı Analizi"', '"en":"Subcontractor Margin Leak Analysis"'],
    pain: [
      '"en":"Taşeron teklif marjı ile gerçekleşen marj arasındaki fark kontrol edilmezse proje kârlılığı sessizce erir.","tr":"Taşeron teklif marjı ile gerçekleşen marj arasındaki fark kontrol edilmezse proje kârlılığı sessizce erir."',
      '"en":"If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes.","tr":"Taşeron teklif marjı ile gerçekleşen marj arasındaki fark kontrol edilmezse proje kârlılığı sessizce erir."'
    ],
  },
  'supplier-currency-risk-analyzer.ts': {
    name: ['"en":"Tedarikçi Döviz Riski Analizi"', '"en":"Supplier Currency Risk Analysis"'],
    pain: [
      '"en":"Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur.","tr":"Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur."',
      '"en":"If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur.","tr":"Yabancı para tedarikçilerinde kur dalgalanması maliyeti hesaplanmazsa beklenmedik zararlar oluşur."'
    ],
  },
  'taguchi-quality-loss-analyzer.ts': {
    name: ['"en":"Taguchi Kalite Kaybı Analizi"', '"en":"Taguchi Quality Loss Analysis"'],
  },
};

for (const [file, f] of Object.entries(fixes)) {
  const path = D + '/' + file;
  let c = readFileSync(path, 'utf-8');
  let ch = 0;
  
  if (f.name && c.includes(f.name[0]) && !c.includes(f.name[1])) {
    c = c.replace(f.name[0], f.name[1]);
    ch++;
  }
  if (f.pain && c.includes(f.pain[0]) && !c.includes(f.pain[1])) {
    c = c.replace(f.pain[0], f.pain[1]);
    ch++;
  }
  
  if (ch > 0) {
    writeFileSync(path, c, 'utf-8');
    console.log('  ✓ ' + file + ': ' + ch + ' changes');
  } else {
    console.log('  - ' + file + ': no changes');
  }
}
