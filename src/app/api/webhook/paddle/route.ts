import { NextResponse } from 'next/server';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { getAdminFirestore } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

const db = getAdminFirestore();

// Not: Ortam değişkenini NEXT_PUBLIC_PADDLE_ENV olarak koda yansıtıyorum. (Önceki .env dosyalarınızda böyle geçiyor)
const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' ? Environment.sandbox : Environment.production,
});

// Barkod - Kredi Miktarı Haritası (Kendi barkodlarına göre kontrol et)
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
    const eventData = paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET!, signature);

    if (eventData?.eventType === 'transaction.completed') {
      const transactionData = eventData.data as any;
      const userId = transactionData.customData?.userId;
      const priceId = transactionData.items[0]?.price?.id;
      
      const creditsToAdd = creditMap[priceId] || 0;

      if (userId && creditsToAdd > 0) {
        // Firestore'da kullanıcının kredisini artır
        await db.collection('users').doc(userId).update({
          creditBalance: admin.firestore.FieldValue.increment(creditsToAdd),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Bakiye Eklendi! User: ${userId} | Kredi: +${creditsToAdd}`);
      }
    }

    return NextResponse.json({ status: 'Başarılı' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Hatası:', error);
    return NextResponse.json({ error: 'İşlem Başarısız' }, { status: 400 });
  }
}
