import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch rates from Frankfurter (ECB rates)
    // Base USD for our canonical conversion
    const res = await fetch("https://api.frankfurter.app/latest?from=USD", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch exchange rates: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Frankfurter doesn't include the base currency in the rates map
    // We explicitly add USD: 1.0 to simplify client-side logic
    const rates = { ...data.rates, USD: 1.0 };

    return NextResponse.json({
      base: data.base,
      date: data.date,
      rates,
    });
  } catch (error) {
    console.error("[ExchangeRatesAPI] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
