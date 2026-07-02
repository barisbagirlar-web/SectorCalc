"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SUPPORTED_CURRENCIES, convertGlobal } from "@/lib/conversion/globalRates";

export function CustomEbitdaCalculator() {
  const [ratesData, setRatesData] = useState<{ rates: Record<string, number>, date: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [inputs, setInputs] = useState({
    netIncome: { value: 150000, unit: "USD" },
    interest: { value: 20000, unit: "USD" },
    tax: { value: 45000, unit: "USD" },
    depreciation: { value: 30000, unit: "USD" },
  });
  
  const [outputUnit, setOutputUnit] = useState("USD");
  
  useEffect(() => {
    fetch("/api/exchange-rates")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("ECB feed unavailable");
        }
        return res.json();
      })
      .then(data => {
        if (data && data.rates) {
          setRatesData({ rates: data.rates, date: data.date });
        }
      })
      .catch(err => {
        console.error("Failed to load rates", err);
        setError("Currency exchange rates are currently unavailable (502).");
      });
  }, []);

  const handleInputChange = (field: keyof typeof inputs, type: "value" | "unit", val: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: val
      }
    }));
  };

  const ebitda = useMemo(() => {
    if (!ratesData) return null;
    
    let totalUsd = 0;
    Object.values(inputs).forEach(({ value, unit }) => {
      totalUsd += convertGlobal(value, unit, "USD", ratesData.rates);
    });
    
    return convertGlobal(totalUsd, "USD", outputUnit, ratesData.rates);
  }, [inputs, ratesData, outputUnit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto" role="main" aria-label="EBITDA Calculator">
      {/* ═══ SOL PANEL: INPUTS (lg:col-span-4) ═══ */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">EBITDA Calculator</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {[
              { id: "netIncome", label: "Net Income" },
              { id: "interest", label: "Interest Expense" },
              { id: "tax", label: "Tax Expense" },
              { id: "depreciation", label: "Depreciation & Amortization" },
            ].map(field => (
              <div key={field.id} className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="flex relative">
                  <input
                    type="number"
                    value={inputs[field.id as keyof typeof inputs].value}
                    onChange={e => handleInputChange(field.id as keyof typeof inputs, "value", parseFloat(e.target.value) || 0)}
                    className="block w-full pl-3 pr-24 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                  <select
                    value={inputs[field.id as keyof typeof inputs].unit}
                    onChange={e => handleInputChange(field.id as keyof typeof inputs, "unit", e.target.value)}
                    className="absolute right-0 inset-y-0 pl-3 pr-8 py-2 border-l border-gray-300 bg-gray-50 text-gray-600 rounded-r-md focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  >
                    {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL: RESULTS (lg:col-span-8) ═══ */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Results</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Display Currency:</span>
              <select
                value={outputUnit}
                onChange={e => setOutputUnit(e.target.value)}
                className="pl-3 pr-8 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">EBITDA</div>
            <div className="text-3xl font-mono font-semibold text-gray-900 mt-2">
              {ebitda !== null ? ebitda.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (error ? "Error" : "Loading...")} <span className="text-lg text-gray-500">{outputUnit}</span>
            </div>
          </div>
          
          {ratesData && (
            <div className="text-xs text-gray-400 text-right mb-4">
              Exchange Rates Updated: {ratesData.date}
            </div>
          )}
          
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
            <strong>Formula:</strong> EBITDA = Net Income + Interest Expense + Tax Expense + Depreciation & Amortization
            <br />
            <br />
            <strong>Currency Conversion:</strong> Supported by Frankfurter (ECB rates). Live rates are used for conversion.
          </div>
        </div>
      </div>
    </div>
  );
}
