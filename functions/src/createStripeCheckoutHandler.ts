import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import { USERS_COLLECTION } from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripeProPriceId = defineString("STRIPE_PRO_PRICE_ID", { default: "" });

if (!admin.apps.length) {
  admin.initializeApp();
}

function sendJson(
  res: Response,
  status: number,
  body: Record<string, unknown>
): void {
  res.status(status).json(body);
}

interface CheckoutRequestBody {
  plan?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function handleCreateStripeCheckout(
  req: Request,
  res: Response
): Promise<void> {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method not allowed." });
    return;
  }

  const authResult = await authorizeSignedInUser(req);
  if (!authResult.ok) {
    sendJson(res, authResult.status, { success: false, error: authResult.error });
    return;
  }

  const body = req.body as CheckoutRequestBody;
  if (body.plan !== "pro") {
    sendJson(res, 400, { success: false, error: "Unsupported plan." });
    return;
  }

  const successUrl =
    typeof body.successUrl === "string" && body.successUrl.startsWith("http")
      ? body.successUrl
      : "https://sectorcalc-bf412.web.app/pricing?checkout=success";
  const cancelUrl =
    typeof body.cancelUrl === "string" && body.cancelUrl.startsWith("http")
      ? body.cancelUrl
      : "https://sectorcalc-bf412.web.app/pricing?checkout=cancel";

  const secretKey = stripeSecretKey.value().trim();
  const priceId = stripeProPriceId.value().trim();
  if (!secretKey || !priceId) {
    sendJson(res, 503, {
      success: false,
      error: "Checkout is not configured yet.",
    });
    return;
  }

  const stripe = new Stripe(secretKey);
  const db = admin.firestore();
  const userRef = db.collection(USERS_COLLECTION).doc(authResult.uid);
  const userSnap = await userRef.get();
  const existingCustomerId =
    typeof userSnap.data()?.subscription?.stripeCustomerId === "string"
      ? userSnap.data()?.subscription?.stripeCustomerId
      : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: authResult.uid,
      customer: existingCustomerId,
      customer_email: existingCustomerId ? undefined : authResult.email ?? undefined,
      metadata: {
        firebaseUID: authResult.uid,
        plan: "pro",
      },
      subscription_data: {
        metadata: {
          firebaseUID: authResult.uid,
          plan: "pro",
        },
      },
    });

    if (!session.url) {
      sendJson(res, 500, { success: false, error: "Checkout session missing URL." });
      return;
    }

    sendJson(res, 200, { success: true, url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";
    sendJson(res, 500, { success: false, error: message });
  }
}
