import { NextResponse } from 'next/server';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { getAdminFirestore } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

const db = getAdminFirestore();

// Note: Reflecting environment variable as NEXT_PUBLIC_PADDLE_ENV in code.
const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' ? Environment.sandbox : Environment.production,
});

// Barcode - Credit Amount Map
const creditMap: Record<string, number> = {
  [process.env.NEXT_PUBLIC_PRICE_ID_TRY_IT!]: 1,
  [process.env.NEXT_PUBLIC_PRICE_ID_ESSENTIALS!]: 5,
  [process.env.NEXT_PUBLIC_PRICE_ID_POPULAR!]: 15,
  [process.env.NEXT_PUBLIC_PRICE_ID_TEAMS!]: 30,
  [process.env.NEXT_PUBLIC_PRICE_ID_BEST_VALUE!]: 100,
};

export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature') || '';
  const body = await req.text();

  try {
    const eventData = await paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET!, signature);

    if (eventData?.eventType === 'transaction.completed') {
      const transactionData = eventData.data as any;
      const userId = transactionData.customData?.userId;
      const priceId = transactionData.items[0]?.price?.id;
      
      const creditsToAdd = creditMap[priceId] || 0;

      if (db && userId && creditsToAdd > 0) {
        // Increment user credit balance in Firestore
        await db.collection('users').doc(userId).update({
          creditBalance: admin.firestore.FieldValue.increment(creditsToAdd),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Balance added! User: ${userId} | Credit: +${creditsToAdd}`);
      }
    }

    return NextResponse.json({ status: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Transaction Failed' }, { status: 400 });
  }
}
