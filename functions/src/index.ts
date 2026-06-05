import { onRequest } from "firebase-functions/v2/https";
import { handleUpdateLeadPipeline } from "./updateLeadPipelineHandler";
import { handleUpdateLeadTestClassification } from "./updateLeadTestClassificationHandler";
import { handleCreateStripeCheckout } from "./createStripeCheckoutHandler";
import { handleStripeWebhook } from "./stripeWebhookHandler";

export const updateLeadPipeline = onRequest(
  {
    region: "us-central1",
    secrets: ["ADMIN_LEAD_UPDATE_SECRET"],
    invoker: "public",
  },
  (req, res) => {
    void handleUpdateLeadPipeline(req, res);
  }
);

export const updateLeadTestClassification = onRequest(
  {
    region: "us-central1",
    invoker: "public",
  },
  (req, res) => {
    void handleUpdateLeadTestClassification(req, res);
  }
);

export const createStripeCheckout = onRequest(
  {
    region: "us-central1",
    invoker: "public",
  },
  (req, res) => {
    void handleCreateStripeCheckout(req, res);
  }
);

export const stripeWebhook = onRequest(
  {
    region: "us-central1",
    invoker: "public",
  },
  (req, res) => {
    void handleStripeWebhook(req, res);
  }
);
