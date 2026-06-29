import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? ''

function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    const parts = Object.fromEntries(signatureHeader.split(';').map((p) => p.split('=')))
    const ts = parts['ts']
    const h1 = parts['h1']
    if (!ts || !h1) return false
    const signed = `${ts}:${rawBody}`
    const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(h1, 'hex'))
  } catch { return false }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signatureHeader = req.headers.get('paddle-signature') ?? ''

  if (!verifyPaddleSignature(rawBody, signatureHeader, PADDLE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: Record<string, any>
  try { event = JSON.parse(rawBody) }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (event.event_type === 'transaction.completed') {
    const txn = event.data
    const email: string = txn?.customer?.email ?? txn?.billing_details?.email ?? ''
    const customData = txn?.custom_data as Record<string, string> | undefined
    const credits = Number(customData?.credits ?? 0)
    const planId = customData?.planId ?? ''

    // ── Add your own DB call here ──
    // await db.credits.upsert({ email, increment: credits, expiresAt: ... })

    // ── Send email ──
    // await resend.emails.send({ to: email, subject: `Your ${credits} credits are ready`, ... })

    console.log(`[webhook] ✅ ${credits} credits → ${email} (plan: ${planId})`)
  }

  return NextResponse.json({ received: true })
}
