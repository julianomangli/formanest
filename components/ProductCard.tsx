import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatEuro } from "@/lib/money";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.id}`} className="product-image">
        <Image src={product.image} alt={product.name} width={700} height={520} />
      </Link>
      <div className="product-body">
        <span className="eyebrow">{product.category}</span>
        <h3 className="product-title">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="muted">{product.description}</p>
        <div className="price-row">
          <span className="price">{formatEuro(product.price)}</span>
          <span className="pill">{product.stock} in stock</span>
        </div>
        <div className="card-actions">
          <Link className="btn" href={`/product/${product.id}`}>
            <ShoppingBag size={17} /> View
          </Link>
          <form action={`/api/like/${product.id}`} method="post">
            <button className="btn secondary" title="Like product" aria-label="Like product">
              <Heart size={18} />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
