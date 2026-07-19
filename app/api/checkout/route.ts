import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct, trackEvent } from "@/lib/db";
import { CartItem } from "@/lib/cart";

export async function POST(request: Request) {
  const { items } = await request.json() as { items: CartItem[] };
  const valid = items
    .map((item) => ({ item, product: getProduct(item.id) }))
    .filter((line) => line.product && line.item.quantity > 0);

  if (!valid.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const amount = valid.reduce((sum, line) => sum + line.product!.price * line.item.quantity, 0);
  trackEvent("checkout", undefined, amount);

  if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      line_items: valid.map((line) => ({
        quantity: line.item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: line.product!.price * 100,
          product_data: {
            name: line.product!.name,
            images: [line.product!.image]
          }
        }
      }))
    });
    return NextResponse.json({ url: session.url });
  }

  const payload = encodeURIComponent(Buffer.from(JSON.stringify(items)).toString("base64url"));
  return NextResponse.json({ url: `${origin}/checkout/test?items=${payload}` });
}
