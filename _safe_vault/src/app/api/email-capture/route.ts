import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, planId, source } = await req.json() as { email: string; planId: string; source: string }
    if (!email?.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    // await db.leads.upsert({ email, planId, source, capturedAt: new Date() })
    console.log(`[email-capture] ${email} | plan: ${planId} | source: ${source}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
