import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import { USERS_COLLECTION } from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripePriceMonthly = defineString("STRIPE_PRICE_MONTHLY", { default: "" });
const publicSiteUrl = defineString("PUBLIC_SITE_URL", {
  default: "https://sectorcalc-bf412.web.app",
});

const DEFAULT_PREMIUM_TOOL_SLUG = "cnc-quote-risk-analyzer";

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
  toolSlug?: string;
  locale?: string;
}

function resolveToolSlug(body: CheckoutRequestBody): string {
  if (typeof body.toolSlug === "string" && body.toolSlug.trim().length > 0) {
    return body.toolSlug.trim();
  }
  return DEFAULT_PREMIUM_TOOL_SLUG;
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

  if (!authResult.email) {
    sendJson(res, 400, { success: false, error: "Account email is required for checkout." });
    return;
  }

  const body = (req.body ?? {}) as CheckoutRequestBody;
  const toolSlug = resolveToolSlug(body);
  const locale =
    typeof body.locale === "string" && body.locale.trim().length > 0
      ? body.locale.trim()
      : undefined;

  const secretKey = stripeSecretKey.value().trim();
  const priceId = stripePriceMonthly.value().trim();
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");

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

  const metadata: Record<string, string> = {
    uid: authResult.uid,
    toolSlug,
  };
  if (locale) {
    metadata.locale = locale;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/tools/premium/${encodeURIComponent(toolSlug)}?subscribed=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      client_reference_id: authResult.uid,
      customer: existingCustomerId,
      customer_email: existingCustomerId ? undefined : authResult.email,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    if (!session.url) {
      sendJson(res, 500, {
        success: false,
        error: "Checkout session missing URL.",
      });
      return;
    }

    sendJson(res, 200, { success: true, checkoutUrl: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";
    sendJson(res, 500, { success: false, error: message });
  }
}
