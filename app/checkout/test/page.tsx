import Image from "next/image";
import Link from "next/link";
import { CreditCard, LockKeyhole } from "lucide-react";
import { CartItem } from "@/lib/cart";
import { getProduct } from "@/lib/db";
import { formatEuro } from "@/lib/money";

export default async function TestCheckoutPage({ searchParams }: { searchParams: Promise<{ items?: string }> }) {
  const { items = "" } = await searchParams;
  let cart: CartItem[] = [];
  try {
    cart = JSON.parse(Buffer.from(items, "base64url").toString("utf8"));
  } catch {
    cart = [];
  }
  const lines = cart
    .map((item) => ({ item, product: getProduct(item.id) }))
    .filter((line) => line.product);
  const total = lines.reduce((sum, line) => sum + line.product!.price * line.item.quantity, 0);

  return (
    <main className="checkout-page">
      <div className="checkout-box">
        <form className="checkout-form" action="/api/test-pay" method="post">
          <Link href="/" className="brand"><span className="brand-mark">F</span><span>FormaNest</span></Link>
          <h1>Pay FormaNest</h1>
          <p className="muted">Secure test checkout. Use any future date and any CVC.</p>
          <input type="hidden" name="items" value={items} />
          <div className="field"><label>Email</label><input required name="email" type="email" placeholder="customer@example.com" /></div>
          <div className="field"><label>Card information</label><input required name="card" defaultValue="4242 4242 4242 4242" /></div>
          <div className="field"><label>Name on card</label><input required name="name" placeholder="Full name" /></div>
          <button className="btn full"><LockKeyhole size={17} /> Pay {formatEuro(total)}</button>
        </form>
        <aside className="checkout-aside">
          <h2>Order</h2>
          {lines.map(({ item, product }) => (
            <div className="row" key={product!.id}>
              <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Image src={product!.image} alt={product!.name} width={52} height={44} style={{ objectFit: "cover", borderRadius: 6 }} />
                {product!.name} x {item.quantity}
              </span>
              <strong>{formatEuro(product!.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="row"><span>Total</span><strong>{formatEuro(total)}</strong></div>
          <p className="muted"><CreditCard size={15} /> This page is your site’s Stripe-style test checkout. Real Stripe Checkout activates automatically when keys are set.</p>
        </aside>
      </div>
    </main>
  );
}
