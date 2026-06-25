import { IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40InputSchema, type IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40Input } from "./ileri-seviye-kompresor-gucu-ve-desarj-termodinamigi-calculator-40-validation";

export const calculateIleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40Contract: any = {
  id: "ileri-seviye-kompresor-gucu-ve-desarj-termodinamigi-calculator-40",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40InputSchema,
  
  execute: async (input: any) => {
    try {
      const V_fad = input.fadFlow; // m3/dk
      const P_g = input.gaugePressure; // Bar
      const T1 = input.inletTemp; // °C
      const n = input.polyIndex; // politropik/izentropik üs (katsayı)
      const eta_is = input.isEff; // % iç kompresyon verimi
      const eta_mech = input.mechEff; // % mekanik iletim verimi
      const eta_motor = input.motorEff; // % elektrik motoru verimi
      const z = input.stages; // kademe sayısı
      const annual_hours = input.annualHours;
      const elec_rate = input.elecRate; // USD/kWh

      // 1. T1 absolute (Kelvin)
      const T1_abs = T1 + 273.15;

      // 2. P1 absolute (Bar) - atmosferik basınç 1.01325 Bar
      const P1_abs = 1.01325;

      // 3. P2 absolute (Bar)
      const P2_abs = P1_abs + P_g;

      // 4. Kademe başına basınç oranı
      const r_stage = Math.pow(P2_abs / P1_abs, 1 / z);

      // 5. İzentropik güç (kW)
      // W_is = (z * n / (n - 1)) * (P1_abs * 100) * (V_fad / 60) * (r_stage^((n-1)/n) - 1)
      const exponent = (n - 1) / n;
      const W_isentropic = (z * n / (n - 1)) * (P1_abs * 100) * (V_fad / 60) * (Math.pow(r_stage, exponent) - 1);

      // 6. Mil gücü (kW) - iç verim ile düzeltme
      const W_shaft = W_isentropic / (eta_is / 100);

      // 7. Motor milinden çekilen elektrik gücü (kW)
      const P_motor_kW = W_shaft / ((eta_mech / 100) * (eta_motor / 100));

      // 8. Spesifik güç (kW / (m3/dk))
      const specificPower = P_motor_kW / V_fad;

      // 9. Teorik deşarj sıcaklığı (°C) - her kademe sonrası tekrar °C'ye çevrilir
      const T2_theoretical = T1_abs * Math.pow(r_stage, exponent) - 273.15;

      // 10. Yıllık enerji (kWh)
      const annualEnergy = P_motor_kW * annual_hours;

      // 11. Yıllık maliyet (USD)
      const annualCost = annualEnergy * elec_rate;

      return {
        t1Abs: Math.round(T1_abs * 100) / 100,
        p1Abs: Math.round(P1_abs * 100) / 100,
        p2Abs: Math.round(P2_abs * 100) / 100,
        rStage: Math.round(r_stage * 10000) / 10000,
        wIsentropic: Math.round(W_isentropic * 100) / 100,
        wShaft: Math.round(W_shaft * 100) / 100,
        pMotorKW: Math.round(P_motor_kW * 100) / 100,
        specificPower: Math.round(specificPower * 100) / 100,
        t2Theoretical: Math.round(T2_theoretical * 100) / 100,
        annualEnergy: Math.round(annualEnergy * 100) / 100,
        annualCost: Math.round(annualCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};