
// ── AI TOKEN MALİYET ──
// SLUG: ai-token-cost-analyzer
// INPUTS: DevOps: Günlük Request, Prompt Token, Completion Token, Cache Hit Ratio | ; ML Mühendisi: Model Tier | ; CFO: Büyüme Oranı, Güven Tamponu
  { formulaId: "user.ai_token_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "basePromptCost" },
  { formulaId: "user.ai_token_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseCompletionCost" },
  { formulaId: "user.ai_token_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cacheReadCost" },
  { formulaId: "user.ai_token_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "monthlyProjection" },
  { formulaId: "user.ai_token_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO" },

// ── ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ ──
// SLUG: six-sigma-project-prioritizer
// INPUTS: Kalite Teknisyeni: Üretim Hacmi, Hatalı Birim, Hata Fırsatı, İç/Dış Başarısızlık Maliyeti | ; Black Belt: Mevcut Z_bench, Hedef Sigma | ; CFO: Kurtarma Olasılığı
  { formulaId: "user.six_sigma_project_prioritizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "dPMO" },
  { formulaId: "user.six_sigma_project_prioritizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "yield" },
  { formulaId: "user.six_sigma_project_prioritizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "z_bench" },
  { formulaId: "user.six_sigma_project_prioritizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "sigmaLevel" },
  { formulaId: "user.six_sigma_project_prioritizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cOPQ" },
  { formulaId: "user.six_sigma_project_prioritizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "projectScore" },

// ── AQL SAMPLING RİSK & MALİYET ──
// SLUG: aql-sampling-risk-analyzer
// INPUTS: Kalite Kontrolcü: Parti Büyüklüğü N, Muayene Seviyesi, AQL, LTPD | ; Kalite Mühendisi: Birim Muayene Maliyeti, Kaçan Hata Maliyeti
  { formulaId: "user.aql_sampling_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "codeLetter" },
  { formulaId: "user.aql_sampling_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "n" },
  { formulaId: "user.aql_sampling_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "ac" },
  { formulaId: "user.aql_sampling_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "pa_producer" },
  { formulaId: "user.aql_sampling_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "alpha" },
  { formulaId: "user.aql_sampling_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "pa_consumer" },
  { formulaId: "user.aql_sampling_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "beta" },
  { formulaId: "user.aql_sampling_risk_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "aTI" },
  { formulaId: "user.aql_sampling_risk_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalRiskCost" },

// ── ARAÇ AMORTİSMANI ──
// SLUG: vehicle-depreciation-tco-analyzer
// INPUTS: Filo Sorumlusu: Edinme Bedeli, Kalıntı Değer, Faydalı Ömür, Yıllık Km | ; Muhasebeci: Amortisman Yöntemi, Kurumlar Vergisi | ; CFO: WACC
  { formulaId: "user.vehicle_depreciation_tco_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "sL_Annual" },
  { formulaId: "user.vehicle_depreciation_tco_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "dB_Rate" },
  { formulaId: "user.vehicle_depreciation_tco_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "dB_Year_t" },
  { formulaId: "user.vehicle_depreciation_tco_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "mACRS_Year_t" },
  { formulaId: "user.vehicle_depreciation_tco_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "uoP_PerUnit" },
  { formulaId: "user.vehicle_depreciation_tco_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO" },
  { formulaId: "user.vehicle_depreciation_tco_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "taxShield" },

// ── ARIZA SÜRESİ MALİYETİ ──
// SLUG: downtime-cost-analyzer
// INPUTS: Bakım Teknisyeni: Arıza Süresi, Etkilenen İşçi, Saatlik Ücret | ; Üretim Mühendisi: Hat Kapasitesi, Birim Marj, Boşta Güç | ; CFO: Marka Hasar Çarpanı
  { formulaId: "user.downtime_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "directLaborLoss" },
  { formulaId: "user.downtime_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "productionLoss" },
  { formulaId: "user.downtime_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyWaste" },
  { formulaId: "user.downtime_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "recoveryCost" },
  { formulaId: "user.downtime_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalDowntimeCost" },

// ── AUTO REPAIR COMEBACK ──
// SLUG: auto-repair-comeback-analyzer
// INPUTS: Servis Danışmanı: Tamamlanan RO, Geri Dönüş RO, Teşhis Süresi | ; Atölye Şefi: İsraf Parça Değeri, Körfez Doluluk Süresi | ; CFO: Churn Olasılığı
  { formulaId: "user.auto_repair_comeback_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "comebackRate" },
  { formulaId: "user.auto_repair_comeback_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "comebackCost_Direct" },
  { formulaId: "user.auto_repair_comeback_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "comebackCost_Parts" },
  { formulaId: "user.auto_repair_comeback_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "comebackCost_Opportunity" },
  { formulaId: "user.auto_repair_comeback_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "dPMO" },
  { formulaId: "user.auto_repair_comeback_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },

// ── AUTO REPAIR QUOTE ──
// SLUG: auto-repair-quote-consistency-analyzer
// INPUTS: Servis Danışmanı: Teklif 1-2-3 Toplam | ; Parça Sorumlusu: Parça Teklif/Piyasa Fiyatı, Miktar | ; Teknisyen: Teklif/Standart İşçilik Saati
  { formulaId: "user.auto_repair_quote_consistency_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "quoteVariance" },
  { formulaId: "user.auto_repair_quote_consistency_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "partPriceDeviation" },
  { formulaId: "user.auto_repair_quote_consistency_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborTimeDeviation" },
  { formulaId: "user.auto_repair_quote_consistency_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "consistencyScore" },
  { formulaId: "user.auto_repair_quote_consistency_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginLeak" },

// ── AUTO SHOP MARJ KAÇAK ──
// SLUG: auto-shop-margin-leak-analyzer
// INPUTS: Servis Danışmanı: Parça/İşçilik Geliri | ; Parça Sorumlusu: COGS, Envanter Fire | ; Teknisyen: Flag/Mevcut Saatler | ; CFO: Benchmark Marj
  { formulaId: "user.auto_shop_margin_leak_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "grossMargin_Parts" },
  { formulaId: "user.auto_shop_margin_leak_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "effectiveLaborRate" },
  { formulaId: "user.auto_shop_margin_leak_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "productivityRate" },
  { formulaId: "user.auto_shop_margin_leak_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginLeak_Discount" },
  { formulaId: "user.auto_shop_margin_leak_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginLeak_Shrinkage" },
  { formulaId: "user.auto_shop_margin_leak_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "netMargin" },
  { formulaId: "user.auto_shop_margin_leak_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualLeakage" },

// ── BASINÇ VESSEL KALINLIK ──
// SLUG: asme-pressure-vessel-analyzer
// INPUTS: Teknisyen: İç Basınç P, İç Yarıçap R, Kapak Tipi | ; Mühendis: Malzeme, Tasarım Sıcaklığı, Gerilme S, Kaynak Verimi E, Korozyon Payı C_A
  { formulaId: "user.asme_pressure_vessel_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_shell" },
  { formulaId: "user.asme_pressure_vessel_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_sphere" },
  { formulaId: "user.asme_pressure_vessel_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_head_ellip" },
  { formulaId: "user.asme_pressure_vessel_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "m" },
  { formulaId: "user.asme_pressure_vessel_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_head_tori" },
  { formulaId: "user.asme_pressure_vessel_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "mAWP" },

// ── BASINÇLI HAVA ENERJİ ──
// SLUG: compressed-air-energy-cost-analyzer
// INPUTS: Bakım Teknisyeni: Kompresör Gücü, Çalışma Saati, Yük Oranı | ; Enerji Mühendisi: İzotermal/Motor Verimi, Elektrik Tarifesi, Aşırı Basınç Düşümü
  { formulaId: "user.compressed_air_energy_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "compressorPower" },
  { formulaId: "user.compressed_air_energy_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "specificPower" },
  { formulaId: "user.compressed_air_energy_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualEnergyCost" },
  { formulaId: "user.compressed_air_energy_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "leakageCost" },
  { formulaId: "user.compressed_air_energy_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalAnnualCost" },

// ── BAŞABAŞ NOKTASI ──
// SLUG: break-even-margin-of-safety-analyzer
// INPUTS: Muhasebeci: Sabit Maliyetler, Birim Değişken Maliyet, Birim Fiyat | ; Satış Müdürü: Güncel Hacim, Güncel Gelir, Hedef Kâr
  { formulaId: "user.break_even_margin_of_safety_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "bEP_Units" },
  { formulaId: "user.break_even_margin_of_safety_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "bEP_Revenue" },
  { formulaId: "user.break_even_margin_of_safety_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cMR" },
  { formulaId: "user.break_even_margin_of_safety_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginOfSafety_Percent" },
  { formulaId: "user.break_even_margin_of_safety_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "operatingLeverage" },
  { formulaId: "user.break_even_margin_of_safety_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetProfit_Units" },

// ── BETON HACMİ ──
// SLUG: concrete-volume-cost-analyzer
// INPUTS: Usta: Döşeme Uzunluk/Genişlik/Kalınlık, Temel/Kolon Sayısı | ; Forman: Beton Sınıfı, Yoğunluk, Fire Oranı | ; Şantiye Şefi: Birim Fiyat
  { formulaId: "user.concrete_volume_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_slab" },
  { formulaId: "user.concrete_volume_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_footing" },
  { formulaId: "user.concrete_volume_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_column" },
  { formulaId: "user.concrete_volume_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_wall" },
  { formulaId: "user.concrete_volume_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_total" },
  { formulaId: "user.concrete_volume_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "weight" },
  { formulaId: "user.concrete_volume_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "truckLoads" },
  { formulaId: "user.concrete_volume_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },

// ── CALIBRATION SAPMA ──
// SLUG: calibration-drift-risk-analyzer
// INPUTS: Laborant: Son/Önceki Hata, Kalibrasyonlar Arası Süre | ; Kalite Mühendisi: Tolerans, Kritiklik, Baz Aralık | ; CFO: Birim Hata Etkisi
  { formulaId: "user.calibration_drift_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "driftRate" },
  { formulaId: "user.calibration_drift_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "predictedDrift" },
  { formulaId: "user.calibration_drift_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "currentUncertainty" },
  { formulaId: "user.calibration_drift_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskScore" },
  { formulaId: "user.calibration_drift_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalInterval" },
  { formulaId: "user.calibration_drift_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "guardBand" },

// ── CBAM MARUZİYET ──
// SLUG: cbam-exposure-analyzer
// INPUTS: Çevre Mühendisi: Üretim Hacmi, Gaz/Kömür/Elektrik Tüketimi, Proses Emisyonu | ; Enerji Yöneticisi: Yenilenebilir Oranı | ; CFO: EU ETS Fiyatı
  { formulaId: "user.cbam_exposure_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "directEmissions" },
  { formulaId: "user.cbam_exposure_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "indirectEmissions" },
  { formulaId: "user.cbam_exposure_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonIntensity" },
  { formulaId: "user.cbam_exposure_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cBAMCertificateCost" },
  { formulaId: "user.cbam_exposure_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "freeAllowance" },
  { formulaId: "user.cbam_exposure_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "complianceScore" },

// ── CBAM UYUMLULUK ──
// SLUG: cbam-compliance-verdict-analyzer
// INPUTS: İthalat Uzmanı: Toplam Kütle, Menşe Ülke | ; Çevre Mühendisi: Kapsam 1/2 Emisyon | ; Mali İşler: Menşe Karbon Vergisi | ; CFO: Kâr Marjı Eşiği
  { formulaId: "user.cbam_compliance_verdict_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalMass" },
  { formulaId: "user.cbam_compliance_verdict_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalEmbedded" },
  { formulaId: "user.cbam_compliance_verdict_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "specificEmbedded" },
  { formulaId: "user.cbam_compliance_verdict_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualVsDefault" },
  { formulaId: "user.cbam_compliance_verdict_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialLiability" },
  { formulaId: "user.cbam_compliance_verdict_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "complianceDecision" },

// ── CHATTER YÜZEY KALİTE ──
// SLUG: chatter-surface-quality-analyzer
// INPUTS: CNC Operatörü: Kesme Hızı V_c, Devir n, İlerleme V_f, Diş Sayısı z | ; İmalat Mühendisi: Takım Ucu Radyusu, Titreşim Genliği | ; Kalite: Ra Limiti
  { formulaId: "user.chatter_surface_quality_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_c" },
  { formulaId: "user.chatter_surface_quality_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "f_z" },
  { formulaId: "user.chatter_surface_quality_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "surfaceRoughness_Theo" },
  { formulaId: "user.chatter_surface_quality_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "surfaceRoughness_Actual" },
  { formulaId: "user.chatter_surface_quality_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualityLossCost" },
  { formulaId: "user.chatter_surface_quality_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "scrapRate" },

// ── CIVATE TORK ──
// SLUG: bolt-torque-preload-analyzer
// INPUTS: Montajcı: Nominal Çap d, Hatve p, Sürtünme K | ; Mühendis: Malzeme Sınıfı, Akma Dayanımı, Hedef Öngerilme
  { formulaId: "user.bolt_torque_preload_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "t" },
  { formulaId: "user.bolt_torque_preload_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "f" },
  { formulaId: "user.bolt_torque_preload_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "sigma_p" },
  { formulaId: "user.bolt_torque_preload_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "a_t" },
  { formulaId: "user.bolt_torque_preload_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "d2" },
  { formulaId: "user.bolt_torque_preload_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "d3" },
  { formulaId: "user.bolt_torque_preload_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "yieldCheck" },

// ── CİRO MALİYETİ ──
// SLUG: employee-turnover-cost-analyzer
// INPUTS: İK Uzmanı: Ayrılan Sayısı, Tazminat, İşe Alım Süresi | ; Yönetici: Mülakat/Eğitim Süresi, Tam Verim Süresi | ; CFO: Günlük Ciro
  { formulaId: "user.employee_turnover_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "separationCost" },
  { formulaId: "user.employee_turnover_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "vacancyCost" },
  { formulaId: "user.employee_turnover_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "replacementCost" },
  { formulaId: "user.employee_turnover_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "trainingCost" },
  { formulaId: "user.employee_turnover_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "productivityLoss" },
  { formulaId: "user.employee_turnover_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalTurnoverCost" },

// ── CLOUD API OVERRUN ──
// SLUG: cloud-api-overrun-analyzer
// INPUTS: Backend Dev: Aylık Toplam/Dahil İstek, Aşım Ücreti | ; DevOps: Veri Çıkışı GB, Egress Fiyat | ; Ürün Yöneticisi: SLA Taahhüt/Gerçek Uptime
  { formulaId: "user.cloud_api_overrun_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "overrunRequests" },
  { formulaId: "user.cloud_api_overrun_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "overrunCost" },
  { formulaId: "user.cloud_api_overrun_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "throttlingCost" },
  { formulaId: "user.cloud_api_overrun_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "dataEgressCost" },
  { formulaId: "user.cloud_api_overrun_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "sLABreachPenalty" },
  { formulaId: "user.cloud_api_overrun_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalOverrunCost" },

// ── CLOUD FIRE ELIMINATION ──
// SLUG: cloud-waste-elimination-analyzer
// INPUTS: Cloud Mimarı: Bağımsız Disk/Atıl Snapshot | ; FinOps: Mevcut/Right-Sized Maliyet, Spot Oranı | ; Geliştirici: Mesai Dışı Sunucu
  { formulaId: "user.cloud_waste_elimination_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "zombieCost" },
  { formulaId: "user.cloud_waste_elimination_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "oversizingSavings" },
  { formulaId: "user.cloud_waste_elimination_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "spotSavings" },
  { formulaId: "user.cloud_waste_elimination_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "reservedSavings" },
  { formulaId: "user.cloud_waste_elimination_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "idleHoursCost" },
  { formulaId: "user.cloud_waste_elimination_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalWaste" },

// ── CLV / CAC ORANI ──
// SLUG: clv-cac-ratio-analyzer
// INPUTS: Pazarlama: Bütçe, Yeni Müşteri | ; Satış: Sipariş Değeri, Sıklık | ; Ürün: Yaşam Süresi, Churn | ; CFO: Brüt Marj, WACC
  { formulaId: "user.clv_cac_ratio_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cLV" },
  { formulaId: "user.clv_cac_ratio_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "grossMarginCLV" },
  { formulaId: "user.clv_cac_ratio_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "discountedCLV" },
  { formulaId: "user.clv_cac_ratio_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cAC" },
  { formulaId: "user.clv_cac_ratio_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },
  { formulaId: "user.clv_cac_ratio_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "lTV_CAC" },

// ── CNC ÇEVRİM SÜRESİ ──
// SLUG: cnc-cycle-time-analyzer
// INPUTS: CNC Operatörü: V_c, f_z, a_p, D_tool | ; İmalat Mühendisi: L, V_rapid, Takım Değişim | ; Planlayıcı: Yükleme/Boşaltma
  { formulaId: "user.cnc_cycle_time_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_cut" },
  { formulaId: "user.cnc_cycle_time_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_f" },
  { formulaId: "user.cnc_cycle_time_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "n" },
  { formulaId: "user.cnc_cycle_time_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_rapid" },
  { formulaId: "user.cnc_cycle_time_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_toolchange" },
  { formulaId: "user.cnc_cycle_time_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_total" },
  { formulaId: "user.cnc_cycle_time_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "oEE_Availability" },

// ── CNC İŞLEME MALİYETİ ──
// SLUG: cnc-machining-cost-analyzer
// INPUTS: Satın Alma: kg Fiyat, Yoğunluk | ; İmalat: Makine Ücreti, Takım Ömrü, Takım Maliyeti | ; Muhasebe: Enerji Tarifesi, Gider Çarpanı
  { formulaId: "user.cnc_machining_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Material" },
  { formulaId: "user.cnc_machining_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Machining" },
  { formulaId: "user.cnc_machining_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Tooling" },
  { formulaId: "user.cnc_machining_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Energy" },
  { formulaId: "user.cnc_machining_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Overhead" },
  { formulaId: "user.cnc_machining_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalUnitCost" },

// ── CPK TO PPM ──
// SLUG: cpk-ppm-converter-analyzer
// INPUTS: Kalite Teknisyeni: USL, LSL, Mean, StdDev | ; Black Belt: Hedef Cpk | ; Üretim Müdürü: Günlük Hacim
  { formulaId: "user.cpk_ppm_converter_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "z_USL" },
  { formulaId: "user.cpk_ppm_converter_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "z_LSL" },
  { formulaId: "user.cpk_ppm_converter_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cpk" },
  { formulaId: "user.cpk_ppm_converter_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "p_USL" },
  { formulaId: "user.cpk_ppm_converter_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "p_LSL" },
  { formulaId: "user.cpk_ppm_converter_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "p_Total" },
  { formulaId: "user.cpk_ppm_converter_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "pPM" },
  { formulaId: "user.cpk_ppm_converter_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "yield" },
  { formulaId: "user.cpk_ppm_converter_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "sigma_ShortTerm" },

// ── CPM GECİKME CEZASI ──
// SLUG: cpm-delay-penalty-analyzer
// INPUTS: Proje Müdürü: Planlanan/Gerçek Süre, Float | ; Sözleşme: Günlük Ceza, Mücbir Sebep | ; Hakediş: Crashing Maliyeti, Verimlilik
  { formulaId: "user.cpm_delay_penalty_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalFloat" },
  { formulaId: "user.cpm_delay_penalty_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "criticalDelay" },
  { formulaId: "user.cpm_delay_penalty_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "excusableDelay" },
  { formulaId: "user.cpm_delay_penalty_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "nonExcusable" },
  { formulaId: "user.cpm_delay_penalty_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "liquidatedDamages" },
  { formulaId: "user.cpm_delay_penalty_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "accelerationCost" },
  { formulaId: "user.cpm_delay_penalty_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "netPenalty" },
  { formulaId: "user.cpm_delay_penalty_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "eOT_Claim" },

// ── ÇATI ALANI ──
// SLUG: roof-area-load-analyzer
// INPUTS: Usta: Uzunluk/Genişlik, Saçak Payı | ; Mimar: Çatı Tipi, Eğim Açısı | ; Statik: Kar Yükü Bölgesi | ; Maliyet: Fire Oranı
  { formulaId: "user.roof_area_load_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "area_Footprint" },
  { formulaId: "user.roof_area_load_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "area_Gable" },
  { formulaId: "user.roof_area_load_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhangArea" },
  { formulaId: "user.roof_area_load_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalMaterialArea" },
  { formulaId: "user.roof_area_load_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "ridgeLength" },
  { formulaId: "user.roof_area_load_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "load_Dead" },
  { formulaId: "user.roof_area_load_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "load_Snow" },

// ── DARBOĞAZ YATIRIM ──
// SLUG: bottleneck-investment-analyzer
// INPUTS: Planlayıcı: Tasarım/Gerçek Kapasite, Talep | ; Endüstri Mühendisi: Darboğaz Süresi, Takt Time | ; Bakım: OEE | ; CFO: Yatırım Bedeli, Marj
  { formulaId: "user.bottleneck_investment_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "utilization" },
  { formulaId: "user.bottleneck_investment_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "throughput" },
  { formulaId: "user.bottleneck_investment_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "taktTime" },
  { formulaId: "user.bottleneck_investment_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleTime_Gap" },
  { formulaId: "user.bottleneck_investment_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "costOfConstraint" },
  { formulaId: "user.bottleneck_investment_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.bottleneck_investment_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },

// ── DEĞİŞİM MATRİSİ SMED ──
// SLUG: smed-changeover-matrix-analyzer
// INPUTS: Ustabaşı: İç/Dış Ayar Süresi, Aylık Değişim | ; Endüstri Mühendisi: Dönüştürme Oranı, Yıllık Talep, Taşıma Maliyeti | ; Üretim: Makine Ücreti
  { formulaId: "user.smed_changeover_matrix_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_internal" },
  { formulaId: "user.smed_changeover_matrix_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_external" },
  { formulaId: "user.smed_changeover_matrix_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_total" },
  { formulaId: "user.smed_changeover_matrix_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_target" },
  { formulaId: "user.smed_changeover_matrix_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "eBQ" },
  { formulaId: "user.smed_changeover_matrix_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "setupCost" },
  { formulaId: "user.smed_changeover_matrix_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualSavings" },
  { formulaId: "user.smed_changeover_matrix_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "capacityGain" },

// ── DEPO YERLEŞİMİ ──
// SLUG: warehouse-layout-analyzer
// INPUTS: Depo Şefi: Taban Alanı, Depolama Oranı, Raf Seviye | ; Lojistik: Palet Ölçü, Koridor, Forklift | ; Operasyon: Günlük Sevkıyat
  { formulaId: "user.warehouse_layout_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "storageArea" },
  { formulaId: "user.warehouse_layout_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "palletPositions" },
  { formulaId: "user.warehouse_layout_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "verticalCap" },
  { formulaId: "user.warehouse_layout_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "throughputCap" },
  { formulaId: "user.warehouse_layout_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "travelDist" },
  { formulaId: "user.warehouse_layout_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "pickEfficiency" },
  { formulaId: "user.warehouse_layout_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "cubeUtil" },
  { formulaId: "user.warehouse_layout_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerPos" },

// ── DEVAMSIZLIK MALİYETİ ──
// SLUG: absenteeism-cost-analyzer
// INPUTS: İK: Kayıp Saat, Ücret, Yan Hak, Olay Sayısı S | ; Planlayıcı: Fazla Mesai, Geçici İşçi | ; Yönetici: Verim Düşüş
  { formulaId: "user.absenteeism_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "directCost" },
  { formulaId: "user.absenteeism_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "overtimePremium" },
  { formulaId: "user.absenteeism_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "tempCost" },
  { formulaId: "user.absenteeism_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "prodLoss" },
  { formulaId: "user.absenteeism_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "adminCost" },
  { formulaId: "user.absenteeism_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "bradfordFactor" },
  { formulaId: "user.absenteeism_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },

// ── DIGITAL TWIN MALİYET ──
// SLUG: digital-twin-cost-analyzer
// INPUTS: Ar-Ge: Prototip/Saha Testi, Modelleme İşçilik | ; IT: Bulut/Lisans | ; Kalite: Garanti Düşüşü | ; Pazarlama: Erken Çıkış Geliri
  { formulaId: "user.digital_twin_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Trad" },
  { formulaId: "user.digital_twin_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_DT" },
  { formulaId: "user.digital_twin_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "timeGain" },
  { formulaId: "user.digital_twin_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "revenueGain" },
  { formulaId: "user.digital_twin_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualitySavings" },
  { formulaId: "user.digital_twin_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },

// ── DİKİŞ HATTI DENGELEYİCİ ──
// SLUG: sewing-line-balance-analyzer-pro
// INPUTS: Hat Şefi: SMV Süreleri, Vardiya/Duruş | ; Planlayıcı: Hedef Adet, Operatör | ; Endüstri: Hedef Verim | ; Kalite: Hata
  { formulaId: "user.sewing_line_balance_analyzer_pro_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "taktTime" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleTotal" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "theoOperators" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "actOperators" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "lineEff" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "balanceDelay" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "smoothness" },
  { formulaId: "user.sewing_line_balance_analyzer_pro_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "wIP" },

// ── DYE REÇETE MALİYET ──
// SLUG: dye-recipe-cost-analyzer
// INPUTS: Boya Ustası: Flotte Oranı, Kumaş Ağırlık, Konsantrasyon | ; Laborant: Dozaj | ; Enerji: Isıtma | ; Çevre: KOI Eşik | ; Muhasebe: RFT
  { formulaId: "user.dye_recipe_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Dye" },
  { formulaId: "user.dye_recipe_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Chem" },
  { formulaId: "user.dye_recipe_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Water" },
  { formulaId: "user.dye_recipe_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Energy" },
  { formulaId: "user.dye_recipe_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Waste" },
  { formulaId: "user.dye_recipe_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalBatch" },
  { formulaId: "user.dye_recipe_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rFT_Savings" },
  { formulaId: "user.dye_recipe_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerKg" },

// ── ENERJİ TÜKETİM RAPORU ──
// SLUG: energy-consumption-report-analyzer
// INPUTS: Bakımcı: Aktif T0-T3, Reaktif, Demax | ; Enerji: PF Hedef, Ceza Eşik | ; Mali: Aktif/Reaktif/Güç Bedeli | ; Sürdürülebilirlik: Karbon
  { formulaId: "user.energy_consumption_report_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "active" },
  { formulaId: "user.energy_consumption_report_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "reactive" },
  { formulaId: "user.energy_consumption_report_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "pF" },
  { formulaId: "user.energy_consumption_report_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "reactivePenalty" },
  { formulaId: "user.energy_consumption_report_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "demandCharge" },
  { formulaId: "user.energy_consumption_report_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "tOU" },
  { formulaId: "user.energy_consumption_report_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.energy_consumption_report_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbon" },

// ── ENFLASYON ESKALASYON ──
// SLUG: inflation-escalation-analyzer
// INPUTS: Satın Alma: Baz Malzeme, Malzeme Enflasyon | ; İK: Baz İşçilik, Ücret Artış | ; Proje: Süre, Risk | ; CFO: Nominal/Genel Enflasyon
  { formulaId: "user.inflation_escalation_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "esc_Mat" },
  { formulaId: "user.inflation_escalation_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "esc_Lab" },
  { formulaId: "user.inflation_escalation_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseAdj" },
  { formulaId: "user.inflation_escalation_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "realDisc" },
  { formulaId: "user.inflation_escalation_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV_Nom" },
  { formulaId: "user.inflation_escalation_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV_Real" },
  { formulaId: "user.inflation_escalation_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "contingency" },
  { formulaId: "user.inflation_escalation_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },

// ── ENVIRONMENTAL FIRE ──
// SLUG: environmental-waste-cost-analyzer
// INPUTS: Çevre: Tehlikesiz/Tehlikeli/Geri Dönüşüm, Hava Emisyon | ; Tesis: Depolama/Bertaraf Bedeli | ; Mali: Hurda Gelir | ; Hukuk: Ceza Risk
  { formulaId: "user.environmental_waste_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Disp" },
  { formulaId: "user.environmental_waste_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Haz" },
  { formulaId: "user.environmental_waste_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Recyc" },
  { formulaId: "user.environmental_waste_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Emis" },
  { formulaId: "user.environmental_waste_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "penaltyRisk" },
  { formulaId: "user.environmental_waste_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.environmental_waste_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "wasteIntensity" },
  { formulaId: "user.environmental_waste_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "circularity" },

// ── EOQ ENVANTER ──
// SLUG: eoq-inventory-optimizer-analyzer
// INPUTS: Satın Alma: Yıllık Talep, Sipariş Maliyet, Lead Time | ; Depo: Taşıma Maliyet, StdDev | ; Planlama: Hizmet Seviyesi, Stoksuz Maliyet
  { formulaId: "user.eoq_inventory_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "eOQ" },
  { formulaId: "user.eoq_inventory_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOP" },
  { formulaId: "user.eoq_inventory_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "safetyStock" },
  { formulaId: "user.eoq_inventory_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },
  { formulaId: "user.eoq_inventory_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleStock" },
  { formulaId: "user.eoq_inventory_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "turnover" },
  { formulaId: "user.eoq_inventory_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "daysSales" },

// ── EVM MALİYET FORECAST ──
// SLUG: evm-cost-forecast-analyzer
// INPUTS: Proje Kontrol: BAC, PV, EV, AC | ; Proje Müdürü: Varyans Nedeni, Kalan Risk | ; CFO: Yönetim Rezervi
  { formulaId: "user.evm_cost_forecast_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "sV" },
  { formulaId: "user.evm_cost_forecast_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cV" },
  { formulaId: "user.evm_cost_forecast_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "sPI" },
  { formulaId: "user.evm_cost_forecast_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cPI" },
  { formulaId: "user.evm_cost_forecast_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "eAC_CPI" },
  { formulaId: "user.evm_cost_forecast_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "eAC_CPI_SPI" },
  { formulaId: "user.evm_cost_forecast_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "eTC" },
  { formulaId: "user.evm_cost_forecast_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "vAC" },
  { formulaId: "user.evm_cost_forecast_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCPI" },

// ── FABRİKA YERLEŞİM MESAFE ──
// SLUG: factory-layout-distance-analyzer
// INPUTS: Planlayıcı: Akış Matrisi, Y, Alanlar | ; Lojistik: Taşıma Maliyet, Ekipman | ; Tesis: Koridor, Bitişiklik
  { formulaId: "user.factory_layout_distance_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "dist_ij" },
  { formulaId: "user.factory_layout_distance_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "flowCost" },
  { formulaId: "user.factory_layout_distance_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "adjScore" },
  { formulaId: "user.factory_layout_distance_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "spaceUtil" },
  { formulaId: "user.factory_layout_distance_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "matHandCost" },
  { formulaId: "user.factory_layout_distance_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "congestion" },
  { formulaId: "user.factory_layout_distance_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },

// ── FAİZ ORANI RİSKİ ──
// SLUG: interest-rate-risk-analyzer
// INPUTS: Hazine: Değişken/Sabit Borç, Hedge Oranı, Duration | ; Risk: Bps Şok, Volatilite | ; CFO: Swap Spread, Hedef NIM
  { formulaId: "user.interest_rate_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "exposure" },
  { formulaId: "user.interest_rate_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "shockImpact" },
  { formulaId: "user.interest_rate_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "durGap" },
  { formulaId: "user.interest_rate_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "eVE_Change" },
  { formulaId: "user.interest_rate_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "nIM" },
  { formulaId: "user.interest_rate_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "vaR" },
  { formulaId: "user.interest_rate_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "hedgeCost" },
  { formulaId: "user.interest_rate_risk_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "breakEven" },

// ── FILAMENT RECYCLING ──
// SLUG: filament-recycling-analyzer
// INPUTS: Satın Alma: Saf Fiyat/Fire | ; Üretim: Toplama/Pellet, Verim, Enerji | ; Kalite: Mukavemet Kayıp | ; Sürdürülebilirlik: Karbon
  { formulaId: "user.filament_recycling_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Virgin" },
  { formulaId: "user.filament_recycling_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Recyc" },
  { formulaId: "user.filament_recycling_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualPenalty" },
  { formulaId: "user.filament_recycling_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "energySav" },
  { formulaId: "user.filament_recycling_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonCred" },
  { formulaId: "user.filament_recycling_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "total_R" },
  { formulaId: "user.filament_recycling_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },

// ── FİYAT ESNEKLİĞİ ──
// SLUG: price-elasticity-analyzer
// INPUTS: Fiyatlandırma: Mevcut Fiyat/Talep, Değişim | ; Pazarlama: Esneklik, Çapraz Esneklik | ; Muhasebe: Değişken/Sabit Maliyet
  { formulaId: "user.price_elasticity_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "elasticity" },
  { formulaId: "user.price_elasticity_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "newDem" },
  { formulaId: "user.price_elasticity_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "newRev" },
  { formulaId: "user.price_elasticity_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "newMargin" },
  { formulaId: "user.price_elasticity_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "maxPrice" },
  { formulaId: "user.price_elasticity_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "markup" },
  { formulaId: "user.price_elasticity_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "cannibLoss" },
  { formulaId: "user.price_elasticity_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "netImpact" },

// ── FLEXIBLE MANUFACTURING ROI ──
// SLUG: flexible-manufacturing-roi-analyzer
// INPUTS: Üretim: Dedicated/FMS Bedel, Setup Sayısı | ; Endüstri: WIP/Hurda Azalma | ; Satış: TTM Kazanç, Prim Marj | ; CFO: Taşıma
  { formulaId: "user.flexible_manufacturing_roi_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Ded" },
  { formulaId: "user.flexible_manufacturing_roi_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Flex" },
  { formulaId: "user.flexible_manufacturing_roi_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "flexVal" },
  { formulaId: "user.flexible_manufacturing_roi_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "invSav" },
  { formulaId: "user.flexible_manufacturing_roi_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "scrapRed" },
  { formulaId: "user.flexible_manufacturing_roi_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },

// ── GAGE R&R MALİYET ──
// SLUG: gage-rnr-cost-analyzer
// INPUTS: Metroloji: Parça n, Operatör, Tekrar r, Veri | ; Kalite: Tolerans, Yanlış Kabul/Red | ; Üretim: Toplam Kalite
  { formulaId: "user.gage_rnr_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "eV" },
  { formulaId: "user.gage_rnr_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "aV" },
  { formulaId: "user.gage_rnr_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "gRR" },
  { formulaId: "user.gage_rnr_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "pV" },
  { formulaId: "user.gage_rnr_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "tV" },
  { formulaId: "user.gage_rnr_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "pctGRR" },
  { formulaId: "user.gage_rnr_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costError" },
  { formulaId: "user.gage_rnr_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "optTol" },
  { formulaId: "user.gage_rnr_cost_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "finImpact" },

// ── GIDA FİRE MARJ ──
// SLUG: food-waste-margin-analyzer
// INPUTS: Üretim Şefi: Giren/Çıkan Ağırlık, Bozulma/Aşırı | ; Reçete: Teorik Kullanım | ; Muhasebe: kg Maliyet, Salvage | ; Satış: İndirimli
  { formulaId: "user.food_waste_margin_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "yield" },
  { formulaId: "user.food_waste_margin_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "shrinkage" },
  { formulaId: "user.food_waste_margin_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Shrink" },
  { formulaId: "user.food_waste_margin_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Spoil" },
  { formulaId: "user.food_waste_margin_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Over" },
  { formulaId: "user.food_waste_margin_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginLeak" },
  { formulaId: "user.food_waste_margin_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "oEE_Food" },
  { formulaId: "user.food_waste_margin_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "theoUsage" },
  { formulaId: "user.food_waste_margin_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "variance" },

// ── GÜBRE DOZAJ ──
// SLUG: fertilizer-dosage-analyzer
// INPUTS: Ziraat: Hedef Verim, Toprak N-P-K, İhtiyaç, Verimlilik | ; Çiftçi: Alan, İçerik | ; Satın Alma: Fiyat
  { formulaId: "user.fertilizer_dosage_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "nutReq" },
  { formulaId: "user.fertilizer_dosage_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "soilSupp" },
  { formulaId: "user.fertilizer_dosage_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "fertNeed" },
  { formulaId: "user.fertilizer_dosage_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "appRate" },
  { formulaId: "user.fertilizer_dosage_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost" },
  { formulaId: "user.fertilizer_dosage_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "envRisk" },
  { formulaId: "user.fertilizer_dosage_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.fertilizer_dosage_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "precision" },

// ── HACCP DEVIATION ──
// SLUG: haccp-deviation-cost-analyzer
// INPUTS: Gıda Güvenlik: Karantina Hacim, Bekletme, Test | ; Üretim: Rework/İmha | ; Lojistik: Geri Çağırma | ; Hukuk: Ceza
  { formulaId: "user.haccp_deviation_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Hold" },
  { formulaId: "user.haccp_deviation_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Test" },
  { formulaId: "user.haccp_deviation_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Rework" },
  { formulaId: "user.haccp_deviation_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Disp" },
  { formulaId: "user.haccp_deviation_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Recall" },
  { formulaId: "user.haccp_deviation_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "fine" },
  { formulaId: "user.haccp_deviation_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.haccp_deviation_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "rPN" },

// ── HACİMSEL AĞIRLIK ──
// SLUG: volumetric-weight-chargeable-analyzer
// INPUTS: Lojistik: L/W/H, Brüt, Mod | ; Navlun: kg/CBM Fiyat, Min Threshold | ; Depo: İstifleme
  { formulaId: "user.volumetric_weight_chargeable_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "volWeight_Air" },
  { formulaId: "user.volumetric_weight_chargeable_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "volWeight_Road" },
  { formulaId: "user.volumetric_weight_chargeable_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "volWeight_Sea" },
  { formulaId: "user.volumetric_weight_chargeable_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "chargeable" },
  { formulaId: "user.volumetric_weight_chargeable_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "freight" },
  { formulaId: "user.volumetric_weight_chargeable_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "density" },
  { formulaId: "user.volumetric_weight_chargeable_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "stackLoss" },
  { formulaId: "user.volumetric_weight_chargeable_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "ineff" },

// ── HAFİFLİK MALİYET TASARRUFU ──
// SLUG: lightweight-cost-savings-analyzer
// INPUTS: Ar-Ge: Orijinal/Yeni Ağırlık, Malzeme | ; Maliyet: Yeni kg Fiyat, Kalıp Farkı | ; Ürün: Ömür/Saat, Yakıt
  { formulaId: "user.lightweight_cost_savings_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "weightRed" },
  { formulaId: "user.lightweight_cost_savings_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelSav_Auto" },
  { formulaId: "user.lightweight_cost_savings_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelSav_Aero" },
  { formulaId: "user.lightweight_cost_savings_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "payloadGain" },
  { formulaId: "user.lightweight_cost_savings_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "matPrem" },
  { formulaId: "user.lightweight_cost_savings_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "toolDelta" },
  { formulaId: "user.lightweight_cost_savings_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "netSav" },

// ── HURDA ORANI OPTİMİZE ──
// SLUG: scrap-rate-optimize-analyzer
// INPUTS: Üretim: Girdi/Hurda, Nedenler | ; Muhasebe: Hammadde/Makine, Salvage | ; Kalite: Hedef | ; Satış: Marj
  { formulaId: "user.scrap_rate_optimize_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "scrapRate" },
  { formulaId: "user.scrap_rate_optimize_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Mat" },
  { formulaId: "user.scrap_rate_optimize_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Lab" },
  { formulaId: "user.scrap_rate_optimize_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_OH" },
  { formulaId: "user.scrap_rate_optimize_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "oppCost" },
  { formulaId: "user.scrap_rate_optimize_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCost" },
  { formulaId: "user.scrap_rate_optimize_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "pareto" },
  { formulaId: "user.scrap_rate_optimize_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "target" },

// ── HVAC KAPASİTE ──
// SLUG: hvac-capacity-analyzer
// INPUTS: Makine: Alan/Hacim, Dış/İç Sıcaklık, U Değerleri, Kişi/Işık | ; Tesis: ACH, EER | ; Enerji: Saat, Tarif
  { formulaId: "user.hvac_capacity_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "sensible" },
  { formulaId: "user.hvac_capacity_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "latent" },
  { formulaId: "user.hvac_capacity_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.hvac_capacity_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "envelope" },
  { formulaId: "user.hvac_capacity_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "internal" },
  { formulaId: "user.hvac_capacity_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "vent" },
  { formulaId: "user.hvac_capacity_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "tons" },
  { formulaId: "user.hvac_capacity_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "eER" },
  { formulaId: "user.hvac_capacity_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualCost" },

// ── HYDRAULIC SİSTEM KAYIP ──
// SLUG: hydraulic-system-loss-analyzer
// INPUTS: Bakımcı: Basınç, Pompa Debisi, Kaçak, Boru Düşüm | ; Tesis: Vana Kayıp, Saat | ; Enerji: Verim, Tarif
  { formulaId: "user.hydraulic_system_loss_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Leak" },
  { formulaId: "user.hydraulic_system_loss_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Fric" },
  { formulaId: "user.hydraulic_system_loss_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Valve" },
  { formulaId: "user.hydraulic_system_loss_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "heat" },
  { formulaId: "user.hydraulic_system_loss_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "eff" },
  { formulaId: "user.hydraulic_system_loss_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Loss" },
  { formulaId: "user.hydraulic_system_loss_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "degrade" },
  { formulaId: "user.hydraulic_system_loss_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "cool" },

// ── ISI EXCHANGER FOULING ──
// SLUG: heat-exchanger-fouling-analyzer
// INPUTS: Proses: U_clean/dirty, Alan, LMTD | ; Bakım: DP Artış, Temizlik | ; Enerji: Yakıt, Kazan Verim
  { formulaId: "user.heat_exchanger_fouling_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "r_foul" },
  { formulaId: "user.heat_exchanger_fouling_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss" },
  { formulaId: "user.heat_exchanger_fouling_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyPen" },
  { formulaId: "user.heat_exchanger_fouling_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Energy" },
  { formulaId: "user.heat_exchanger_fouling_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "dP_Inc" },
  { formulaId: "user.heat_exchanger_fouling_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "pumpInc" },
  { formulaId: "user.heat_exchanger_fouling_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.heat_exchanger_fouling_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },

// ── ISO 50001 BASELINE ──
// SLUG: iso-50001-baseline-analyzer
// INPUTS: Enerji: Tüketim, Üretim, HDD/CDD | ; Veri: R-Kare, Baz Yıl | ; Tesis: Azaltım, Periyot
  { formulaId: "user.iso_50001_baseline_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "enPI" },
  { formulaId: "user.iso_50001_baseline_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseline" },
  { formulaId: "user.iso_50001_baseline_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cusum_t" },
  { formulaId: "user.iso_50001_baseline_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cusum_Cum" },
  { formulaId: "user.iso_50001_baseline_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "savings" },
  { formulaId: "user.iso_50001_baseline_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "norm" },
  { formulaId: "user.iso_50001_baseline_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "sig" },
  { formulaId: "user.iso_50001_baseline_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "target" },

// ── İÇ VERİM ORANI IRR ──
// SLUG: irr-investment-analyzer
// INPUTS: Analist: Başlangıç, Nakit Akışları, Ömür n, Kalıntı | ; CFO: WACC, Yeniden Yatırım, İskonto
  { formulaId: "user.irr_investment_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV" },
  { formulaId: "user.irr_investment_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "iRR" },
  { formulaId: "user.irr_investment_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "mIRR" },
  { formulaId: "user.irr_investment_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },
  { formulaId: "user.irr_investment_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "pI" },
  { formulaId: "user.irr_investment_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "annuity" },
  { formulaId: "user.irr_investment_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "sens" },

// ── İLERLEME YEM MALİYET ──
// SLUG: feed-cost-formulation-analyzer
// INPUTS: Formülatör: Kısıtlar, Besin | ; Satın Alma: Fiyatlar | ; Üretim: Öğütme, Fire | ; Zooteknist: FCR | ; Çiftlik: Kazanç
  { formulaId: "user.feed_cost_formulation_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Ing" },
  { formulaId: "user.feed_cost_formulation_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Base" },
  { formulaId: "user.feed_cost_formulation_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Proc" },
  { formulaId: "user.feed_cost_formulation_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Add" },
  { formulaId: "user.feed_cost_formulation_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "shrink" },
  { formulaId: "user.feed_cost_formulation_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "fCR" },
  { formulaId: "user.feed_cost_formulation_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerKg" },
  { formulaId: "user.feed_cost_formulation_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "opt" },

// ── İSKELE KİRALAMA ──
// SLUG: scaffold-rental-cost-analyzer
// INPUTS: Şantiye: Çevre/Yükseklik, Süre | ; Taşeron: m² Kiralama/İşçilik | ; Lojistik: Sefer | ; Proje: Kritik Yol, Risk
  { formulaId: "user.scaffold_rental_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "area" },
  { formulaId: "user.scaffold_rental_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "vol" },
  { formulaId: "user.scaffold_rental_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "rental" },
  { formulaId: "user.scaffold_rental_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "lab_Erect" },
  { formulaId: "user.scaffold_rental_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "lab_Dism" },
  { formulaId: "user.scaffold_rental_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "transp" },
  { formulaId: "user.scaffold_rental_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "total" },
  { formulaId: "user.scaffold_rental_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "optDur" },
  { formulaId: "user.scaffold_rental_cost_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "overrun" },

// ── İSTATİSTİKSEL PROSES KONTROL ──
// SLUG: spc-limit-control-analyzer
// INPUTS: Operatör: Alt Grup n, Veri | ; Kalite: USL, LSL, Tip | ; Üretim: Hedef
  { formulaId: "user.spc_limit_control_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "x_Bar_Bar" },
  { formulaId: "user.spc_limit_control_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "r_Bar" },
  { formulaId: "user.spc_limit_control_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "s_Bar" },
  { formulaId: "user.spc_limit_control_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "uCL_X" },
  { formulaId: "user.spc_limit_control_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "lCL_X" },
  { formulaId: "user.spc_limit_control_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "uCL_R" },
  { formulaId: "user.spc_limit_control_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "lCL_R" },
  { formulaId: "user.spc_limit_control_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "sigma" },
  { formulaId: "user.spc_limit_control_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "cp" },

// ── İŞLEME STRATEJİSİ SÜRE ──
// SLUG: machining-strategy-analyzer
// INPUTS: İmalat: V_c, f, a_p, m | ; CNC: Max Güç, Özgül Enerji | ; Muhasebe: Değişim Süre, Takım
  { formulaId: "user.machining_strategy_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "mRR" },
  { formulaId: "user.machining_strategy_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "power" },
  { formulaId: "user.machining_strategy_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "toolLife" },
  { formulaId: "user.machining_strategy_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost" },
  { formulaId: "user.machining_strategy_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "opt_Vc" },
  { formulaId: "user.machining_strategy_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "t_opt" },
  { formulaId: "user.machining_strategy_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "ra" },
  { formulaId: "user.machining_strategy_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "check" },

// ── KAIZEN TASARRUF TAKİPÇİSİ ──
// SLUG: kaizen-savings-tracker-analyzer
// INPUTS: Yalın: Baz/Gerçek Maliyet, Süre | ; Üretim: Hacim | ; İK: İşçilik/Malzeme | ; Finans: Dönüşüm, Kontrol Ayı
  { formulaId: "user.kaizen_savings_tracker_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "hard" },
  { formulaId: "user.kaizen_savings_tracker_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "soft" },
  { formulaId: "user.kaizen_savings_tracker_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "impCost" },
  { formulaId: "user.kaizen_savings_tracker_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.kaizen_savings_tracker_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },
  { formulaId: "user.kaizen_savings_tracker_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "sust" },
  { formulaId: "user.kaizen_savings_tracker_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "cum" },
  { formulaId: "user.kaizen_savings_tracker_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "opp" },

// ── Kalite Maliyeti PAF ──
// SLUG: quality-cost-paf-analyzer
// INPUTS: Kalite Müdürü: Eğitim/Planlama Bütçesi, Muayene/Test Maliyeti | ; Üretim Şefi: Hurda/Yeniden İşleme Maliyeti, Duruş Maliyeti | ; Satış/Servis: Garanti/İade Maliyeti, Kayıp Satış Tahmini | ; CFO: Toplam Gelir
  { formulaId: "user.quality_cost_paf_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "preventionCost" },
  { formulaId: "user.quality_cost_paf_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "appraisalCost" },
  { formulaId: "user.quality_cost_paf_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "internalFailure" },
  { formulaId: "user.quality_cost_paf_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "externalFailure" },
  { formulaId: "user.quality_cost_paf_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCOQ" },
  { formulaId: "user.quality_cost_paf_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cOQ_Ratio" },
  { formulaId: "user.quality_cost_paf_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "pAF_Ratio" },

// ── Karbon Ayak izi Check ──
// SLUG: carbon-footprint-check-analyzer
// INPUTS: Çevre Mühendisi: Yakıt Tüketimleri, Kaçak Emisyon, Elektrik Tüketimi | ; Satın Alma: Malzeme Miktarları ve EF | ; Lojistik: Taşıma Mesafesi ve Modu | ; CFO: Gelecek Karbon Fiyatı, Üretim Hacmi
  { formulaId: "user.carbon_footprint_check_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "scope1" },
  { formulaId: "user.carbon_footprint_check_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "scope2_Location" },
  { formulaId: "user.carbon_footprint_check_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "scope2_Market" },
  { formulaId: "user.carbon_footprint_check_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "scope3_Upstream" },
  { formulaId: "user.carbon_footprint_check_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalCarbon" },
  { formulaId: "user.carbon_footprint_check_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonIntensity" },
  { formulaId: "user.carbon_footprint_check_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialRisk" },

// ── Kaynak Hacmi ve Maliyeti ──
// SLUG: weld-volume-cost-analyzer
// INPUTS: Kaynakçı: Kaynak Boyu Leg, Uzunluk | ; Kaynak Mühendisi: Tel Çapı/Ekim Verimi, Gaz Debisi, Voltaj/Akım | ; Satın Alma: Tel/Gaz kg/m3 Fiyatı | ; Maliyet: İşçilik Saati, Elektrik
  { formulaId: "user.weld_volume_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "area_Weld" },
  { formulaId: "user.weld_volume_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "volume_Weld" },
  { formulaId: "user.weld_volume_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "weight_Deposited" },
  { formulaId: "user.weld_volume_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "weight_Electrode" },
  { formulaId: "user.weld_volume_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Filler" },
  { formulaId: "user.weld_volume_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Gas" },
  { formulaId: "user.weld_volume_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Power" },
  { formulaId: "user.weld_volume_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalWeldCost" },

// ── Kaynak Maliyeti ──
// SLUG: weld-cost-analysis-analyzer
// INPUTS: Üretim Planlayıcı: Toplam Kaynak Metresi, Vardiya Süresi | ; Kaynak Mühendisi: İlerleme Hızı cm/min, Ark Süresi Oranı | ; Maliyet: Dolgu/Gaz/Enerji Maliyeti, İşçilik/Overhead
  { formulaId: "user.weld_cost_analysis_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "operatingFactor" },
  { formulaId: "user.weld_cost_analysis_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "depositionRate" },
  { formulaId: "user.weld_cost_analysis_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalJointCost" },
  { formulaId: "user.weld_cost_analysis_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerMeter" },
  { formulaId: "user.weld_cost_analysis_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "consumableCostPct" },
  { formulaId: "user.weld_cost_analysis_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCostPct" },

// ── Kaynak Mukavemeti ──
// SLUG: weld-strength-analyzer
// INPUTS: Tasarım Mühendisi: Kaynak Boyu Leg, Uzunluk, Uygulanan Yük/Moment | ; Malzeme Mühendisi: Elektrod Çekme Dayanımı, Malzeme Akma | ; Kalite: NDT Hata Oranı, Güvenlik Faktörü Hedefi
  { formulaId: "user.weld_strength_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "throatThickness" },
  { formulaId: "user.weld_strength_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "area_Shear" },
  { formulaId: "user.weld_strength_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "allowableShearStress" },
  { formulaId: "user.weld_strength_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "maxLoad_Shear" },
  { formulaId: "user.weld_strength_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "safetyFactor" },
  { formulaId: "user.weld_strength_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "bendingStress" },
  { formulaId: "user.weld_strength_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "combinedStress" },

// ── Kesim Parameters Takım ömrü ──
// SLUG: cutting-tool-life-analyzer
// INPUTS: CNC Operatörü: Kesme Hızı V_c, İlerleme f, Derinlik a_p | ; İmalat Mühendisi: k, Takım Ucu Maliyeti, Kenar Sayısı | ; Planlayıcı: Takım Değişim Süresi, Makine Ücreti
  { formulaId: "user.cutting_tool_life_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "toolLife_T" },
  { formulaId: "user.cutting_tool_life_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "taylorExponent_n" },
  { formulaId: "user.cutting_tool_life_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerPart_Tool" },
  { formulaId: "user.cutting_tool_life_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalToolLife_Cost" },
  { formulaId: "user.cutting_tool_life_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimal_Vc" },
  { formulaId: "user.cutting_tool_life_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "productionRate" },

// ── Kesme-Dolgu Denge ──
// SLUG: cut-fill-balance-analyzer
// INPUTS: Harita Mühendisi: Enkesit Alanları Kesim/Dolgu, İstasyon Mesafeleri | ; Şantiye Şefi: Şişme/Küçülme Faktörleri | ; Lojistik: Nakliye Birim Fiyatı | ; Proje Müdürü: Ödünç/Depo Alanı Mesafesi
  { formulaId: "user.cut_fill_balance_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "volume_Cut" },
  { formulaId: "user.cut_fill_balance_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "volume_Fill" },
  { formulaId: "user.cut_fill_balance_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "shrinkageFactor" },
  { formulaId: "user.cut_fill_balance_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "swellFactor" },
  { formulaId: "user.cut_fill_balance_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "netBalance" },
  { formulaId: "user.cut_fill_balance_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "borrowRequired" },
  { formulaId: "user.cut_fill_balance_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "wasteRequired" },
  { formulaId: "user.cut_fill_balance_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "haulCost" },

// ── Kiriş Ağırlığı ──
// SLUG: beam-weight-analyzer
// INPUTS: Statik Mühendis: Profil Tipi/Boyutu, Uzunluk, Adet | ; Malzeme Mühendisi: Çelik Yoğunluğu, Elastisite Modülü E | ; Satın Alma: Ton Fiyatı | ; İmalat: Boya/Yalıtım m2 Maliyeti
  { formulaId: "user.beam_weight_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "area_Cross" },
  { formulaId: "user.beam_weight_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "weight_PerMeter" },
  { formulaId: "user.beam_weight_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalWeight" },
  { formulaId: "user.beam_weight_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Material" },
  { formulaId: "user.beam_weight_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "paintArea" },
  { formulaId: "user.beam_weight_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "fireproofingArea" },
  { formulaId: "user.beam_weight_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "deflection_Max" },
  { formulaId: "user.beam_weight_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "moment_Max" },

// ── Kompresör Kaçağı Maliyet ──
// SLUG: compressed-air-leak-analyzer
// INPUTS: Bakım Teknisyeni: Kaçak Çapı d, Hat Basıncı, Kaçak Sayısı | ; Enerji Mühendisi: Kompresör Verimi, Yıllık Çalışma Saati, Elektrik Tarifesi | ; Tesis Müdürü: Tamir Maliyeti, Emisyon Faktörü
  { formulaId: "user.compressed_air_leak_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "leakFlow_CFM" },
  { formulaId: "user.compressed_air_leak_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "power_Loss_kW" },
  { formulaId: "user.compressed_air_leak_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualEnergyLoss" },
  { formulaId: "user.compressed_air_leak_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Leak" },
  { formulaId: "user.compressed_air_leak_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalLeakCost" },
  { formulaId: "user.compressed_air_leak_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonEmissions" },
  { formulaId: "user.compressed_air_leak_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback_Repair" },

// ── Kompresör Tankı Boyutlandırma ──
// SLUG: compressor-tank-sizing-analyzer
// INPUTS: Makine Mühendisi: Kompresör Debisi Q m3/min, Max/Min Basınç bar | ; Tesis Mühendisi: Hedef Dolum Süresi sn, İzin Verilen Max Start/Saat | ; Satın Alma: Tank Litre Fiyatı | ; Bakım: Mevcut Tank Hacmi
  { formulaId: "user.compressor_tank_sizing_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "v_Tank" },
  { formulaId: "user.compressor_tank_sizing_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "t" },
  { formulaId: "user.compressor_tank_sizing_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "q" },
  { formulaId: "user.compressor_tank_sizing_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "p_Max" },
  { formulaId: "user.compressor_tank_sizing_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "p_Min" },
  { formulaId: "user.compressor_tank_sizing_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleTime" },
  { formulaId: "user.compressor_tank_sizing_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "cyclesPerHour" },
  { formulaId: "user.compressor_tank_sizing_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "motorStartLimit" },
  { formulaId: "user.compressor_tank_sizing_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Tank" },

// ── Konteyner Yükü ──
// SLUG: container-load-analyzer
// INPUTS: Lojistik Planlayıcı: Konteyner Tipi, İç Hacim/Payload | ; Depo Şefi: Palet/Koli Ölçüleri, Brüt Ağırlık | ; Navlun: Konteyner Taşıma Bedeli | ; İhracat: İstifleme Kısıtı
  { formulaId: "user.container_load_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "volume_Utilization" },
  { formulaId: "user.container_load_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "weight_Utilization" },
  { formulaId: "user.container_load_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "chargeableWeight" },
  { formulaId: "user.container_load_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "loadEfficiency" },
  { formulaId: "user.container_load_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "wastedSpaceCost" },
  { formulaId: "user.container_load_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "palletStacking" },
  { formulaId: "user.container_load_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "maxPallets" },

// ── Kumaş Kesim Optimize Edici ──
// SLUG: fabric-cutting-optimizer-analyzer
// INPUTS: Kesimhane Şefi: Kumaş Eni, Pastal Boyu, Fire/EndLoss | ; Modelist: Parça Alanları, Pastal Verimi | ; Satın Alma: Metretül Fiyatı | ; Üretim Müdürü: Ortalama Bindirme Payı
  { formulaId: "user.fabric_cutting_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "markerEfficiency" },
  { formulaId: "user.fabric_cutting_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "fabricRequired" },
  { formulaId: "user.fabric_cutting_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Fabric" },
  { formulaId: "user.fabric_cutting_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "utilization_Gain" },
  { formulaId: "user.fabric_cutting_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "splicingLoss" },
  { formulaId: "user.fabric_cutting_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalYardage" },

// ── Kur Riski ──
// SLUG: currency-risk-analyzer
// INPUTS: Hazine: Döviz Gelir/Gider, Vadeler | ; Risk Yöneticisi: Döviz Çifti, Volatilite, Zaman Ufku, Z-Skoru | ; CFO: Hedge Oranı, Forward Puanı, Spot/Forward Kur
  { formulaId: "user.currency_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "exposure_FC" },
  { formulaId: "user.currency_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "vaR_Historical" },
  { formulaId: "user.currency_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "vaR_Parametric" },
  { formulaId: "user.currency_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "hedgedExposure" },
  { formulaId: "user.currency_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "unhedgedVaR" },
  { formulaId: "user.currency_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "costOfHedge" },
  { formulaId: "user.currency_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "netImpact" },

// ── KWh Maliyet ──
// SLUG: kwh-cost-analyzer
// INPUTS: Elektrik Mühendisi: Aktif/Reaktif Tüketim, Çekilen Güç kW, Güç Faktörü | ; Enerji Yöneticisi: Enerji/Güç/Reaktif Birim Fiyat, Ceza Eşiği | ; Mali İşler: Vergi/Fon Oranı | ; Tesis Müdürü: Tepe Gücü Trafo Kapasitesi
  { formulaId: "user.kwh_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyCharge" },
  { formulaId: "user.kwh_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "demandCharge" },
  { formulaId: "user.kwh_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "reactivePenalty" },
  { formulaId: "user.kwh_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "taxesAndFees" },
  { formulaId: "user.kwh_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalBill" },
  { formulaId: "user.kwh_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "unitCost_kWh" },
  { formulaId: "user.kwh_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "peakShavingSavings" },

// ── Lojistik Rota Kaybı ──
// SLUG: logistics-route-loss-analyzer
// INPUTS: Filo Yöneticisi: İdeal/Gerçek Mesafe km, Ortalama Hız km/s | ; Lojistik: Yakıt Tüketim Oranı L/km, Yakıt Fiyatı | ; İK: Sürücü Saatlik Ücreti | ; Maliyet: Araç Km Aşınma Maliyeti currency/km
  { formulaId: "user.logistics_route_loss_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "idealDistance" },
  { formulaId: "user.logistics_route_loss_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualDistance" },
  { formulaId: "user.logistics_route_loss_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "driftPct" },
  { formulaId: "user.logistics_route_loss_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelWaste" },
  { formulaId: "user.logistics_route_loss_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "timeWaste" },
  { formulaId: "user.logistics_route_loss_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalRouteLoss" },
  { formulaId: "user.logistics_route_loss_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "efficiency" },

// ── Mağaza Saatlik Ücret ──
// SLUG: shop-hourly-rate-analyzer
// INPUTS: Servis Müdürü: Teknisyen/İdari Ücretler, Faturalanabilir Saat Hedefi | ; Muhasebe: Kira/Fatura/Sigorta, Amortisman | ; İşletme Sahibi: Hedef Kâr Marjı, Gerçek Faturalama Ücreti
  { formulaId: "user.shop_hourly_rate_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "directLabor" },
  { formulaId: "user.shop_hourly_rate_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "indirectLabor" },
  { formulaId: "user.shop_hourly_rate_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhead" },
  { formulaId: "user.shop_hourly_rate_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalShopCost" },
  { formulaId: "user.shop_hourly_rate_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "billableHours" },
  { formulaId: "user.shop_hourly_rate_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "shopHourlyRate" },
  { formulaId: "user.shop_hourly_rate_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "effectiveMargin" },

// ── Mahsul Verim Kaybı Analizörü ──
// SLUG: crop-yield-loss-analyzer
// INPUTS: Ziraat Mühendisi: Genetik Potansiyel kg/da, Çevre Faktörü, Hasat Edilen kg | ; Tarla Yöneticisi: Zararlı/Hava/Besin Kayıp Oranları | ; Finans: Piyasa Fiyatı currency/kg, Müdahale Maliyeti
  { formulaId: "user.crop_yield_loss_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "potentialYield" },
  { formulaId: "user.crop_yield_loss_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualYield" },
  { formulaId: "user.crop_yield_loss_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "yieldGap" },
  { formulaId: "user.crop_yield_loss_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Pest" },
  { formulaId: "user.crop_yield_loss_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Weather" },
  { formulaId: "user.crop_yield_loss_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "loss_Nutrient" },
  { formulaId: "user.crop_yield_loss_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialLoss" },
  { formulaId: "user.crop_yield_loss_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI_Intervention" },

// ── Makine Ekonomik Ömrü ──
// SLUG: machine-economic-life-analyzer
// INPUTS: Tesis Müdürü: İlk Maliyet/Piyasa Değeri, Kalıntı Değer | ; Bakım Müdürü: Yıllık İşletme/Bakım Maliyetleri | ; Finans: İskonto Oranı i, Analiz Periyodu n | ; Satın Alma: Yeni Makine Teklifi
  { formulaId: "user.machine_economic_life_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "eUAC_Capital" },
  { formulaId: "user.machine_economic_life_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "eUAC_Operating" },
  { formulaId: "user.machine_economic_life_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalEUAC" },
  { formulaId: "user.machine_economic_life_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "economicLife" },
  { formulaId: "user.machine_economic_life_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "defender_EUAC" },
  { formulaId: "user.machine_economic_life_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "challenger_EUAC" },
  { formulaId: "user.machine_economic_life_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "replacementDecision" },

// ── Malzeme Replacement Maliyet ──
// SLUG: material-replacement-cost-analyzer
// INPUTS: Ar-Ge: Mevcut/Alternatif Malzeme Maliyeti currency/kg, Ağırlıklar | ; Üretim: İşleme/Bakım/İmha Maliyetleri | ; Kalite: Kalifikasyon/Test Maliyeti | ; Finans: Yakıt Tasarrufu Parametreleri, Tooling Yatırımı
  { formulaId: "user.material_replacement_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO_Current" },
  { formulaId: "user.material_replacement_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO_Alternative" },
  { formulaId: "user.material_replacement_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "weightSavings" },
  { formulaId: "user.material_replacement_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelSavings" },
  { formulaId: "user.material_replacement_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "netBenefit" },
  { formulaId: "user.material_replacement_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },

// ── MOQ Stok Denge ──
// SLUG: moq-stock-balance-analyzer
// INPUTS: Satın Alma: Yıllık Talep, Sipariş Maliyeti, MOQ | ; Satın Alma: Standart/MOQ Birim Fiyat | ; Depo: Birim Taşıma Maliyeti | ; Planlama: Tedarik Süresi, Stok Alanı Kısıtı
  { formulaId: "user.moq_stock_balance_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "eOQ" },
  { formulaId: "user.moq_stock_balance_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "mOQ_Penalty" },
  { formulaId: "user.moq_stock_balance_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "priceBreakSavings" },
  { formulaId: "user.moq_stock_balance_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "netBenefit" },
  { formulaId: "user.moq_stock_balance_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalOrderQty" },
  { formulaId: "user.moq_stock_balance_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleStock_Cost" },

// ── MTBF/MTTR Finansal Etki ──
// SLUG: mtbf-mttr-financial-analyzer
// INPUTS: Bakım Mühendisi: MTBF saat, MTTR saat, Arıza Sayısı | ; Üretim: Duruş Saat Maliyeti | ; Bakım Şefi: Ortalama Tamir İşçilik/Parça | ; Tesis Müdürü: Toplam Çalışma Süresi, Hedef Availability
  { formulaId: "user.mtbf_mttr_financial_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "availability" },
  { formulaId: "user.mtbf_mttr_financial_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "expectedDowntime" },
  { formulaId: "user.mtbf_mttr_financial_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "downtimeCost" },
  { formulaId: "user.mtbf_mttr_financial_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "failureFrequency" },
  { formulaId: "user.mtbf_mttr_financial_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "repairCost" },
  { formulaId: "user.mtbf_mttr_financial_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalReliabilityCost" },
  { formulaId: "user.mtbf_mttr_financial_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI_Improvement" },
  { formulaId: "user.mtbf_mttr_financial_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetMTBF" },

// ── Muda Atık Maliyet ──
// SLUG: muda-waste-cost-analyzer
// INPUTS: Yalın Uzmanı: Aşırı Üretim Adedi, Bekleme/Hareket Süresi | ; Lojistik: Taşıma Mesafesi/Sefer | ; Üretim: Fazla İşlem Süresi, Hatalı Adet | ; Finans: Birim/Stok Taşıma/İşçilik Maliyetleri
  { formulaId: "user.muda_waste_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "overproduction" },
  { formulaId: "user.muda_waste_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "waiting" },
  { formulaId: "user.muda_waste_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "transport" },
  { formulaId: "user.muda_waste_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "overprocessing" },
  { formulaId: "user.muda_waste_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "inventory" },
  { formulaId: "user.muda_waste_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "motion" },
  { formulaId: "user.muda_waste_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "defects" },
  { formulaId: "user.muda_waste_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalMudaCost" },

// ── Nakit Akışı Açığı ──
// SLUG: cash-flow-gap-analyzer
// INPUTS: Mali İşler: Aylık Nakit Giriş/Çıkış, Alacak/Borç Stok Bakiyeleri | ; Satış: Kredi Satışlar, Vade gün | ; Satın Alma: Kredi Alımlar, Vade gün | ; Finans: Günlük Faiz Oranı
  { formulaId: "user.cash_flow_gap_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cashInflow" },
  { formulaId: "user.cash_flow_gap_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cashOutflow" },
  { formulaId: "user.cash_flow_gap_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "netCashFlow_t" },
  { formulaId: "user.cash_flow_gap_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cumulativeCashFlow" },
  { formulaId: "user.cash_flow_gap_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cashGap" },
  { formulaId: "user.cash_flow_gap_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "dSO" },
  { formulaId: "user.cash_flow_gap_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "dPO" },
  { formulaId: "user.cash_flow_gap_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "dIO" },
  { formulaId: "user.cash_flow_gap_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "cashConversionCycle" },
  { formulaId: "user.cash_flow_gap_9", inputMap: { /* TODO: map schema inputs */ }, outputId: "financingCost" },

// ── Navlun Maliyeti ──
// SLUG: freight-cost-analyzer
// INPUTS: Lojistik: Brüt/Hacimsel Ağırlık, Navlun kg Fiyatı | ; Gümrük: Kıymet, Gümrük Vergisi, THC | ; Taşıyıcı: BAF Oranı, Güvenlik Ücreti | ; Finans: Sabit Gümrükçü Bedeli
  { formulaId: "user.freight_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "chargeableWeight" },
  { formulaId: "user.freight_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseFreight" },
  { formulaId: "user.freight_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "bunkerSurcharge" },
  { formulaId: "user.freight_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "securityFee" },
  { formulaId: "user.freight_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "terminalHandling" },
  { formulaId: "user.freight_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "customsClearance" },
  { formulaId: "user.freight_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalFreightCost" },
  { formulaId: "user.freight_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerUnit" },

// ── Noise & Vibration Maliyet ──
// SLUG: noise-vibration-cost-analyzer
// INPUTS: İSG Uzmanı: Gürültü Seviyeleri ve Süreler, Titreşim İvmeleri | ; Üretim: Titreşim Kaynaklı Hata Oranı, Çıktı Farkı | ; İK: Tarama/KKD/Sigorta Maliyeti | ; Tesis: Yalıtım Yatırımı
  { formulaId: "user.noise_vibration_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "noiseExposure_dBA" },
  { formulaId: "user.noise_vibration_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "vibration_RMS" },
  { formulaId: "user.noise_vibration_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "healthCost" },
  { formulaId: "user.noise_vibration_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "productivityLoss" },
  { formulaId: "user.noise_vibration_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "reworkCost" },
  { formulaId: "user.noise_vibration_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "mitigationROI" },

// ── OEE ve Durma Süresi ──
// SLUG: oee-downtime-analyzer
// INPUTS: Üretim Şefi: Planlı/Gerçek Çalışma Süresi, İdeal Çevrim | ; Kalite: Toplam/Sağlam Adet | ; Finans: Dakika Başına Duruş Maliyeti, Birim Maliyet | ; Tesis Müdürü: Takvim Süresi AllTime
  { formulaId: "user.oee_downtime_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "availability" },
  { formulaId: "user.oee_downtime_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "performance" },
  { formulaId: "user.oee_downtime_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "quality" },
  { formulaId: "user.oee_downtime_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "oEE" },
  { formulaId: "user.oee_downtime_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "tEEP" },
  { formulaId: "user.oee_downtime_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "downtimeCost" },
  { formulaId: "user.oee_downtime_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "speedLoss" },
  { formulaId: "user.oee_downtime_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualityLoss" },

// ── Ofis Malzemeleri Maliyet ──
// SLUG: office-supplies-cost-analyzer
// INPUTS: İdari İşler: Çalışan Sayısı, Tüketim Miktarları, Birim Fiyatlar | ; Satın Alma: Sipariş Maliyeti, Acil Kargo Maliyeti | ; Depo: Stok Taşıma Oranı | ; Finans: Fire/İsraf Oranı
  { formulaId: "user.office_supplies_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "consumptionRate" },
  { formulaId: "user.office_supplies_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualCost" },
  { formulaId: "user.office_supplies_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "carryingCost" },
  { formulaId: "user.office_supplies_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "stockoutCost" },
  { formulaId: "user.office_supplies_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "eOQ_Office" },
  { formulaId: "user.office_supplies_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "wastePct" },
  { formulaId: "user.office_supplies_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimizationSavings" },

// ── Overtime vs. Hiring Breakeven ──
// SLUG: overtime-hiring-breakeven-analyzer
// INPUTS: İK Müdürü: İşe Alım/Eğitim Maliyeti, Yan Haklar | ; Üretim: Normal/Fazla Mesai Ücreti, Mesai Çarpanı | ; Kalite: Yorgunluk Hata Oranı, Hata Maliyeti | ; Planlama: Beklenen Mesai Saati
  { formulaId: "user.overtime_hiring_breakeven_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "overtimeCost_Hour" },
  { formulaId: "user.overtime_hiring_breakeven_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "hiringCost_Total" },
  { formulaId: "user.overtime_hiring_breakeven_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualNewHireCost" },
  { formulaId: "user.overtime_hiring_breakeven_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "breakevenHours" },
  { formulaId: "user.overtime_hiring_breakeven_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "decision" },
  { formulaId: "user.overtime_hiring_breakeven_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualityCost_OT" },

// ── Ödeme Vadesi Optimize Edici ──
// SLUG: payment-terms-optimizer-analyzer
// INPUTS: Satış Müdürü: Yıllık Gelir, Ortalama Vade gün | ; Finans: WACC, Erken Ödeme İskontosu, İskonto Kullanım Oranı | ; Risk: Temerrüt/Batma Oranı | ; Muhasebe: Alacak Bakiyesi
  { formulaId: "user.payment_terms_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "dSO" },
  { formulaId: "user.payment_terms_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "carryingCost_AR" },
  { formulaId: "user.payment_terms_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "badDebtExpense" },
  { formulaId: "user.payment_terms_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "discountCost" },
  { formulaId: "user.payment_terms_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalTerms" },
  { formulaId: "user.payment_terms_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cashFlowImpact" },
  { formulaId: "user.payment_terms_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV_Terms" },

// ── Öğrenme Eğrisi Süre Tahmincisi ──
// SLUG: learning-curve-time-analyzer
// INPUTS: Endüstri Mühendisi: İlk Birim Süresi, Öğrenme Oranı, Hedef Standart Süre | ; Üretim Planlayıcı: Toplam Üretim Adedi N | ; İK: Saatlik İşçilik Maliyeti | ; Kalite: Hata Düzeltme Süresi
  { formulaId: "user.learning_curve_time_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "learningRate" },
  { formulaId: "user.learning_curve_time_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "slope_b" },
  { formulaId: "user.learning_curve_time_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "time_N" },
  { formulaId: "user.learning_curve_time_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "cumulativeTime_N" },
  { formulaId: "user.learning_curve_time_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "averageTime_N" },
  { formulaId: "user.learning_curve_time_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_N" },
  { formulaId: "user.learning_curve_time_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "breakevenUnit" },
  { formulaId: "user.learning_curve_time_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalLaborCost" },

// ── Palet Rafı Optimize Edici ──
// SLUG: pallet-rack-optimizer-analyzer
// INPUTS: Depo Müdürü: Koridor/Raf Sayısı, Seviye, Palet Kapasitesi | ; Lojistik: Forklift Hızı, Toplama Süresi | ; Statik: Kiriş Uzunluğu/Yük, Elastisite | ; Satın Alma: Raf Sistem Toplam Bedeli
  { formulaId: "user.pallet_rack_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "rackCapacity" },
  { formulaId: "user.pallet_rack_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "floorUtilization" },
  { formulaId: "user.pallet_rack_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "throughput" },
  { formulaId: "user.pallet_rack_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "deflection" },
  { formulaId: "user.pallet_rack_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "safetyFactor" },
  { formulaId: "user.pallet_rack_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerPosition" },
  { formulaId: "user.pallet_rack_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "retrievalTime" },

// ── Poka-Yoke ROI ──
// SLUG: poka-yoke-roi-analyzer
// INPUTS: Kalite Mühendisi: Mevcut Hata Oranı, Hata Başına Maliyet, Etkililik | ; Üretim: Yıllık Üretim | ; Bakım/Ar-Ge: Tasarım/Uygulama/Eğitim Maliyeti | ; Finans: Yıllık Bakım Maliyeti
  { formulaId: "user.poka_yoke_roi_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "currentDefectRate" },
  { formulaId: "user.poka_yoke_roi_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "defectCost_Annual" },
  { formulaId: "user.poka_yoke_roi_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "pokaYoke_Cost" },
  { formulaId: "user.poka_yoke_roi_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "newDefectRate" },
  { formulaId: "user.poka_yoke_roi_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "savings" },
  { formulaId: "user.poka_yoke_roi_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.poka_yoke_roi_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "paybackMonths" },

// ── Porsiyon Maliyet ──
// SLUG: portion-cost-analyzer
// INPUTS: Şef: Reçete Miktarları, Hazırlık Süresi, Fire/Yield | ; Satın Alma: Hammadde Birim Fiyatları | ; Maliyet: İşçilik Saati, Overhead Oranı | ; İşletme: Hedef Food Cost, Menü Fiyatı
  { formulaId: "user.portion_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "ingredientCost" },
  { formulaId: "user.portion_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "yieldAdjustedCost" },
  { formulaId: "user.portion_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCost" },
  { formulaId: "user.portion_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhead" },
  { formulaId: "user.portion_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalPortionCost" },
  { formulaId: "user.portion_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "foodCostPct" },
  { formulaId: "user.portion_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "menuPrice_Target" },
  { formulaId: "user.portion_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "margin" },

// ── Project Maliyet Tahmin ──
// SLUG: project-cost-estimate-analyzer
// INPUTS: Proje Müdürü: İşçilik Saatleri/Ücretleri, Malzeme Listesi | ; Satın Alma: Ekipman Kiralama, Taşeron Teklifleri | ; Finans: Overhead Oranı, Risk Kontenjansı | ; Bütçe: Onaylanmış Bütçe
  { formulaId: "user.project_cost_estimate_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "directLabor" },
  { formulaId: "user.project_cost_estimate_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "directMaterial" },
  { formulaId: "user.project_cost_estimate_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "equipment" },
  { formulaId: "user.project_cost_estimate_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "subcontractor" },
  { formulaId: "user.project_cost_estimate_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhead" },
  { formulaId: "user.project_cost_estimate_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "contingency" },
  { formulaId: "user.project_cost_estimate_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalEstimate" },
  { formulaId: "user.project_cost_estimate_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "costVariance" },

// ── Project Overrun risk ──
// SLUG: project-overrun-analyzer
// INPUTS: Proje Kontrol: PV | ; Proje Müdürü: Planlı/Gerçek Süre gün, Gecikme Cezası currency/gün | ; Risk Yöneticisi: Gecikme/Maliyet Aşım Olasılığı | ; Planlama: Hızlandırma Maliyeti
  { formulaId: "user.project_overrun_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "sPI" },
  { formulaId: "user.project_overrun_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cPI" },
  { formulaId: "user.project_overrun_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "eAC" },
  { formulaId: "user.project_overrun_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "expectedOverrun" },
  { formulaId: "user.project_overrun_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "scheduleDelay" },
  { formulaId: "user.project_overrun_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskExposure" },
  { formulaId: "user.project_overrun_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "mitigationCost" },
  { formulaId: "user.project_overrun_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "netRisk" },

// ── reçete Maliyet Check ──
// SLUG: recipe-cost-check-analyzer
// INPUTS: Üretim Şefi: Giren Çıkan Ağırlık, Fire/Scrap | ; Ar-Ge: Reçete Oranları, Teorik Verim | ; Satın Alma: Hammadde Ortalama Fiyatları | ; Maliyet: Hedef Birim Maliyet
  { formulaId: "user.recipe_cost_check_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "theoreticalCost" },
  { formulaId: "user.recipe_cost_check_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualCost" },
  { formulaId: "user.recipe_cost_check_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "variance" },
  { formulaId: "user.recipe_cost_check_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "yieldLossCost" },
  { formulaId: "user.recipe_cost_check_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "evaporationLoss" },
  { formulaId: "user.recipe_cost_check_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "efficiency" },
  { formulaId: "user.recipe_cost_check_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerKg" },

// ── Restaurant Menü Marj Kaçak ──
// SLUG: restaurant-menu-margin-leak-analyzer
// INPUTS: Restoran Müdürü: Satılan Ürün Adetleri, Başlangıç/Bitiş Stok | ; Şef: Porsiyon Maliyetleri, Kayıtlı Fire | ; Kasiyer: İkram/İptal Tutarı | ; Finans: Toplam Yemek Satışı
  { formulaId: "user.restaurant_menu_margin_leak_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "theoreticalFoodCost" },
  { formulaId: "user.restaurant_menu_margin_leak_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualFoodCost" },
  { formulaId: "user.restaurant_menu_margin_leak_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "variance" },
  { formulaId: "user.restaurant_menu_margin_leak_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "variancePct" },
  { formulaId: "user.restaurant_menu_margin_leak_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "wasteCost" },
  { formulaId: "user.restaurant_menu_margin_leak_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "theftLoss" },
  { formulaId: "user.restaurant_menu_margin_leak_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "idealMargin" },
  { formulaId: "user.restaurant_menu_margin_leak_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualMargin" },

// ── Robot Kol vs. Manuel İşçi ──
// SLUG: robot-vs-manual-analyzer
// INPUTS: Üretim Müdürü: Manuel/Robot Çevrim Süresi sn, Operatör Sayısı | ; İK: Saatlik Ücret ve Yan Haklar | ; Otomasyon: Robot Capex, Ömür yıl, Bakım/Enerji | ; Kalite: Robot/Manuel Verimlilik
  { formulaId: "user.robot_vs_manual_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "manualCost_Annual" },
  { formulaId: "user.robot_vs_manual_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "robotCost_Annual" },
  { formulaId: "user.robot_vs_manual_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "robotOutput" },
  { formulaId: "user.robot_vs_manual_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "manualOutput" },
  { formulaId: "user.robot_vs_manual_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerUnit_Manual" },
  { formulaId: "user.robot_vs_manual_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerUnit_Robot" },
  { formulaId: "user.robot_vs_manual_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.robot_vs_manual_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "payback" },

// ── Rota Maliyet ──
// SLUG: route-cost-analyzer
// INPUTS: Filo Yöneticisi: Toplam Mesafe/Süre, Yakıt Tüketim/Fiyat | ; İK: Sürücü Ücreti | ; Lojistik: Otoyol/Köprü Geçişleri, Bakım km Maliyeti | ; Finans: Amortisman ve Overhead
  { formulaId: "user.route_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "distanceCost" },
  { formulaId: "user.route_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "timeCost" },
  { formulaId: "user.route_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "tollCost" },
  { formulaId: "user.route_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "maintenanceCost" },
  { formulaId: "user.route_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhead" },
  { formulaId: "user.route_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalRouteCost" },
  { formulaId: "user.route_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerKm" },
  { formulaId: "user.route_cost_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerDrop" },

// ── Rota Optimizasyonu Analizörü ──
// SLUG: route-optimization-analyzer
// INPUTS: Lojistik Planlayıcı: Durak Sayısı/Koordinatlar, Depo Konumu | ; Filo: Araç Kapasitesi, Zaman Pencereleri | ; Operasyon: Gecikme Ceza Oranı, Baz Rota Maliyeti
  { formulaId: "user.route_optimization_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "nearestNeighbor_Dist" },
  { formulaId: "user.route_optimization_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "savings_ClarkeWright" },
  { formulaId: "user.route_optimization_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "routeEfficiency" },
  { formulaId: "user.route_optimization_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "dropDensity" },
  { formulaId: "user.route_optimization_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "timeWindowPenalty" },
  { formulaId: "user.route_optimization_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "vehicleUtilization" },
  { formulaId: "user.route_optimization_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalSavings" },

// ── Rüzgar Türbini Yatırım Getirisi ──
// SLUG: wind-turbine-investment-analyzer
// INPUTS: Enerji Mühendisi: Türbin Gücü kW, Güç Eğrisi, Rüzgar Frekansı | ; Finans: Capex, WACC, Teşvik/Tarife currency/kWh | ; İşletme: Kira/Bakım/Sigorta, Türbin Ömrü yıl
  { formulaId: "user.wind_turbine_investment_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "aEP" },
  { formulaId: "user.wind_turbine_investment_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "capacityFactor" },
  { formulaId: "user.wind_turbine_investment_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualRevenue" },
  { formulaId: "user.wind_turbine_investment_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "oPEX" },
  { formulaId: "user.wind_turbine_investment_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "eBITDA" },
  { formulaId: "user.wind_turbine_investment_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "lCOE" },
  { formulaId: "user.wind_turbine_investment_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV" },
  { formulaId: "user.wind_turbine_investment_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "iRR" },

// ── SaaS Shelfware Maliyet ──
// SLUG: saas-shelfware-analyzer
// INPUTS: IT Müdürü: Satın Alınan Lisans, Aktif Kullanıcı | ; Finans: Toplam Sözleşme Bedeli, Tier Fiyat Farkı | ; Ürün: Kullanılan/Toplam Özellik | ; Satın Alma: Aşım Kullanım Bedeli
  { formulaId: "user.saas_shelfware_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalLicenses" },
  { formulaId: "user.saas_shelfware_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "activeUsers" },
  { formulaId: "user.saas_shelfware_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "shelfwarePct" },
  { formulaId: "user.saas_shelfware_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "shelfwareCost" },
  { formulaId: "user.saas_shelfware_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "utilizationRate" },
  { formulaId: "user.saas_shelfware_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "featureAdoption" },
  { formulaId: "user.saas_shelfware_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimizationSavings" },
  { formulaId: "user.saas_shelfware_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "trueUpCost" },

// ── Saatlik Ücret ──
// SLUG: hourly-rate-analyzer
// INPUTS: İK: Brüt Maaş, İkramiye, Yan Haklar | ; Muhasebe: İşveren Vergi Oranı | ; Planlama: Yıllık Hafta/Saat, İzin Haftası, Atıl Zaman | ; Finans: Hedef Kâr Marjı
  { formulaId: "user.hourly_rate_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "grossAnnualSalary" },
  { formulaId: "user.hourly_rate_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "employerTaxes" },
  { formulaId: "user.hourly_rate_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "benefits" },
  { formulaId: "user.hourly_rate_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalLaborCost" },
  { formulaId: "user.hourly_rate_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "productiveHours" },
  { formulaId: "user.hourly_rate_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "fullyBurdenedHourlyRate" },
  { formulaId: "user.hourly_rate_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginRate" },

// ── SMED Değişim Optimize Edici ──
// SLUG: smed-changeover-optimizer-analyzer
// INPUTS: Üretim Şefi: Mevcut İç/Dış Ayar dk, Değişim Frekansı | ; Yalın Uzmanı: Hedef İç Ayar dk, Dönüştürme Oranı | ; Finans: Darboğaz Çıktı Değeri currency/dk, SMED Yatırımı | ; Planlama: Vardiya Süresi dk
  { formulaId: "user.smed_changeover_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "currentSetupTime" },
  { formulaId: "user.smed_changeover_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetSetupTime" },
  { formulaId: "user.smed_changeover_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "conversionRate" },
  { formulaId: "user.smed_changeover_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "capacityRecovered" },
  { formulaId: "user.smed_changeover_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialGain" },
  { formulaId: "user.smed_changeover_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "sMED_Investment" },
  { formulaId: "user.smed_changeover_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },

// ── Sözleşme Teşvik ──
// SLUG: contract-incentive-analyzer
// INPUTS: Sözleşme Yöneticisi: Hedef Maliyet, Hedef Kar, Paylaşım Oranı | ; Proje Kontrol: Gerçekleşen Maliyet | ; Kalite/Teslimat: Metrik Ağırlıkları/Skorları | ; Finans: Min/Max Kar Çarpanları
  { formulaId: "user.contract_incentive_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetCost" },
  { formulaId: "user.contract_incentive_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetFee" },
  { formulaId: "user.contract_incentive_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "shareRatio" },
  { formulaId: "user.contract_incentive_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualFee" },
  { formulaId: "user.contract_incentive_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "maxFee" },
  { formulaId: "user.contract_incentive_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "minFee" },
  { formulaId: "user.contract_incentive_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "finalFee" },
  { formulaId: "user.contract_incentive_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "finalPrice" },
  { formulaId: "user.contract_incentive_8", inputMap: { /* TODO: map schema inputs */ }, outputId: "performanceBonus" },

// ── SPC Signal Delay Maliyet ──
// SLUG: spc-signal-delay-analyzer
// INPUTS: Kalite Mühendisi: Alpha/Beta Riskleri, Örnekleme Aralığı saat | ; Üretim: Üretim Hızı adet/saat, Hata Oranı OOC | ; Finans: Hata Başına Maliyet, Araştırma İşçiliği
  { formulaId: "user.spc_signal_delay_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "aRL_InControl" },
  { formulaId: "user.spc_signal_delay_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "aRL_OutOfControl" },
  { formulaId: "user.spc_signal_delay_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "detectionDelay_Hours" },
  { formulaId: "user.spc_signal_delay_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "defectsProduced" },
  { formulaId: "user.spc_signal_delay_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Delay" },
  { formulaId: "user.spc_signal_delay_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "investigationCost" },
  { formulaId: "user.spc_signal_delay_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalInterval" },

// ── Steam Trap Enerji kayıp ──
// SLUG: steam-trap-energy-loss-analyzer
// INPUTS: Tesis Mühendisi: Delik Çapı mm, Basınç Farkı bar, Buhar Entalpisi kJ/kg | ; Bakım: Arızalı/Sağlam Kapan Sayısı, Yıllık Çalışma saat | ; Finans: Buhar Üretim Maliyeti currency/kWh, Kapan Değişim Maliyeti
  { formulaId: "user.steam_trap_energy_loss_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "orificeFlow" },
  { formulaId: "user.steam_trap_energy_loss_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "steamLoss_kg_h" },
  { formulaId: "user.steam_trap_energy_loss_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyLoss_kW" },
  { formulaId: "user.steam_trap_energy_loss_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualCost" },
  { formulaId: "user.steam_trap_energy_loss_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "trapFailureRate" },
  { formulaId: "user.steam_trap_energy_loss_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalSystemLoss" },
  { formulaId: "user.steam_trap_energy_loss_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "repairROI" },

// ── Stok Devir hızı risk ──
// SLUG: inventory-turnover-risk-analyzer
// INPUTS: Depo Müdürü: COGS, Ortalama Stok, Yaşlandırma Dağılımı | ; Finans: Sigorta Oranları | ; Satış: Sektör Benchmark, Fire/Obsolescence Oranları | ; Risk: Kurtarılan Değer Oranı
  { formulaId: "user.inventory_turnover_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "inventoryTurnover" },
  { formulaId: "user.inventory_turnover_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "daysSalesInventory" },
  { formulaId: "user.inventory_turnover_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "obsolescenceRisk" },
  { formulaId: "user.inventory_turnover_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "carryingCost" },
  { formulaId: "user.inventory_turnover_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalTurnover" },
  { formulaId: "user.inventory_turnover_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "stockoutRisk" },
  { formulaId: "user.inventory_turnover_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "liquidationLoss" },

// ── Su Kullanımı Optimize Edici ──
// SLUG: water-usage-optimizer-analyzer
// INPUTS: Tesis Müdürü: Toplam Tüketim/Geri Dönüşüm m3, Üretim Hacmi | ; Çevre Mühendisi: Şebeke/Atıksu Birim Fiyatı currency/m3, Su Enerji Yoğunluğu kWh/m3 | ; Bakım: Kaçak Miktarı m3, Ekipman Yatırımı | ; Finans: İskonto Oranı
  { formulaId: "user.water_usage_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "waterIntensity" },
  { formulaId: "user.water_usage_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "baselineConsumption" },
  { formulaId: "user.water_usage_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "waterSavings" },
  { formulaId: "user.water_usage_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "costSavings" },
  { formulaId: "user.water_usage_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "recycleRate" },
  { formulaId: "user.water_usage_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "leakLoss" },
  { formulaId: "user.water_usage_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI_Water" },
  { formulaId: "user.water_usage_optimizer_7", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonFootprint_Water" },

// ── Sulama Maliyet Check ──
// SLUG: irrigation-cost-check-analyzer
// INPUTS: Ziraat Mühendisi: ETc mm/gün, Alan dekar, Efektif Yağış mm | ; Tesis: Toplam Manometrik Yükseklik m, Pompa/Motor Verimi | ; Finans: Elektrik Tarifesi currency/kWh, Bakım currency/da
  { formulaId: "user.irrigation_cost_check_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "waterRequirement" },
  { formulaId: "user.irrigation_cost_check_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "pumpEnergy" },
  { formulaId: "user.irrigation_cost_check_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyCost" },
  { formulaId: "user.irrigation_cost_check_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "maintCost" },
  { formulaId: "user.irrigation_cost_check_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalIrrigationCost" },
  { formulaId: "user.irrigation_cost_check_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerM3" },
  { formulaId: "user.irrigation_cost_check_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "waterUseEfficiency" },

// ── Supplier Performans Tco ──
// SLUG: supplier-performance-tco-analyzer
// INPUTS: Satın Alma: Teklif Fiyatı, Sipariş/Nakliye Maliyeti | ; Kalite: Hata Oranı PPM, Hata Maliyeti | ; Lojistik: Lead Time gün, Güvenlik Stoğu gün | ; Risk: Kesinti Olasılığı, Etki Maliyeti
  { formulaId: "user.supplier_performance_tco_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO" },
  { formulaId: "user.supplier_performance_tco_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualityCost" },
  { formulaId: "user.supplier_performance_tco_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "inventoryCost" },
  { formulaId: "user.supplier_performance_tco_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskCost" },
  { formulaId: "user.supplier_performance_tco_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "supplierScore" },
  { formulaId: "user.supplier_performance_tco_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "tCO_Variance" },

// ── Süt Kâr Dedektörü ──
// SLUG: dairy-profit-detector-analyzer
// INPUTS: Çiftlik Müdürü: Günlük Süt Verimi kg, Yağ/Protein Oranı | ; Zooteknist: Yem Tüketimi kg, Yem Maliyeti currency/kg | ; Veteriner: SCC Somatik Hücre, Sağlık/Üreme Maliyeti | ; Finans: Süt Alım Fiyatı currency/kg, Ceza Eşiği
  { formulaId: "user.dairy_profit_detector_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "fatCorrectedMilk" },
  { formulaId: "user.dairy_profit_detector_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "proteinCorrectedMilk" },
  { formulaId: "user.dairy_profit_detector_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "feedCostPerLiter" },
  { formulaId: "user.dairy_profit_detector_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "incomeOverFeedCost" },
  { formulaId: "user.dairy_profit_detector_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginPerCow" },
  { formulaId: "user.dairy_profit_detector_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "herdProfitability" },
  { formulaId: "user.dairy_profit_detector_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "somaticCellPenalty" },

// ── Taguchi kalite kayıp Fonksiyon ──
// SLUG: taguchi-quality-loss-analyzer
// INPUTS: Kalite Mühendisi: Hedef Değer, Tolerans Sınırı, Toleransta Maliyet | ; Üretim: Gerçekleşen Ortalama, Varyans, Yıllık Üretim | ; Ar-Ge: S/N Oranı Tipi
  { formulaId: "user.taguchi_quality_loss_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "lossPerUnit" },
  { formulaId: "user.taguchi_quality_loss_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "k" },
  { formulaId: "user.taguchi_quality_loss_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "averageLoss" },
  { formulaId: "user.taguchi_quality_loss_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalAnnualLoss" },
  { formulaId: "user.taguchi_quality_loss_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "signalToNoise_LargerBetter" },
  { formulaId: "user.taguchi_quality_loss_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "signalToNoise_SmallerBetter" },
  { formulaId: "user.taguchi_quality_loss_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "qualityImprovementSavings" },

// ── Takım Aşınma Maliyeti ──
// SLUG: tool-wear-cost-analyzer
// INPUTS: İmalat Mühendisi: Kesme Süresi dk, Takım Ömrü dk, Taylor Üssü n | ; CNC Operatörü: Takım Değişim Süresi dk | ; Satın Alma: Uç/Insert Fiyatı, Kenar Sayısı | ; Finans: Makine Saatlik Ücreti
  { formulaId: "user.tool_wear_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "toolCostPerPart" },
  { formulaId: "user.tool_wear_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "changeCostPerPart" },
  { formulaId: "user.tool_wear_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalToolingCost" },
  { formulaId: "user.tool_wear_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "wearRate" },
  { formulaId: "user.tool_wear_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalToolLife" },
  { formulaId: "user.tool_wear_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "costOfPrematureFailure" },

// ── Takt Süre Flexibility Maliyet ──
// SLUG: takt-time-flexibility-analyzer
// INPUTS: Endüstri Mühendisi: Çevrim Süreleri array, Kullanılabilir Süre dk | ; Üretim Planlayıcı: Müşteri Talebi adet | ; İK: Operatör Sayısı, Çapraz Eğitim Saati | ; Finans: İşçilik/Denge Kaybı Maliyeti
  { formulaId: "user.takt_time_flexibility_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "taktTime" },
  { formulaId: "user.takt_time_flexibility_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cycleTimeFlexibility" },
  { formulaId: "user.takt_time_flexibility_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "balanceLoss" },
  { formulaId: "user.takt_time_flexibility_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "crossTrainingCost" },
  { formulaId: "user.takt_time_flexibility_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "flexibilityPremium" },
  { formulaId: "user.takt_time_flexibility_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "volumeVariationCost" },

// ── talep Forecast Stok Maliyet ──
// SLUG: demand-forecast-stock-analyzer
// INPUTS: Planlama: Tahmin/Gerçek Talep array, Lead Time gün | ; İstatistik: Z-Skoru, StdDev | ; Finans: Birim Maliyet, Taşıma Oranı, Stoksuz Kalma Cezası
  { formulaId: "user.demand_forecast_stock_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "forecastError" },
  { formulaId: "user.demand_forecast_stock_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "safetyStock" },
  { formulaId: "user.demand_forecast_stock_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "carryingCost_Safety" },
  { formulaId: "user.demand_forecast_stock_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "stockoutCost" },
  { formulaId: "user.demand_forecast_stock_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalForecastCost" },

// ── Tamirhane Parça ve İşçilik Teklif ──
// SLUG: repair-shop-quote-analyzer
// INPUTS: Servis Danışmanı: Flat Rate Saatleri, Mağaza Saatlik Ücreti | ; Parça Sorumlusu: Parça Listesi/Adet/Dealer Fiyat | ; İşletme: Parça Marj Oranı, Sarf/Çevre Ücreti | ; Muhasebe: Gerçek Harcanan Saat
  { formulaId: "user.repair_shop_quote_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "partCost" },
  { formulaId: "user.repair_shop_quote_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "partMargin" },
  { formulaId: "user.repair_shop_quote_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCost" },
  { formulaId: "user.repair_shop_quote_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "subletCost" },
  { formulaId: "user.repair_shop_quote_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalQuote" },
  { formulaId: "user.repair_shop_quote_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "effectiveLaborRate" },
  { formulaId: "user.repair_shop_quote_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "grossProfitPct" },

// ── Taşeron Marj Sızıntı Dedektörü ──
// SLUG: subcontractor-margin-leak-analyzer
// INPUTS: Proje Müdürü: Sözleşme Bedeli, Taşeron Teklif Bedeli | ; Hakediş: Gerçekleşen Taşeron Hakedişi, Change Order Tutarları | ; Kalite: Rework Maliyeti | ; Planlama: Gecikme Cezaları
  { formulaId: "user.subcontractor_margin_leak_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "quotedMargin" },
  { formulaId: "user.subcontractor_margin_leak_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualMargin" },
  { formulaId: "user.subcontractor_margin_leak_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginLeak" },
  { formulaId: "user.subcontractor_margin_leak_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "changeOrderCost" },
  { formulaId: "user.subcontractor_margin_leak_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "unbilledWork" },
  { formulaId: "user.subcontractor_margin_leak_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "leakagePct" },

// ── Taşıma Mode Maliyet risk ──
// SLUG: transport-mode-risk-analyzer
// INPUTS: Lojistik: Ağırlık kg/Hacim m3, Mesafe km | ; Navlun: Hava/Deniz/Kara Birim Fiyatları | ; Finans: Günlük Stok Taşıma Maliyeti | ; Risk: Hasar/Gecikme Olasılıkları, Kargo Değeri
  { formulaId: "user.transport_mode_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Air" },
  { formulaId: "user.transport_mode_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Sea" },
  { formulaId: "user.transport_mode_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "cost_Road" },
  { formulaId: "user.transport_mode_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "transitTimeCost" },
  { formulaId: "user.transport_mode_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskCost" },
  { formulaId: "user.transport_mode_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalModeCost" },
  { formulaId: "user.transport_mode_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "modeSelection" },

// ── Tedarik Zinciri Kesintisi Risk Değerlendirmesi ──
// SLUG: supply-chain-disruption-analyzer
// INPUTS: Tedarik Zinciri: Kesinti Olasılığı, Günlük Gelir, Tamamlanma Süresi gün | ; Strateji: Tampon Kapasite, Çift Kaynak Prim Maliyeti | ; Finans: Sigorta Primi, Güvenlik Stoğu Maliyeti
  { formulaId: "user.supply_chain_disruption_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskExposure" },
  { formulaId: "user.supply_chain_disruption_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "timeToRecover" },
  { formulaId: "user.supply_chain_disruption_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "revenueLoss" },
  { formulaId: "user.supply_chain_disruption_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "mitigationCost" },
  { formulaId: "user.supply_chain_disruption_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskAdjustedCost" },
  { formulaId: "user.supply_chain_disruption_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "resilienceIndex" },

// ── Tedarikçi Döviz Kuru Riski ──
// SLUG: supplier-currency-risk-analyzer
// INPUTS: Satın Alma: Döviz Cinsi Sözleşme Bedeli, Hedge Edilmeyen Oran | ; Hazine: Spot/Forward Kur, Volatilite | ; Risk: Zaman Ufku gün, Z-Skoru | ; Hukuk: Döviz Ayarlama Klozu Faktörü
  { formulaId: "user.supplier_currency_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "exposure" },
  { formulaId: "user.supplier_currency_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "expectedLoss" },
  { formulaId: "user.supplier_currency_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "vaR" },
  { formulaId: "user.supplier_currency_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "hedgingCost" },
  { formulaId: "user.supplier_currency_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "netRiskCost" },
  { formulaId: "user.supplier_currency_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "currencyClauseSavings" },

// ── Teklif Risk Analizörü ──
// SLUG: bid-risk-analyzer
// INPUTS: Teklif Mühendisi: Doğrudan Maliyetler, Overhead | ; Satış: Teklif Fiyatı, Rakip İndeksi, Tarihsel Kazanma Oranı | ; Risk: Risk Faktörü, Risk Primi | ; Finans: Hedef Marj
  { formulaId: "user.bid_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseEstimate" },
  { formulaId: "user.bid_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "contingency" },
  { formulaId: "user.bid_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "expectedMargin" },
  { formulaId: "user.bid_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "winProbability" },
  { formulaId: "user.bid_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "expectedValue" },
  { formulaId: "user.bid_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskAdjustedBid" },

// ── Tekrarlayan Maliyet (RCA) ──
// SLUG: recurring-cost-analyzer
// INPUTS: Bakım/Kalite: Yıllık Frekans, Olay Başına Maliyet | ; Mühendislik: Düzeltici Aksiyon Yatırımı | ; Finans: İskonto Oranı r, Analiz Ömrü n yıl
  { formulaId: "user.recurring_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "recurringCost_Annual" },
  { formulaId: "user.recurring_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "presentValue_Recurring" },
  { formulaId: "user.recurring_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "rootCauseInvestment" },
  { formulaId: "user.recurring_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "paybackPeriod" },
  { formulaId: "user.recurring_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV_Elimination" },
  { formulaId: "user.recurring_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "breakevenFrequency" },

// ── Tekstil Atığı Risk Değerlendirmesi ──
// SLUG: textile-waste-risk-analyzer
// INPUTS: Üretim: Giren Kumaş/Çıkan Ürün kg, Kesim/Dikim/Boya Fireleri | ; Maliyet: Kumaş kg Fiyatı, İşleme Maliyeti | ; Çevre: Depolama Ücreti, Hurda Geri Kazanım Değeri
  { formulaId: "user.textile_waste_risk_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "wasteRate" },
  { formulaId: "user.textile_waste_risk_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "preConsumerWaste" },
  { formulaId: "user.textile_waste_risk_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialLoss" },
  { formulaId: "user.textile_waste_risk_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "disposalCost" },
  { formulaId: "user.textile_waste_risk_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "circularRevenue" },
  { formulaId: "user.textile_waste_risk_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "netWasteCost" },
  { formulaId: "user.textile_waste_risk_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "riskScore" },

// ── Temizlik Teklifi Optimize Edici ──
// SLUG: cleaning-bid-optimizer-analyzer
// INPUTS: Operasyon: Temizlenebilir Alan m2, Üretim Hızı m2/saat | ; İK: Saatlik Ücret ve Yan Haklar | ; Satın Alma: Sarf Malzeme m2 Maliyeti, Makine Saati | ; Finans: Overhead Oranı, Hedef Marj
  { formulaId: "user.cleaning_bid_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "areaToClean" },
  { formulaId: "user.cleaning_bid_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborHours" },
  { formulaId: "user.cleaning_bid_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCost" },
  { formulaId: "user.cleaning_bid_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "materialCost" },
  { formulaId: "user.cleaning_bid_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "equipmentCost" },
  { formulaId: "user.cleaning_bid_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "overhead" },
  { formulaId: "user.cleaning_bid_optimizer_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "bidPrice" },

// ── Teslimat Maliyeti ──
// SLUG: delivery-cost-analyzer
// INPUTS: Lojistik: Rota Toplam Maliyeti, Durak Sayısı, Mesafe km | ; Operasyon: Başarısız Teslimat Sayısı | ; Finans: İade Navlun/İstoklama Ücreti, Yakıt Endeksi
  { formulaId: "user.delivery_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerDrop" },
  { formulaId: "user.delivery_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerKm" },
  { formulaId: "user.delivery_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "failedDeliveryCost" },
  { formulaId: "user.delivery_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelSurcharge" },
  { formulaId: "user.delivery_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalDeliveryCost" },
  { formulaId: "user.delivery_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "deliveryEfficiency" },

// ── Tohum Oranı ──
// SLUG: seed-rate-analyzer
// INPUTS: Ziraat Mühendisi: Alan m2, Hedef Bitki Sayısı m2, Çimlenme/Tarla Çıkış Oranı | ; Çiftçi: Tohum kg Fiyatı | ; Finans: Mahsul Piyasa Fiyatı currency/kg, Hedef Verim kg
  { formulaId: "user.seed_rate_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "targetPlantPopulation" },
  { formulaId: "user.seed_rate_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "seedRequirement" },
  { formulaId: "user.seed_rate_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "seedCost" },
  { formulaId: "user.seed_rate_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalYield" },
  { formulaId: "user.seed_rate_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialLoss_Under" },
  { formulaId: "user.seed_rate_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "financialLoss_Over" },
  { formulaId: "user.seed_rate_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI_Seed" },

// ── Toplam Çalışan Maliyeti ──
// SLUG: total-employee-cost-analyzer
// INPUTS: İK: Brüt Maaş/İkramiye/Mesai, Yan Haklar | ; Muhasebe: Yasal Kesinti Oranları | ; Üretim: Devamsızlık Saati, Turnover Oranı | ; Finans: İşe Alım/Eğitim Maliyeti, Üretken Saat
  { formulaId: "user.total_employee_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "grossSalary" },
  { formulaId: "user.total_employee_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "statutoryCosts" },
  { formulaId: "user.total_employee_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "benefits" },
  { formulaId: "user.total_employee_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "absenteeismCost" },
  { formulaId: "user.total_employee_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "turnoverCost" },
  { formulaId: "user.total_employee_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalEmployeeCost" },
  { formulaId: "user.total_employee_cost_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerHour" },

// ── Transfer Fiyatlandırması Optimize Edici ──
// SLUG: transfer-pricing-optimizer-analyzer
// INPUTS: Vergi Uzmanı: Karşılaştırılabilir Piyasa Fiyatı, Yüksek/Düşük Vergi Oranları | ; Maliyet: Tam Maliyet/Değişken Maliyet | ; Strateji: Fırsat Maliyeti, Hedef Marj | ; Hukuk: Düzenleyici Ceza Riski
  { formulaId: "user.transfer_pricing_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPlusPrice" },
  { formulaId: "user.transfer_pricing_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "marketBasedPrice" },
  { formulaId: "user.transfer_pricing_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "marginalCost" },
  { formulaId: "user.transfer_pricing_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "taxImpact" },
  { formulaId: "user.transfer_pricing_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "globalProfit" },
  { formulaId: "user.transfer_pricing_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "optimalTransferPrice" },

// ── ürün Complexity Hidden Maliyet ──
// SLUG: product-complexity-hidden-cost-analyzer
// INPUTS: Ürün Yöneticisi: SKU Sayısı, BOM Derinliği | ; Üretim: Değişim Sayısı/Maliyeti | ; Lojistik: Toplam Güvenlik Stoğu | ; Finans: Dolaylı Giderler, Karmaşıklık Sürücü Oranı
  { formulaId: "user.product_complexity_hidden_cost_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "complexityIndex" },
  { formulaId: "user.product_complexity_hidden_cost_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "setupCostComplexity" },
  { formulaId: "user.product_complexity_hidden_cost_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "inventoryCostComplexity" },
  { formulaId: "user.product_complexity_hidden_cost_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "overheadAllocation" },
  { formulaId: "user.product_complexity_hidden_cost_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "hiddenCost" },
  { formulaId: "user.product_complexity_hidden_cost_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "profitabilityPerSKU" },

// ── Vakum Kaçağı Enerji Kaybı ──
// SLUG: vacuum-leak-energy-analyzer
// INPUTS: Bakım: Sistem Hacmi m3, Basınç Düşümü DeltaP bar, Süre DeltaT sn | ; Enerji: Atmosferik Basınç, Pompa Verimi, Yıllık Saat | ; Finans: Elektrik Tarifesi, Emisyon Faktörü
  { formulaId: "user.vacuum_leak_energy_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "leakRate" },
  { formulaId: "user.vacuum_leak_energy_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "powerLoss_kW" },
  { formulaId: "user.vacuum_leak_energy_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualEnergyLoss" },
  { formulaId: "user.vacuum_leak_energy_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "costOfLeak" },
  { formulaId: "user.vacuum_leak_energy_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "pumpCapacityWaste" },
  { formulaId: "user.vacuum_leak_energy_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonEmissions" },

// ── Vardiya Maliyet Verimliliği ──
// SLUG: shift-cost-efficiency-analyzer
// INPUTS: Üretim Şefi: Vardiya/Planlı/Plansız Duruş Süresi dk, Operatör Sayısı | ; Enerji: Makine Gücü kW, Elektrik Tarifesi | ; Finans: Saatlik Ücret, Sağlam Üretim Adedi, Birim Marj
  { formulaId: "user.shift_cost_efficiency_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "plannedProductionTime" },
  { formulaId: "user.shift_cost_efficiency_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualRunTime" },
  { formulaId: "user.shift_cost_efficiency_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCost" },
  { formulaId: "user.shift_cost_efficiency_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyCost" },
  { formulaId: "user.shift_cost_efficiency_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "outputValue" },
  { formulaId: "user.shift_cost_efficiency_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "shiftEfficiency" },
  { formulaId: "user.shift_cost_efficiency_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "costPerUnit" },

// ── Vsm finansal Dönüştürücü ──
// SLUG: vsm-financial-converter-analyzer
// INPUTS: Yalın Uzmanı: Toplam Lead Time gün, Katma Değerli Süre dk | ; Finans: WIP Stok Değeri, Günlük Taşıma Maliyeti | ; Endüstri Mühendisi: Eski/Yeni Çevrim Süresi dk, Yıllık Hacim | ; Kalite: Kalite İyileştirme Tasarrufu
  { formulaId: "user.vsm_financial_converter_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "leadTimeCost" },
  { formulaId: "user.vsm_financial_converter_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "valueAddedRatio" },
  { formulaId: "user.vsm_financial_converter_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "nonValueAddedCost" },
  { formulaId: "user.vsm_financial_converter_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "inventoryReductionSavings" },
  { formulaId: "user.vsm_financial_converter_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "productivityGain" },
  { formulaId: "user.vsm_financial_converter_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalFinancialImpact" },

// ── WPS Preheat Sıcaklık ──
// SLUG: wps-preheat-temperature-analyzer
// INPUTS: Kaynak Mühendisi: Cu, Kalınlık mm, Isı Girdisi kJ/mm | ; Metalürji: Hidrojen Seviyesi ml/100g | ; Tesis: Ortam Sıcaklığı, Isıtıcı Verimi, Enerji Fiyatı
  { formulaId: "user.wps_preheat_temperature_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "carbonEquivalent_CE" },
  { formulaId: "user.wps_preheat_temperature_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "preheatTemp" },
  { formulaId: "user.wps_preheat_temperature_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "criticalCoolingTime" },
  { formulaId: "user.wps_preheat_temperature_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "hydrogenCrackingRisk" },
  { formulaId: "user.wps_preheat_temperature_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "energyCost" },

// ── Yakıt Rota Sapma ──
// SLUG: fuel-route-drift-analyzer
// INPUTS: Filo: Planlı/Gerçek Mesafe km, Planlı/Gerçek Tüketim L/km | ; Operasyon: Rölanti Süresi saat, Rölanti Tüketim L/saat | ; Finans: Yakıt Fiyatı currency/L
  { formulaId: "user.fuel_route_drift_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "plannedFuel" },
  { formulaId: "user.fuel_route_drift_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "actualFuel" },
  { formulaId: "user.fuel_route_drift_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "routeDrift" },
  { formulaId: "user.fuel_route_drift_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelWaste_Distance" },
  { formulaId: "user.fuel_route_drift_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "fuelWaste_Efficiency" },
  { formulaId: "user.fuel_route_drift_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "idleFuelCost" },
  { formulaId: "user.fuel_route_drift_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalDriftCost" },

// ── Yangın Hidrantı Akış ──
// SLUG: fire-hydrant-flow-analyzer
// INPUTS: İtfaiye/İSG: Hidrant Çapı mm, Statik/Pitot Basınç bar, Akış Katsayısı c_d | ; Tesis: Boru Uzunluğu/Çapı, Sürtünme Katsayısı f | ; Risk: Gerekli Akış L/min, Gerekli Basınç bar
  { formulaId: "user.fire_hydrant_flow_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "flowRate_Q" },
  { formulaId: "user.fire_hydrant_flow_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "residualPressure" },
  { formulaId: "user.fire_hydrant_flow_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "availableFlow_At20psi" },
  { formulaId: "user.fire_hydrant_flow_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "frictionLoss" },
  { formulaId: "user.fire_hydrant_flow_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "requiredPumpHead" },
  { formulaId: "user.fire_hydrant_flow_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "compliance" },

// ── Yenileme Bütçesi Optimize Edici ──
// SLUG: renovation-budget-optimizer-analyzer
// INPUTS: Tesis Müdürü: Alan m2, Yenileme Seviyesi, Proje Süresi ay | ; Maliyet: m2 Baz Maliyet, Enflasyon | ; Proje: Risk Faktörü, Tasarım/İzin Oranları | ; Finans: FF&E Bütçesi, Eski/Yeni Mülk Değeri
  { formulaId: "user.renovation_budget_optimizer_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "baseCost" },
  { formulaId: "user.renovation_budget_optimizer_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "escalation" },
  { formulaId: "user.renovation_budget_optimizer_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "contingency" },
  { formulaId: "user.renovation_budget_optimizer_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "softCosts" },
  { formulaId: "user.renovation_budget_optimizer_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "totalBudget" },
  { formulaId: "user.renovation_budget_optimizer_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI_Renovation" },

// ── Yenilenebilir Enerji YG ──
// SLUG: renewable-energy-irr-analyzer
// INPUTS: Enerji Mühendisi: Kurulu Güç kW, Kapasite Faktörü, Sistem Ömrü yıl | ; Finans: Capex, WACC, Şebeke Elektrik Fiyatı currency/kWh | ; İşletme: Yıllık Bakım/Sigorta, Teşvikler
  { formulaId: "user.renewable_energy_irr_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualGeneration" },
  { formulaId: "user.renewable_energy_irr_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualSavings" },
  { formulaId: "user.renewable_energy_irr_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "annualOPEX" },
  { formulaId: "user.renewable_energy_irr_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "netCashFlow" },
  { formulaId: "user.renewable_energy_irr_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "paybackPeriod" },
  { formulaId: "user.renewable_energy_irr_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "lCOE" },
  { formulaId: "user.renewable_energy_irr_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV" },

// ── YG ve NBD ──
// SLUG: roi-npv-analyzer
// INPUTS: Yatırım Analisti: İlk Yatırım, Yıllık Nakit Akışları array, Proje Ömrü yıl | ; Finans: İskonto Oranı/WACC, Hedef ROI
  { formulaId: "user.roi_npv_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "rOI" },
  { formulaId: "user.roi_npv_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "nPV" },
  { formulaId: "user.roi_npv_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "iRR" },
  { formulaId: "user.roi_npv_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "paybackPeriod" },
  { formulaId: "user.roi_npv_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "profitabilityIndex" },
  { formulaId: "user.roi_npv_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "discountedPayback" },

// ── Zaman Etüdü Analizörü ──
// SLUG: standard-time-work-study-calculator
// INPUTS: Endüstri Mühendisi: Gözlemlenen Süreler array, Performans Değerlendirme | ; İK: Kişisel/Yorgunluk/Gecikme Payları, Saatlik Ücret | ; Üretim: Vardiya Süresi dk, Gerçek Üretim Adedi
  { formulaId: "user.standard_time_work_study_0", inputMap: { /* TODO: map schema inputs */ }, outputId: "observedTime" },
  { formulaId: "user.standard_time_work_study_1", inputMap: { /* TODO: map schema inputs */ }, outputId: "normalTime" },
  { formulaId: "user.standard_time_work_study_2", inputMap: { /* TODO: map schema inputs */ }, outputId: "allowancePct" },
  { formulaId: "user.standard_time_work_study_3", inputMap: { /* TODO: map schema inputs */ }, outputId: "standardTime" },
  { formulaId: "user.standard_time_work_study_4", inputMap: { /* TODO: map schema inputs */ }, outputId: "standardOutput" },
  { formulaId: "user.standard_time_work_study_5", inputMap: { /* TODO: map schema inputs */ }, outputId: "laborCostPerUnit" },
  { formulaId: "user.standard_time_work_study_6", inputMap: { /* TODO: map schema inputs */ }, outputId: "efficiencyVariance" },
