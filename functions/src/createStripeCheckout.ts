import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import {
  CHECKOUT_PLAN_PRO,
  CHECKOUT_PLAN_SINGLE_REPORT,
  USERS_COLLECTION,
} from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripePriceMonthly = defineString("STRIPE_PRICE_MONTHLY", { default: "" });
const stripePriceSingleVerdict = defineString("STRIPE_PRICE_SINGLE_VERDICT", {
  default: "",
});
const publicSiteUrl = defineString("PUBLIC_SITE_URL", {
  default: "https://sectorcalc-bf412.web.app",
});

const DEFAULT_PREMIUM_TOOL_SLUG = "cnc-quote-risk-analyzer";

type CheckoutPlan = typeof CHECKOUT_PLAN_PRO | typeof CHECKOUT_PLAN_SINGLE_REPORT;

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
  plan?: CheckoutPlan;
}

function resolveExplicitToolSlug(body: CheckoutRequestBody): string | undefined {
  if (typeof body.toolSlug === "string" && body.toolSlug.trim().length > 0) {
    return body.toolSlug.trim();
  }
  return undefined;
}

function resolveToolSlugForMetadata(body: CheckoutRequestBody): string {
  return resolveExplicitToolSlug(body) ?? DEFAULT_PREMIUM_TOOL_SLUG;
}

function resolveCheckoutPlan(body: CheckoutRequestBody): CheckoutPlan {
  if (body.plan === CHECKOUT_PLAN_SINGLE_REPORT) {
    return CHECKOUT_PLAN_SINGLE_REPORT;
  }
  return CHECKOUT_PLAN_PRO;
}

async function createProSubscriptionSession(
  stripe: Stripe,
  authResult: { uid: string; email: string },
  body: CheckoutRequestBody
): Promise<Stripe.Checkout.Session> {
  const explicitToolSlug = resolveExplicitToolSlug(body);
  const toolSlug = resolveToolSlugForMetadata(body);
  const locale =
    typeof body.locale === "string" && body.locale.trim().length > 0
      ? body.locale.trim()
      : undefined;

  const priceId = stripePriceMonthly.value().trim();
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");

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
    plan: CHECKOUT_PLAN_PRO,
  };
  if (locale) {
    metadata.locale = locale;
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: explicitToolSlug
      ? `${siteUrl}/tools/premium/${encodeURIComponent(explicitToolSlug)}?subscribed=true`
      : `${siteUrl}/account?subscribed=true`,
    cancel_url: `${siteUrl}/pricing?canceled=true`,
    client_reference_id: authResult.uid,
    customer: existingCustomerId,
    customer_email: existingCustomerId ? undefined : authResult.email,
    metadata,
    subscription_data: {
      metadata,
    },
  });
}

async function createSingleReportPaymentSession(
  stripe: Stripe,
  authResult: { uid: string; email: string },
  body: CheckoutRequestBody
): Promise<Stripe.Checkout.Session> {
  const toolSlug = resolveToolSlugForMetadata(body);
  const priceId = stripePriceSingleVerdict.value().trim();
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");

  const db = admin.firestore();
  const userRef = db.collection(USERS_COLLECTION).doc(authResult.uid);
  const userSnap = await userRef.get();
  const existingCustomerId =
    typeof userSnap.data()?.subscription?.stripeCustomerId === "string"
      ? userSnap.data()?.subscription?.stripeCustomerId
      : undefined;

  const metadata: Record<string, string> = {
    uid: authResult.uid,
    plan: CHECKOUT_PLAN_SINGLE_REPORT,
    toolSlug,
  };

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/account/reports?session_id={CHECKOUT_SESSION_ID}&purchased=single_report&tool=${encodeURIComponent(toolSlug)}`,
    cancel_url: `${siteUrl}/pricing?canceled=true`,
    client_reference_id: authResult.uid,
    customer: existingCustomerId,
    customer_email: existingCustomerId ? undefined : authResult.email,
    metadata,
  });
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
  const plan = resolveCheckoutPlan(body);
  const secretKey = stripeSecretKey.value().trim();

  if (!secretKey) {
    sendJson(res, 503, {
      success: false,
      error: "Checkout is not configured yet.",
    });
    return;
  }

  const stripe = new Stripe(secretKey);

  try {
    if (plan === CHECKOUT_PLAN_SINGLE_REPORT) {
      const singlePriceId = stripePriceSingleVerdict.value().trim();
      if (!singlePriceId) {
        sendJson(res, 503, {
          success: false,
          error: "Single Verdict checkout is not configured yet.",
        });
        return;
      }

      const session = await createSingleReportPaymentSession(stripe, {
        uid: authResult.uid,
        email: authResult.email,
      }, body);

      if (!session.url) {
        sendJson(res, 500, {
          success: false,
          error: "Checkout session missing URL.",
        });
        return;
      }

      sendJson(res, 200, { success: true, checkoutUrl: session.url });
      return;
    }

    const monthlyPriceId = stripePriceMonthly.value().trim();
    if (!monthlyPriceId) {
      sendJson(res, 503, {
        success: false,
        error: "Checkout is not configured yet.",
      });
      return;
    }

    const session = await createProSubscriptionSession(stripe, {
      uid: authResult.uid,
      email: authResult.email,
    }, body);

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
