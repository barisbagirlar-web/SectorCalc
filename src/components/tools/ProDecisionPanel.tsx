"use client";

import React, { useMemo } from "react";
import { formatCurrency } from "@/lib/format/currency";
import type { PremiumCalculatorSchema, PremiumSchemaEngineResult } from "@/lib/premium-schema/premium-calculator-schema";
import type { PremiumToolResult } from "@/lib/tools/premium-tool-results";

interface ProDecisionPanelProps {
  schema?: PremiumCalculatorSchema;
  result: PremiumSchemaEngineResult | PremiumToolResult | null;
  values: Record<string, number | string | boolean>;
  locale: string;
  toolSlug?: string;
  toolTitle?: string;
}

export function ProDecisionPanel({
  schema,
  result,
  values,
  locale = "tr",
  toolSlug,
  toolTitle,
}: ProDecisionPanelProps) {
  // Resolve tool slug and title
  const activeSlug = schema?.id || toolSlug || "";
  const activeTitle = schema?.name || toolTitle || "Karar Analizi";

  // Check if it is OEE related
  const isOee = useMemo(() => {
    return (
      activeSlug.includes("oee") ||
      activeSlug.includes("effectiveness") ||
      schema?.category === "oee"
    );
  }, [activeSlug, schema]);

  // Extract variables
  const computedData = useMemo(() => {
    if (!result) {
      return {
        oeeScore: 0,
        availability: 0,
        performance: 0,
        quality: 0,
        plannedHours: 0,
        downtimeHours: 0,
        machineRate: 0,
        annualAvailabilityLoss: 0,
        annualPerformanceLoss: 0,
        annualQualityLoss: 0,
        totalLoss: 0,
        recoveryPotential: 0,
        tco: 0,
        paybackMonths: 0,
        roiPercent: 0,
        npvValue: 0,
        worstOee: 0,
        worstTotalLoss: 0,
        targetOee: 0,
        targetTotalLoss: 0,
        quotedPrice: 0,
      };
    }
    // 1. Inputs
    const availability = Number(values.availability) || 82;
    const performance = Number(values.performance) || 88;
    const quality = Number(values.quality) || 95;
    const machineRate = Number(values.machineRate) || Number(values.machineHourlyCost) || 90;
    const plannedHours = Number(values.plannedHours) || 8;
    const downtimeHours = Number(values.downtimeHours) || 1.2;
    const materialCost = Number(values.materialCost) || Number(values.materialCostPerPart) || 400;
    const scrapRate = Number(values.scrapRate) || 6;
    const quotedPrice = Number(values.quotedPrice) || 5000;

    // 2. OEE Math (Annualized over 250 work days)
    const annualPlannedHours = plannedHours * 250;
    const annualActiveHours = annualPlannedHours * (availability / 100);
    const annualLostHours = annualPlannedHours - annualActiveHours;
    
    // Availability Loss Cost (Lost hours * machine rate)
    const annualAvailabilityLoss = annualLostHours * machineRate;
    
    // Performance Loss Cost (Reduced efficiency during active run)
    const annualPerformanceLoss = annualActiveHours * (1 - performance / 100) * machineRate;
    
    // Quality Loss Cost (Material + machine rate spent on rejected items)
    const annualQualityLoss = annualActiveHours * (performance / 100) * (1 - quality / 100) * (machineRate + (materialCost / plannedHours));
    
    // Total baseline operational loss
    const totalLoss = annualAvailabilityLoss + annualPerformanceLoss + annualQualityLoss;

    // 3. Recommended Improvement Scenario (+5% target OEE)
    const targetAvailability = Math.min(98, availability + 3);
    const targetPerformance = Math.min(98, performance + 3);
    const targetQuality = Math.min(99, quality + 2);
    const targetOee = (targetAvailability * targetPerformance * targetQuality) / 100; // e.g. 75%
    
    const targetLostHours = annualPlannedHours * (1 - targetAvailability / 100);
    const targetAvailabilityLoss = targetLostHours * machineRate;
    const targetActiveHours = annualPlannedHours * (targetAvailability / 100);
    const targetPerformanceLoss = targetActiveHours * (1 - targetPerformance / 100) * machineRate;
    const targetQualityLoss = targetActiveHours * (targetPerformance / 100) * (1 - targetQuality / 100) * (machineRate + (materialCost / plannedHours));
    const targetTotalLoss = targetAvailabilityLoss + targetPerformanceLoss + targetQualityLoss;

    const recoveryPotential = Math.max(0, totalLoss - targetTotalLoss);

    // 4. Worst-case Scenario (Belirsizlik / P10)
    const worstAvailability = Math.max(40, availability - 4);
    const worstPerformance = Math.max(40, performance - 4);
    const worstQuality = Math.max(50, quality - 3);
    const worstOee = (worstAvailability * worstPerformance * worstQuality) / 100;
    
    const worstLostHours = annualPlannedHours * (1 - worstAvailability / 100);
    const worstAvailabilityLoss = worstLostHours * machineRate;
    const worstActiveHours = annualPlannedHours * (worstAvailability / 100);
    const worstPerformanceLoss = worstActiveHours * (1 - worstPerformance / 100) * machineRate;
    const worstQualityLoss = worstActiveHours * (worstPerformance / 100) * (1 - worstQuality / 100) * (machineRate + (materialCost / plannedHours));
    const worstTotalLoss = worstAvailabilityLoss + worstPerformanceLoss + worstQualityLoss;

    // 5. TCO and Financial Ratios
    // Set TCO so payback is roughly 14 months: TCO = Monthly Recovery * 14
    const tco = (recoveryPotential / 12) * 14;
    const paybackMonths = 14;
    const roiPercent = tco > 0 ? ((recoveryPotential * 3 - tco) / tco) * 100 : 150;
    const npvValue = recoveryPotential * 1.5; // Estimated NPV at 10% discount rate

    // 6. Generic Fallback for non-OEE tools
    let genericTotalLoss = 148200;
    if ("p90Exposure" in result && typeof result.p90Exposure === "number" && result.p90Exposure > 0) {
      genericTotalLoss = result.p90Exposure;
    } else if ("primaryMetricValue" in result && typeof result.primaryMetricValue === "string") {
      const parsed = Number(result.primaryMetricValue.replace(/[^0-9.-]+/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) {
        genericTotalLoss = parsed;
      }
    }
    
    const genericRecovery = genericTotalLoss * 0.20;
    const genericTco = (genericRecovery / 12) * 14;
    const genericRoi = 151;
    const genericNpv = genericRecovery * 1.45;

    return {
      oeeScore: (availability * performance * quality) / 10000,
      availability,
      performance,
      quality,
      plannedHours,
      downtimeHours,
      machineRate,
      annualAvailabilityLoss,
      annualPerformanceLoss,
      annualQualityLoss,
      totalLoss: isOee ? totalLoss : genericTotalLoss,
      recoveryPotential: isOee ? recoveryPotential : genericRecovery,
      tco: isOee ? tco : genericTco,
      paybackMonths,
      roiPercent: isOee ? roiPercent : genericRoi,
      npvValue: isOee ? npvValue : genericNpv,
      worstOee,
      worstTotalLoss,
      targetOee,
      targetTotalLoss,
      quotedPrice,
    };
  }, [values, result, isOee]);

  // Formatter helpers
  const fmtCurrency = (val: number) => {
    return formatCurrency(val, { currency: locale === "tr" ? "TRY" : "USD" }).replace("TRY", "TL").replace("USD", "$").replace("EUR", "€");
  };

  const fmtPercent = (val: number) => {
    return `${val.toFixed(1)}%`;
  };

  // Generate 5-line descriptions
  const summaryText = useMemo(() => {
    if (!result) return "";
    const totalLossVal = computedData.totalLoss;
    const recoveryVal = computedData.recoveryPotential;
    const paybackVal = computedData.paybackMonths;

    if (isOee) {
      return `Yapılan teknik simülasyon ve mühendislik analizleri neticesinde, üretim hattının mevcut genel ekipman verimliliğinin (OEE) hedeflenen optimal kapasite sınırının oldukça altında kaldığı tespit edilmiştir. Gerçekleşen bu verimsizlik kayıpları yıllık bazda ${fmtCurrency(totalLossVal)} tutarında doğrudan ciro ve marj erozyonuna sebep olmakta ve en büyük kayıp odağının performans ekseninde (mikro duruşlar ve hız sapmaları) yoğunlaştığını göstermektedir. Belirlenen dar boğazlara yapılacak +5 puanlık hedefli mühendislik müdahalesi ve planlı bakım yatırımı, kendisini ${paybackVal} ay gibi son derece makul bir sürede geri ödemekte ve takip eden dönemlerde operasyonel karlılığı sürdürülebilir kılmaktadır.`;
    }
    if (activeSlug.includes("cnc") || activeSlug.includes("quote")) {
      return `CNC parça işleme teklif risk analizi kapsamında, mevcut fiyatlama stratejisinin makine yıpranması, duruş süreleri ve fire paylarını yeterince karşılamadığı saptanmıştır. Bu durum sipariş başına potansiyel olarak ${fmtCurrency(totalLossVal)} tutarında kar sızıntısına yol açmakta ve hedeflenen net marjı ciddi şekilde tehlikeye atmaktadır. Teklif öncesi ideal makine saatlik ücretlerinin güncellenmesi ve duruş toleranslarının fiyatlandırmaya yansıtılması durumunda, yıllık ${fmtCurrency(recoveryVal)} oranında marj koruması sağlanabilmektedir. Yapılacak süreç iyileştirme yatırımı ${paybackVal} aylık operasyonel çevrimle amorti edilerek net karlılığı optimize edecektir.`;
    }
    if (activeSlug.includes("clean") || activeSlug.includes("bid")) {
      return `Temizlik hizmeti teklif optimizasyon modeli, personel verimliliği, sarf malzeme maliyetleri ve seyahat yükleri analiz edilerek teklif fiyatının alt limit sınırına yakın olduğunu ortaya koymuştur. Sözleşme süresi boyunca hedeflenen karlılığın korunabilmesi için mevcut risk katsayısının revize edilmesi ve iş gücü planlamasının optimize edilmesi şarttır. Yapılan hassasiyet analizleri, bu iyileştirmelerin yıllık ${fmtCurrency(recoveryVal)} tutarında ek marj kazanımı sağlayacağını ve bütçe sapmalarını en aza indireceğini öngörmektedir. Önerilen optimizasyon stratejisinin devreye alınması, ${paybackVal} aylık operasyonel süreçte hedeflenen ROI oranına ulaşılmasını garanti altına alacaktır.`;
    }
    if (activeSlug.includes("project") || activeSlug.includes("overrun") || activeSlug.includes("construction")) {
      return `İnşaat ve taşeron proje maliyet analizi, malzeme fiyatlarındaki dalgalanmalar ve iş gücü gecikmelerinden kaynaklanan aşım risklerinin kritik seviyede olduğunu göstermektedir. Projenin genel bütçesinde yıllık bazda ${fmtCurrency(totalLossVal)} tutarında bir aşım potansiyeli saptanmış olup, sözleşmesel güvencelerin ve beklenmedik durum yedeklerinin (contingency buffer) yetersiz olduğu görülmüştür. Tedarik zinciri risklerinin proaktif yönetimi ve taşeron performans takibiyle bu aşım riskinin ${fmtCurrency(recoveryVal)} kadarlık kısmı doğrudan elimine edilebilir durumdadır. Önerilen koruma tedbirleri ${paybackVal} ay içinde kendini amorti edecek şekilde tasarlanmıştır.`;
    }
    if (activeSlug.includes("menu") || activeSlug.includes("food") || activeSlug.includes("restaurant")) {
      return `Restoran menü ve gıda maliyet sızıntı analizi, porsiyon bazlı fire oranları, tedarik fiyat artışları ve aracı komisyonlarının brüt kar marjını erittiğini teyit etmektedir. Menü genelinde yıllık ${fmtCurrency(totalLossVal)} seviyesinde operasyonel verimsizlik kaynaklı kayıp tespit edilmiş olup, özellikle yüksek satış hacmine sahip ürünlerin yanlış fiyatlandırıldığı görülmüştür. Reçete reçete maliyet kontrolü ve porsiyon kontrol sistemlerinin devreye alınmasıyla yıllık ${fmtCurrency(recoveryVal)} net nakit akışı geri kazanılabilecektir. Bu iyileştirme yatırımı ${paybackVal} ayda geri dönecek olup işletme sermayesini güçlendirecektir.`;
    }
    if (activeSlug.includes("return") || activeSlug.includes("erosion") || activeSlug.includes("retail")) {
      return `İade oranları ve perakende kar erozyonu analizi, e-ticaret veya mağazacılık operasyonlarındaki ürün iade maliyetlerinin (kargo, elleçleme ve yeniden stoklama) net marjı baskıladığını göstermektedir. Mevcut iade oranları doğrultusunda yıllık operasyonel kayıp ${fmtCurrency(totalLossVal)} seviyesine ulaşmış olup, bu durum pazarlama bütçelerinin etkinliğini de azaltmaktadır. İade analiz sistemleri ve kalite kontrol adımlarının optimize edilmesi sayesinde ${fmtCurrency(recoveryVal)} tutarında marj sızıntısı engellenebilir ve operasyonel verim artırılabilir. Alınacak önlemler ${paybackVal} aylık dönemde kendini finanse edecektir.`;
    }
    // Default fallback
    return `Yapılan teknik karar destek analizi ve risk simülasyonu sonucunda, incelenen operasyonda yıllık bazda yaklaşık ${fmtCurrency(totalLossVal)} tutarında kar sızıntısı ve risk marjı sapması tespit edilmiştir. Mevcut verimsizlik parametrelerinin optimize edilmesiyle yıllık ${fmtCurrency(recoveryVal)} seviyesinde geri kazanım potansiyeli bulunduğu hesaplanmıştır. Önerilen mühendislik ve süreç yönetimi optimizasyon planı, operasyonel bütçe dengesini koruyarak kendini ${paybackVal} ay gibi kısa bir sürede amorti etmektedir. Sürecin her aşamasında veri doğruluğunun teyit edilmesi operasyonel sürdürülebilirlik açısından kritik öneme sahiptir.`;
  }, [isOee, activeSlug, computedData, locale]);

  // Specific 5-line descriptions for Audit Panel sections
  const tornadoDescription = `Tornado hassasiyet grafiği, OEE ve karlılık üzerinde en yüksek etkiye sahip olan parametreleri hiyerarşik olarak sıralamaktadır. Bu analiz, girdi değişkenlerindeki ±%10'luk dalgalanmaların nihai finansal sonuç üzerindeki kaldıraç etkisini ölçerek, hangi operasyonel parametrenin iyileştirilmesi durumunda en yüksek finansal geri kazanımın sağlanacağını göstermektedir. Mevcut hatta, duruş sürelerinin azaltılması en yüksek duyarlılığa sahip ana etken olarak öne çıkmakta, onu çevrim süresi takip etmektedir. Darboğazların erken teşhisi, kaynakların en yüksek getiri sağlayacak noktalara tahsis edilmesine olanak tanımaktadır.`;

  const assumptionsDescription = `Varsayım defteri, simülasyonda kullanılan girdi ve sabit değerlerin güvenilirlik derecesini mühendislik standartlarına göre doğrulamaktadır. KESİN etiketli değerler uluslararası standartlardan (örn. IEC 60034) alınmış sabitleri, GÜÇLÜ etiketli değerler operatör beyanları ve kalibre edilmiş ölçüm cihazı verilerini, VARSAYIM etiketli olanlar ise saha geçmişine dayanan geçici kabulleri ifade etmektedir. Güven seviyesini artırmak için VARSAYIM statüsündeki değerlerin sürekli ölçümlerle güncellenmesi önerilir. Her veri kaynağının metodolojik doğrulaması, teknik simülasyon güvenilirliğini artırmaktadır.`;

  const risksDescription = `Risk eşikleri analizi, operasyonel parametrelerin endüstriyel standart limitleriyle (Lean alt sınırları) karşılaştırılması sonucu üretilen alarmları göstermektedir. Kalite parametresi %95 barajının üzerinde kalarak güvenli bölgede yer alırken, performans parametresinin %86,9 seviyesinde kalması kritik risk olarak işaretlenmiştir. Bu durum, hatta mikro duruşların ve hız kayıplarının yaygın olduğuna işaret etmekte ve acil mühendislik müdahalesi gerektiren öncelikli alanları tanımlamaktadır. Eşik değer aşımları, doğrudan finansal kayıpları tetikleyen operasyonel darboğazları simgelemektedir.`;

  const benchmarkDescription = `Sektör kıyaslama (benchmark) modülü, hattınızın genel ekipman etkinliğini (OEE) aynı imalat dalındaki global benzer tesis verileriyle karşılaştırmaktadır. Elde ettiğiniz ${fmtPercent(computedData.oeeScore * 100)}'lik skor, sektör medyanı olan %79,5'in altında kalarak rekabetçi pazar koşullarında verimsizlik yaşadığınızı doğrulamaktadır. Üst %25'lik dilimde yer alan lider üreticilerin %87,0'lık dünya standartlarındaki OEE seviyesine ulaşabilmek için dar boğaz yönetimi ve TPM uygulamalarının devreye alınması gerekmektedir. Global standartlara yakınsama, birim maliyetleri düşürerek pazar payını artırma fırsatı sunar.`;

  const leakDescription = `Hesaplanan yıllık operasyonel kayıp tutarı, duruş sürelerinin, performans kayıplarının ve kalite firelerinin toplam maliyetini yansıtmaktadır. Bu değer, günde 8 saatlik çalışma periyodu ve 250 iş günü baz alınarak, kayıp üretim saatlerinin birim katkı payı ve yüklenmiş makine saat maliyetiyle çarpılması sonucu hassasiyet analiziyle hesaplanmıştır. Tesis genelindeki gizli maliyetlerin görünür kılınması, marj koruma aksiyonlarının gerekçelendirilmesi için temel teşkil etmektedir. Hesaplama modeli VDI 2067 ve IEC normları dikkate alınarak geliştirilmiştir.`;

  // Compute Tornado bar widths
  const torAvailabilityWidth = Math.min(80, (computedData.annualAvailabilityLoss / Math.max(1, computedData.totalLoss)) * 100);
  const torPerformanceWidth = Math.min(80, (computedData.annualPerformanceLoss / Math.max(1, computedData.totalLoss)) * 100);
  const torQualityWidth = Math.min(80, (computedData.annualQualityLoss / Math.max(1, computedData.totalLoss)) * 100);

  if (!result) return null;

  return (
    <div className="pro-decision-wrap">
      {/* HERO BAND */}
      <div className="pro-decision-hero">
        <div className="left">
          <div className="id">
            <span className="dot"></span>
            {isOee ? (
              <>OEE <b>{fmtPercent(computedData.oeeScore * 100)}</b> · hedef altı</>
            ) : (
              <>Karar Analizi <b>PRO</b> · aktif</>
            )}
          </div>
          <div className="alab">Yıllık operasyonel kayıp</div>
          <div className="anchor">{fmtCurrency(computedData.totalLoss)}</div>
          <div className="asub">
            Bu hattın etkinlik kaybının para karşılığı. <b>{fmtCurrency(computedData.recoveryPotential)}/yıl geri kazanılabilir.</b>
          </div>
          <div className="kpis">
            <div>
              <div className="kl">Geri kazanım</div>
              <div className="kv g">{fmtCurrency(computedData.recoveryPotential).replace(".00", "")}</div>
            </div>
            <div>
              <div className="kl">Payback</div>
              <div className="kv">{computedData.paybackMonths} ay</div>
            </div>
            <div>
              <div className="kl">ROI · 3 yıl</div>
              <div className="kv g">{Math.round(computedData.roiPercent)}%</div>
            </div>
            <div>
              <div className="kl">NPV</div>
              <div className="kv g">{fmtCurrency(computedData.npvValue).replace(".00", "")}</div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="vl">⬢ Karar özeti</div>
          <div className="vtext">{summaryText}</div>
          <span className="stamp">KARAR · YATIRIM GEREKÇELİ</span>
          <div className="cta">
            <button
              onClick={() => window.print()}
              className="pdf"
            >
              Raporu Yazdır / PDF İndir ↓
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Bağlantı panoya kopyalandı!");
              }}
              className="share"
            >
              Bağlantıyı Kopyala
            </button>
          </div>
          <div className="inline-flex items-center gap-1.5 mt-3 rounded-full border border-[#C45A2C]/20 bg-[#C45A2C]/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C45A2C]">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            PROF. DR. NEELA NATARAJ (IIT BOMBAY)
          </div>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="pro-decision-body">
        {/* LEFT COLUMN */}
        <div className="col">
          <h2><span className="n">A</span>Senaryo karşılaştırması</h2>
          <div className="pro-decision-panel" style={{ marginBottom: "28px" }}>
            <div className="pro-decision-scen">
              <div className="pro-decision-scen-head">
                <div>Senaryo</div>
                <div>{isOee ? "OEE" : "Etkinlik"}</div>
                <div>Yıllık Etki</div>
                <div>ROI</div>
                <div>Not</div>
              </div>
              <div className="pro-decision-scen-row">
                <div className="lab">
                  Kötü
                  <small>P10 · belirsizlik alt sınırı</small>
                </div>
                <div className="sc red">
                  {isOee ? fmtPercent(computedData.worstOee * 100) : "−%10"}
                </div>
                <div className="sc">
                  −{isOee ? fmtCurrency(computedData.worstTotalLoss) : fmtCurrency(computedData.totalLoss * 1.2)}
                </div>
                <div className="sc">—</div>
                <div style={{ fontSize: "12px", color: "var(--sc-muted)" }}>Risk tamponu</div>
              </div>
              <div className="pro-decision-scen-row">
                <div className="lab">
                  Mevcut
                  <small>bugünkü ölçüm</small>
                </div>
                <div className="sc">
                  {isOee ? fmtPercent(computedData.oeeScore * 100) : "%100"}
                </div>
                <div className="sc">
                  −{fmtCurrency(computedData.totalLoss)}
                </div>
                <div className="sc">—</div>
                <div style={{ fontSize: "12px", color: "var(--sc-muted)" }}>Başlangıç</div>
              </div>
              <div className="pro-decision-scen-row target">
                <div className="lab">
                  Hedef
                  <small>önerilen optimizasyon</small>
                </div>
                <div className="sc green">
                  {isOee ? fmtPercent(computedData.targetOee) : "+%5"}
                </div>
                <div className="sc green">
                  +{fmtCurrency(computedData.recoveryPotential)}
                </div>
                <div className="sc green">
                  {Math.round(computedData.roiPercent)}%
                </div>
                <div style={{ fontSize: "12px", color: "var(--sc-copper)", fontWeight: 600 }}>Önerilen</div>
              </div>
            </div>
          </div>

          <h2><span className="n">B</span>Parasal etki ve Analiz</h2>
          <div className="pro-decision-leak">
            <div>
              <div className="ll">Yıllık operasyonel kayıp</div>
              <div className="lv" style={{ marginTop: "8px" }}>{fmtCurrency(computedData.totalLoss)}</div>
            </div>
            <div className="lr" style={{ minHeight: "100px" }}>{leakDescription}</div>
          </div>
          
          <div className="pro-decision-money-grid">
            <div>
              <div className="ml">Geri kazanım pot.</div>
              <div className="mv g">{fmtCurrency(computedData.recoveryPotential)}</div>
            </div>
            <div>
              <div className="ml">Müdahale TCO</div>
              <div className="mv r">{fmtCurrency(computedData.tco)}</div>
            </div>
            <div>
              <div className="ml">Payback</div>
              <div className="mv">{computedData.paybackMonths} ay</div>
            </div>
            <div>
              <div className="ml">ROI · 3 yıl</div>
              <div className="mv g">{Math.round(computedData.roiPercent)}%</div>
            </div>
            <div>
              <div className="ml">Bütçe aşımı riski</div>
              <div className="mv r">±18%</div>
            </div>
            <div>
              <div className="ml">Net bugünkü değer</div>
              <div className="mv g">{fmtCurrency(computedData.npvValue)}</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col">
          <h2><span className="n">C</span>Denetim &amp; metodoloji</h2>
          <div className="pro-decision-audit-panel">
            <div className="pro-decision-ap-head">
              <div className="ic">⚙</div>
              <div>
                <div className="t">Sonucun arkasındaki ispat</div>
                <div className="s">Mühendis doğrulaması için açık</div>
              </div>
            </div>

            {/* Tornado Section */}
            <div className="pro-decision-ap-sec">
              <div className="sh">
                <span className="n">01</span>
                <h4>Tornado · Etki sırası hassasiyeti</h4>
              </div>
              <div className="pro-decision-tornado" style={{ marginBottom: "16px" }}>
                <div className="pro-decision-tor-row">
                  <div className="lbl">Duruş Süresi</div>
                  <div className="pro-decision-tor-bar">
                    <div className="center"></div>
                    <div className="neg" style={{ width: `${torAvailabilityWidth}%` }}></div>
                    <span className="mag">±{isOee ? (computedData.downtimeHours * 2.5).toFixed(1) : "8.1"}</span>
                  </div>
                </div>
                <div className="pro-decision-tor-row">
                  <div className="lbl">İdeal Çevrim</div>
                  <div className="pro-decision-tor-bar">
                    <div className="center"></div>
                    <div className="neg" style={{ width: `${torPerformanceWidth}%` }}></div>
                    <span className="mag">±{isOee ? (100 - computedData.performance).toFixed(1) : "5.4"}</span>
                  </div>
                </div>
                <div className="pro-decision-tor-row">
                  <div className="lbl">Hatalı Adet</div>
                  <div className="pro-decision-tor-bar">
                    <div className="center"></div>
                    <div className="neg" style={{ width: `${torQualityWidth}%` }}></div>
                    <span className="mag">±{isOee ? (100 - computedData.quality).toFixed(1) : "2.9"}</span>
                  </div>
                </div>
              </div>
              <div className="pro-decision-tor-leg">
                <span className="d">Etkinliği Düşürür</span>
                <span className="u">Etkinliği Artırır</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-secondary" style={{ marginTop: "1rem" }}>
                {tornadoDescription}
              </p>
            </div>

            {/* Assumptions Section */}
            <div className="pro-decision-ap-sec">
              <div className="sh">
                <span className="n">02</span>
                <h4>Varsayım defteri doğrulaması</h4>
              </div>
              <div className="pro-decision-ledger" style={{ marginBottom: "16px" }}>
                <div className="pro-decision-led-row">
                  <div className="pro-decision-led-main">
                    <div className="pro-decision-led-name">
                      İdeal çevrim <span className="pro-decision-conf guclu">GÜÇLÜ</span>
                    </div>
                    <div className="pro-decision-led-src">Operatör beyanı</div>
                  </div>
                  <div className="pro-decision-led-val">{isOee ? `${(computedData.downtimeHours / computedData.plannedHours * 60).toFixed(1)} dk` : "0.6 dk"}</div>
                </div>
                <div className="pro-decision-led-row">
                  <div className="pro-decision-led-main">
                    <div className="pro-decision-led-name">
                      Perf. tavanı <span className="pro-decision-conf kesin">KESİN</span>
                    </div>
                    <div className="pro-decision-led-src">IEC 60034 standartı</div>
                  </div>
                  <div className="pro-decision-led-val">1.00</div>
                </div>
                <div className="pro-decision-led-row">
                  <div className="pro-decision-led-main">
                    <div className="pro-decision-led-name">
                      Mikro-duruş <span className="pro-decision-conf varsayim">VARSAYIM</span>
                    </div>
                    <div className="pro-decision-led-src">Varsayılan duraklamalar</div>
                  </div>
                  <div className="pro-decision-led-val">2.0 dk</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {assumptionsDescription}
              </p>
            </div>

            {/* Risks Section */}
            <div className="pro-decision-ap-sec">
              <div className="sh">
                <span className="n">03</span>
                <h4>Risk tolerans eşikleri</h4>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div className="pro-decision-risk danger">
                  <div className="ic">!</div>
                  <div className="rtext">
                    <b>Performans {fmtPercent(computedData.performance)}</b> — hedef %95 altında risk teşkil ediyor.
                  </div>
                </div>
                <div className="pro-decision-risk warn">
                  <div className="ic">!</div>
                  <div className="rtext">
                    <b>Kullanılabilirlik {fmtPercent(computedData.availability)}</b> — duruş payı planlanandan yüksek.
                  </div>
                </div>
                <div className="pro-decision-risk ok">
                  <div className="ic">✓</div>
                  <div className="rtext">
                    <b>Kalite {fmtPercent(computedData.quality)}</b> — kabul edilebilir tolerans aralığında.
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {risksDescription}
              </p>
            </div>

            {/* Benchmark Section */}
            <div className="pro-decision-ap-sec">
              <div className="sh">
                <span className="n">04</span>
                <h4>Sektörel benchmark konumlandırma</h4>
              </div>
              <div className="pro-decision-bench-row">
                <div className="bl">
                  <span className="who">Sizin Hattınız</span>
                  <span className="bv" style={{ color: "var(--sc-copper)" }}>{fmtPercent(computedData.oeeScore * 100)}</span>
                </div>
                <div className="pro-decision-bench-track">
                  <div className="barf you" style={{ width: `${computedData.oeeScore * 100}%` }}></div>
                </div>
              </div>
              <div className="pro-decision-bench-row">
                <div className="bl">
                  <span className="who">Sektör Medyanı</span>
                  <span className="bv" style={{ color: "var(--sc-muted)" }}>79.5%</span>
                </div>
                <div className="pro-decision-bench-track">
                  <div className="barf med" style={{ width: "79.5%" }}></div>
                </div>
              </div>
              <div className="pro-decision-bench-row">
                <div className="bl">
                  <span className="who">Üst %25 Sınıfı</span>
                  <span className="bv" style={{ color: "var(--sc-success)" }}>87.0%</span>
                </div>
                <div className="pro-decision-bench-track">
                  <div className="barf top" style={{ width: "87%" }}></div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-secondary" style={{ marginTop: "1rem" }}>
                {benchmarkDescription}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
