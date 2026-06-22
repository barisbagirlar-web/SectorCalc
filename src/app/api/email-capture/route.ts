import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, planId, source } = await req.json() as { email: string; planId: string; source: string }
    if (!email?.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    const db = getAdminFirestore();
    if (!db) {
      console.warn('[email-capture] Firestore admin not initialized, skipping DB write.');
    } else {
      await db.collection('leads').doc(email).set({
        email,
        planId: planId ?? null,
        source: source ?? 'unknown',
        capturedAt: new Date()
      }, { merge: true });
    }

    console.log(`[email-capture] ${email} | plan: ${planId} | source: ${source}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
