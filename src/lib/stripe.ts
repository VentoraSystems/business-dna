import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Fail loudly in dev rather than silently disabling billing.
  console.warn("[stripe] STRIPE_SECRET_KEY is not set — billing routes will fail.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "not-set", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});
