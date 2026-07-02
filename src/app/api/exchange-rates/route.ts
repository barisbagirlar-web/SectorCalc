import { NextResponse } from 'next/server';

export const revalidate = 86400; // ECB updates once daily (16:00 CET)

export async function GET() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      next: { revalidate },
      headers: {
        'User-Agent': 'SectorCalc/1.0',
      },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'ECB feed unavailable' }, { status: 502 });
    }
    
    const data = await res.json();
    return NextResponse.json({
      base: 'USD',
      date: data.date,
      rates: { USD: 1, ...data.rates },
    });
  } catch (err) {
    return NextResponse.json({ error: 'ECB feed unavailable' }, { status: 502 });
  }
}
