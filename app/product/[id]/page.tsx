import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import { AddToCart } from "@/components/AddToCart";
import { Nav } from "@/components/Nav";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getRecommendedProducts, trackEvent } from "@/lib/db";
import { formatEuro } from "@/lib/money";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  trackEvent("visit", product.id);
  const recommended = getRecommendedProducts(product.id);

  return (
    <main className="shell">
      <Nav />
      <section className="wrap detail">
        <div className="detail-image">
          <Image src={product.image} alt={product.name} width={1100} height={1300} priority />
        </div>
        <div className="detail-panel">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="muted">{product.details}</p>
          <div className="price-row">
            <span className="price">{formatEuro(product.price)}</span>
            <span className="pill">Profit {formatEuro(product.price - product.supplierCost)}</span>
          </div>
          <div className="specs">
            <div className="spec"><span>Materials</span><strong>{product.materials}</strong></div>
            <div className="spec"><span>Dimensions</span><strong>{product.dimensions}</strong></div>
            <div className="spec"><span>Room</span><strong>{product.room}</strong></div>
            <div className="spec"><span>Stock</span><strong>{product.stock} available</strong></div>
          </div>
          <AddToCart id={product.id} />
          <form action={`/api/like/${product.id}`} method="post" style={{ marginTop: 10 }}>
            <button className="btn secondary full"><Heart size={17} /> Like this product</button>
          </form>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Recommended with this</h2>
            <p>Based on trend score, customer interest, and margin strength.</p>
          </div>
          <div className="grid">{recommended.map((item) => <ProductCard product={item} key={item.id} />)}</div>
        </div>
      </section>
    </main>
  );
}
