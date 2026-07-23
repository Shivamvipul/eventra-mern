import { loadStripe } from '@stripe/stripe-js';

// Loaded once and reused everywhere a Stripe Elements provider is needed.
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
