import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HEAT_LOSS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "heat-loss-calculator",
  name: "Heat Loss Calculator",
  sectorSlug: "energy-consumption",
  category: "energy",
  legacyPaidSlug: "heat-loss-calculator",
  painStatement:
    "Steady-state heat loss analizini U-Value ve delta-T parametreleriyle gerçekleştirerek yıllık enerji ve ısıtma maliyeti kaybını hesaplayın.",

<<<<<<< Updated upstream
  inputs: [],

  outputs: [],
=======
  inputs: [
    {
      id: "surfaceArea",
      label: "Total surface area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 150,
      validation: { min: 0 },
      helper: "Isı kaybı yaşanan duvar, pencere veya çatı toplam yüzey alanı.",
      expertMeaning: "Total external envelope area contributing to heat transmission.",
    },
    {
      id: "uValue",
      label: "U-Value (Thermal Transmittance)",
      type: "number",
      unit: "W/m²K",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, step: 0.01 },
      helper: "Malzemenin ısı geçirgenlik katsayısı.",
      expertMeaning: "Overall heat transfer coefficient (U-value).",
    },
    {
      id: "insideTemp",
      label: "Inside temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 22,
      helper: "Hedeflenen iç ortam sıcaklığı.",
      expertMeaning: "Thermostat setpoint or internal design temperature.",
    },
    {
      id: "outsideTemp",
      label: "Outside temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: -5,
      helper: "Dış ortam kış tasarım sıcaklığı.",
      expertMeaning: "Winter design ambient temperature for peak load.",
    },
    {
      id: "heatingHours",
      label: "Annual heating hours",
      type: "number",
      unit: "h",
      required: true,
      smartDefault: 2400,
      validation: { min: 0 },
      helper: "Yıllık tahmini ısıtma çalışma saati.",
      expertMeaning: "Equivalent full-load hours of heating season.",
    },
    {
      id: "energyCostPerKwh",
      label: "Energy cost",
      type: "number",
      unit: "$/kWh",
      required: true,
      smartDefault: 0.15,
      validation: { min: 0, step: 0.01 },
      helper: "Kullanılan enerji kaynağının kWh başına maliyeti.",
      expertMeaning: "Blended tariff rate or effective boiler cost per kWh.",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "energy.heat_loss_watts",
      inputMap: {
        area: "surfaceArea",
        uValue: "uValue",
        insideTemp: "insideTemp",
        outsideTemp: "outsideTemp",
      },
      outputId: "heatLossWatts",
    },
    {
      formulaId: "energy.annual_heat_loss_kwh",
      inputMap: {
        watts: "heatLossWatts",
        hours: "heatingHours",
      },
      outputId: "annualHeatLossKwh",
    },
    {
      formulaId: "energy.annual_heat_loss_cost",
      inputMap: {
        kwh: "annualHeatLossKwh",
        rate: "energyCostPerKwh",
      },
      outputId: "annualHeatLossCost",
    }
  ],

  outputs: [
    {
      id: "annualHeatLossCost",
      label: "Annual heat loss cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "heatLossWatts",
      label: "Peak Heat Loss (Watts)",
      unit: "W",
      format: "number",
    },
    {
      id: "annualHeatLossKwh",
      label: "Annual energy lost",
      unit: "kWh",
      format: "number",
    },
  ],
>>>>>>> Stashed changes

  thresholds: [
    {
      fieldId: "annualHeatLossCost",
      warning: 2000,
      critical: 5000,
      direction: "higher_is_bad",
      warningMessage: "Yüksek ısı kaybı maliyeti. İzolasyon iyileştirmesi geri ödeme süresini (ROI) kısaltabilir.",
      criticalMessage: "Kritik ısı kaybı! Ciddi bir enerji israfı mevcut. Hemen termal zarf (envelope) denetimi yaptırın.",
    },
  ],

  reportTemplate: {
    title: "Steady-State Heat Loss & Envelope Efficiency Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Steady-state formula (Q = U × A × ΔT) assumes constant design temperatures.",
      "Infiltration and ventilation losses are not explicitly included in this basic transmission model.",
      "Annual energy is approximated using equivalent full load hours.",
    ],
  },
};
