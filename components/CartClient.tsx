"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { formatEuro } from "@/lib/money";
import { CartItem } from "@/lib/cart";

type CartProduct = Pick<Product, "id" | "name" | "category" | "image" | "price">;

export function CartClient({ products }: { products: CartProduct[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("formanest-cart");
    setCart(saved ? JSON.parse(saved) : []);
  }, []);

  function save(next: CartItem[]) {
    setCart(next);
    localStorage.setItem("formanest-cart", JSON.stringify(next));
  }

  const lines = cart
    .map((item) => ({ item, product: products.find((product) => product.id === item.id) }))
    .filter((line): line is { item: CartItem; product: Product } => Boolean(line.product));

  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.product.price * line.item.quantity, 0), [lines]);
  async function checkout() {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart })
    });
    const data = await response.json();
    window.location.href = data.url;
  }

  return (
    <div className="split">
      <div className="cart-list">
        {lines.length === 0 ? (
          <div className="table-card">
            <h2>Your cart is empty</h2>
            <p className="muted">Add furniture from the shop and return here to checkout.</p>
          </div>
        ) : lines.map(({ item, product }) => (
          <div className="cart-line" key={product.id}>
            <Image src={product.image} alt={product.name} width={160} height={120} />
            <div>
              <strong>{product.name}</strong>
              <p className="muted">{product.category} · {formatEuro(product.price)}</p>
            </div>
            <div>
              <select
                value={item.quantity}
                onChange={(event) => save(cart.map((line) => line.id === product.id ? { ...line, quantity: Number(event.target.value) } : line))}
              >
                {[1, 2, 3, 4, 5].map((quantity) => <option key={quantity}>{quantity}</option>)}
              </select>
              <button className="btn ghost" onClick={() => save(cart.filter((line) => line.id !== product.id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <aside className="summary">
        <h2>Order summary</h2>
        <div className="row"><span>Subtotal</span><strong>{formatEuro(subtotal)}</strong></div>
        <div className="row"><span>Estimated shipping</span><strong>Free</strong></div>
        <button className="btn full" disabled={!lines.length} onClick={checkout}>Checkout</button>
        <p className="muted">Real Stripe Checkout is used when Stripe keys are configured. Otherwise, this opens the private test checkout page.</p>
      </aside>
    </div>
  );
}
