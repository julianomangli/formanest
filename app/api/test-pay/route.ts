import { NextResponse } from "next/server";
import { CartItem } from "@/lib/cart";
import { getProduct, trackEvent } from "@/lib/db";

export async function POST(request: Request) {
  const form = await request.formData();
  const encoded = String(form.get("items") || "");
  const items = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as CartItem[];
  let total = 0;
  for (const item of items) {
    const product = getProduct(item.id);
    if (product) {
      total += product.price * item.quantity;
      for (let i = 0; i < item.quantity; i += 1) trackEvent("purchase", product.id, product.price);
    }
  }
  const session = crypto.randomUUID();
  return NextResponse.redirect(new URL(`/checkout/success?session_id=test_${session}&total=${total}`, request.url), 303);
}
