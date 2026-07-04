import { readFileSync, writeFileSync } from 'fs';
const D = '/Users/macair1/projects/SectorCalc/src/lib/premium-schema/schemas';

const fixes = {
  'scaffold-rental-cost-analyzer.ts': {
    name: ['"en":"İskele Leasing & Süre Optimizasyonu"', '"en":"Scaffold Rental & Duration Optimization"'],
    pain: [
      '"en":"İskele leasing süresi ve areaı optimize edilmezse gereksiz rent, işçilik ve nakliye cost oluşur.","tr":"İskele leasing süresi ve areaı optimize edilmezse gereksiz rent, işçilik ve nakliye cost oluşur."',
      '"en":"If scaffold rental duration and area are not optimized, unnecessary rent, labor, and transportation costs occur.","tr":"İskele leasing süresi ve areaı optimize edilmezse gereksiz rent, işçilik ve nakliye cost oluşur."'
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
    name: ['"en":"Taşeron Margin Kaçağı Analysis"', '"en":"Subcontractor Margin Leak Analysis"'],
    pain: [
      '"en":"Taşeron teklif marginı ile gerçekleşen margin arasındaki fark control edilmezse project kârlılığı sessizce erir.","tr":"Taşeron teklif marginı ile gerçekleşen margin arasındaki fark control edilmezse project kârlılığı sessizce erir."',
      '"en":"If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes.","tr":"Taşeron teklif marginı ile gerçekleşen margin arasındaki fark control edilmezse project kârlılığı sessizce erir."'
    ],
  },
  'supplier-currency-risk-analyzer.ts': {
    name: ['"en":"Supplyçi Döviz Riski Analysis"', '"en":"Supplier Currency Risk Analysis"'],
    pain: [
      '"en":"Yabancı para supplyçilerinde kur dalgalanması cost hesaplanmazsa beklenmedik zararlar oluşur.","tr":"Yabancı para supplyçilerinde kur dalgalanması cost hesaplanmazsa beklenmedik zararlar oluşur."',
      '"en":"If the cost of exchange rate fluctuations is not calculated for foreign currency suppliers, unexpected losses occur.","tr":"Yabancı para supplyçilerinde kur dalgalanması cost hesaplanmazsa beklenmedik zararlar oluşur."'
    ],
  },
  'taguchi-quality-loss-analyzer.ts': {
    name: ['"en":"Taguchi Quality Kaybı Analysis"', '"en":"Taguchi Quality Loss Analysis"'],
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
