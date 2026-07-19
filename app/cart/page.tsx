import { CartClient } from "@/components/CartClient";
import { Nav } from "@/components/Nav";
import { getProducts } from "@/lib/db";

export default function CartPage() {
  return (
    <main className="shell">
      <Nav />
      <section className="wrap section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Checkout</span>
            <h1>Your cart</h1>
          </div>
          <p>Review your furniture order before opening the payment page.</p>
        </div>
        <CartClient products={getProducts()} />
      </section>
    </main>
  );
}
