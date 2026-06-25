import { IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125InputSchema, type IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125Input } from "./iskontolu-nakit-akisi-dcf-ile-sirket-degerleme-calculator-125-validation";

export const calculateIskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125Contract: any = {
  id: "iskontolu-nakit-akisi-dcf-ile-sirket-degerleme-calculator-125",
  version: "1.0.0",
  category: "cost",
  inputSchema: IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure inputs with proper defaults
      const ebitArray = (input.ebitArray || []).map(Number).filter((v: number) => !isNaN(v));
      const taxRate = input.taxRate !== undefined ? Number(input.taxRate) : 0;
      const daArray = (input.daArray || []).map(Number).filter((v: number) => !isNaN(v));
      const capexArray = (input.capexArray || []).map(Number).filter((v: number) => !isNaN(v));
      const nwcChangeArray = (input.nwcChangeArray || []).map(Number).filter((v: number) => !isNaN(v));
      const wacc = input.wacc !== undefined ? Number(input.wacc) : 0;
      const terminalGrowthRate = input.terminalGrowthRate !== undefined ? Number(input.terminalGrowthRate) : 0;
      const netDebt = input.netDebt !== undefined ? Number(input.netDebt) : 0;
      const dilutedShares = input.dilutedShares !== undefined ? Number(input.dilutedShares) : 0;

      const nPeriods = ebitArray.length;
      
      // Calculate NOPAT, FCFF, and PV for each period
      const nOPATTArray: number[] = [];
      const fCFFTArray: number[] = [];
      const pVFCFFArray: number[] = [];
      
      let pVFCFF = 0;
      
      for (let t = 0; t < nPeriods; t++) {
        const ebit = ebitArray[t] || 0;
        const da = daArray[t] || 0;
        const capex = capexArray[t] || 0;
        const nwcChange = nwcChangeArray[t] || 0;
        
        // NOPAT_t = EBIT_t * (1 - tax_rate)
        const nOPATT = ebit * (1 - (taxRate / 100));
        nOPATTArray.push(nOPATT);
        
        // FCFF_t = NOPAT_t + D&A_t - CapEx_t - ΔNWC_t
        const fCFFT = nOPATT + da - capex - nwcChange;
        fCFFTArray.push(fCFFT);
        
        // PV of FCFF_t = FCFF_t / (1 + WACC)^(t+1)
        const discountFactor = Math.pow(1 + (wacc / 100), t + 1);
        const pvFCFFT = discountFactor !== 0 ? fCFFT / discountFactor : 0;
        pVFCFFArray.push(pvFCFFT);
        
        pVFCFF += pvFCFFT;
      }
      
      // Get the last FCFF for terminal value calculation
      const lastFCFF = fCFFTArray.length > 0 ? fCFFTArray[fCFFTArray.length - 1] : 0;
      
      // Terminal Value = FCFF_n * (1 + g) / (WACC - g)
      const waccDecimal = wacc / 100;
      const growthDecimal = terminalGrowthRate / 100;
      const terminalDenominator = waccDecimal - growthDecimal;
      const terminalValue = terminalDenominator !== 0 
        ? (lastFCFF * (1 + growthDecimal)) / terminalDenominator 
        : 0;
      
      // PV of Terminal Value = Terminal Value / (1 + WACC)^n
      const terminalDiscountFactor = Math.pow(1 + (wacc / 100), nPeriods);
      const pVTerminalValue = terminalDiscountFactor !== 0 
        ? terminalValue / terminalDiscountFactor 
        : 0;
      
      // Enterprise Value = PV of FCFF + PV of Terminal Value
      const enterpriseValueEV = pVFCFF + pVTerminalValue;
      
      // Equity Value = Enterprise Value - Net Debt
      const equityValue = enterpriseValueEV - netDebt;
      
      // Implied Share Price = Equity Value / Diluted Shares
      const impliedSharePrice = dilutedShares !== 0 
        ? equityValue / dilutedShares 
        : 0;

      return {
        nPeriods: Math.round(nPeriods),
        nOPATT: nOPATTArray.length > 0 ? nOPATTArray[nOPATTArray.length - 1] : 0,
        fCFFT: fCFFTArray.length > 0 ? fCFFTArray[fCFFTArray.length - 1] : 0,
        pVFCFF: Number(pVFCFF.toFixed(2)),
        terminalValue: Number(terminalValue.toFixed(2)),
        pVTerminalValue: Number(pVTerminalValue.toFixed(2)),
        enterpriseValueEV: Number(enterpriseValueEV.toFixed(2)),
        equityValue: Number(equityValue.toFixed(2)),
        impliedSharePrice: Number(impliedSharePrice.toFixed(2))
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};