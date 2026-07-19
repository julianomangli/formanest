import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function Nav() {
  return (
    <header className="topbar">
      <nav className="wrap nav">
        <Link className="brand" href="/">
          <span className="brand-mark">F</span>
          <span>FormaNest</span>
        </Link>
        <div className="links">
          <Link href="/shop">Shop</Link>
          <Link href="/insights">Trends</Link>
          <Link href="/cart" className="btn secondary">
            <ShoppingBag size={17} /> Cart
          </Link>
        </div>
      </nav>
    </header>
  );
}
