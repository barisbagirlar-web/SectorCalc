---
description: Görev tamamlama kapısı — verilen spesifikasyonun %100 uygulanması zorunludur
alwaysApply: true
---

# 04 — Completeness Gate (Tamamlama Kapısı)

Verilen bir görevde, kullanıcının sağladığı **orijinal spesifikasyondaki hiçbir alan atlanamaz, küçültülemez veya "sistem formatına uygun değil" gerekçesiyle yok sayılamaz.**

## Zorunlu kurallar

### 1. Kaynak-spesifikasyon karşılaştırması (öncesi)

Kod yazmadan önce:
- Kullanıcının verdiği tüm alanları (top-level, nested, array elemanları) liste halinde çıkar.
- Mevcut sistem formatıyla karşılaştır.
- Eksik alan varsa **atlamadan taşı**. Sistem formatında karşılığı yoksa **yine de ekle** — veri kaybı kabul edilemez.

### 2. Teslimat öncesi checklist (zorunlu adımlar)

Her görev tesliminde aşağıdaki kontrol yapılmalıdır:

```bash
# 1. Orijinal spesifikasyondaki tüm alanlar mevcut mu?
node -e "
const spec = JSON.parse(require('fs').readFileSync('data/pro-tools/PRO_XXX.json','utf8'));
// Kullanıcının orijinal spesifikasyonundaki tüm anahtarları kontrol et
// prompt_source, reference_code, metadata vb. gibi opsiyonel bloklar dahil
console.log('Alan sayısı kontrolü:');
// Top-level anahtarlar
const expectedKeys = ['tool_id','tool_name','category','scope','primary_operation','prompt_source','inputs','formulas','engine_rules','reference_code','metadata'];
for (const k of expectedKeys) {
  if (!(k in spec)) console.log('  EKSİK:', k);
  else console.log('  TAM:', k);
}
// Her input'ta symbol, validation_rule, source, uncertainty, resolution var mı?
let inputOk = 0, inputFail = 0;
for (const inp of spec.inputs) {
  const required = ['id','name','symbol','unit','type','required','confidence_label','validation_rule','source','uncertainty'];
  const missing = required.filter(r => !(r in inp));
  if (missing.length > 0) { inputFail++; console.log('  Input', inp.id, 'eksik:', missing.join(',')); }
  else inputOk++;
}
console.log('  Input alanları:', inputOk, 'tam,', inputFail, 'eksik');
// validation.rules array formatı
if (spec.engine_rules?.validation?.rules) {
  console.log('  validation.rules array: TAM (' + spec.engine_rules.validation.rules.length + ' kural)');
  const actionMissing = spec.engine_rules.validation.rules.filter(r => !r.action);
  if (actionMissing.length > 0) console.log('  action alanı eksik olanlar:', actionMissing.map(r=>r.id).join(','));
} else {
  console.log('  validation.rules array: EKSİK');
}
// error_propagation, fmea, audit_log
['error_propagation','fmea','audit_log'].forEach(k => {
  console.log('  engine_rules.' + k + ':', spec.engine_rules?.[k] ? 'TAM' : 'EKSİK');
});
// reference_code
console.log('  reference_code:', spec.reference_code ? 'TAM' : 'EKSİK');
// metadata
console.log('  metadata:', spec.metadata ? 'TAM' : 'EKSİK');
"
```

### 3. "Sistem formatına uygun değil" bahanesi yasaktır

- Kullanıcının verdiği alan sisteme eklenemiyorsa, **yine de JSON içinde muhafaza edilir.**
- UI/engine tarafı okumasa bile veri bütünlüğü korunur.
- Proxy pattern: mevcut alanlar `UniversalCalculator` için kalır, ek alanlar yanında taşınır.

### 4. Teslim formatı zorunluluğu

Her tamamlanan görevde rapor:

```txt
İşlem:
Spesifikasyon karşılaştırması:
  - Top-level alanlar: [TAM / EKSİK — madde listesi]
  - Input alanları: [TAM / EKSİK — madde listesi]
  - Validation rules: [TAM / EKSİK]
  - error_propagation / fmea / audit_log: [TAM / EKSİK]
  - reference_code: [TAM / EKSİK]
  - metadata: [TAM / EKSİK]
Dokunulan dosyalar:
Test komutları:
Test çıktısı:
Kalan eksikler: [VARS AÇIKLA / YOK]
Durum: TAMAMLANDI
```

### 5. İhlal durumu

Bu kuralın ihlali (eksik uygulama, atlanan alan, bahaneyle geçiştirme) sistem güvenlik ihlali olarak kabul edilir. Bir sonraki adımda düzeltilmezse kullanıcıya açıkça raporlanır.
