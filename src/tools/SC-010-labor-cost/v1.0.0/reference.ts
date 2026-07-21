/**
 * SC-010 reference data. Rates are Decimal-safe strings (deterministic).
 * Values are REFERENCE ESTIMATES for v1.0.0 — verify with local law.
 */
export interface CountryRates {
  currency: string;
  employeeRate: string;
  employerSSRate: string;
  employerUnempRate: string;
  severanceRate: string;
  note: string;
}

export const WEEKS_PER_MONTH = '4.33'; // 52/12, deterministic constant

export const COUNTRIES: Record<string, CountryRates> = {
  US: { currency: 'USD', employeeRate: '0.23', employerSSRate: '0.0765', employerUnempRate: '0.06', severanceRate: '0', note: 'FICA 6.2%+1.45% employer; FUTA ~6% on first 7k (approx). No statutory severance.' },
  TR: { currency: 'TRY', employeeRate: '0.15', employerSSRate: '0.205', employerUnempRate: '0', severanceRate: '0.0833', note: 'SGK employer ~20.5% combined. Severance: 1 month gross per year = 8.33%/month.' },
  DE: { currency: 'EUR', employeeRate: '0.20', employerSSRate: '0.1995', employerUnempRate: '0.013', severanceRate: '0', note: 'Employer ~19.95% social security + 1.3% unemployment.' },
  GB: { currency: 'GBP', employeeRate: '0.20', employerSSRate: '0.138', employerUnempRate: '0', severanceRate: '0', note: 'Employer NIC 13.8% above threshold.' },
  IN: { currency: 'INR', employeeRate: '0.12', employerSSRate: '0.12', employerUnempRate: '0.0075', severanceRate: '0', note: 'EPF 12% employer; ESI 0.75%. Gratuity after 5 years not accrued here.' },
  FR: { currency: 'EUR', employeeRate: '0.22', employerSSRate: '0.42', employerUnempRate: '0.0405', severanceRate: '0', note: 'France ~42% employer contributions, highest in EU.' }
};
