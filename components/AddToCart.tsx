"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { CartItem } from "@/lib/cart";

export function AddToCart({ id }: { id: string }) {
  const [added, setAdded] = useState(false);

  function add() {
    const current = localStorage.getItem("formanest-cart");
    let cart: CartItem[] = [];
    try {
      cart = current ? JSON.parse(current) : [];
    } catch {
      cart = [];
    }
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
    localStorage.setItem("formanest-cart", JSON.stringify(cart));
    setAdded(true);
  }

  return (
    <button className="btn full" onClick={add}>
      <ShoppingBag size={18} /> {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
