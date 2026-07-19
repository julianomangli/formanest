import { Nav } from "@/components/Nav";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/db";

export default function ShopPage() {
  const products = getProducts();
  return (
    <main className="shell">
      <Nav />
      <section className="wrap section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Catalog</span>
            <h1>Shop furniture</h1>
          </div>
          <p>Realistic products, real images, detailed cards, and pricing that protects profit.</p>
        </div>
        <div className="grid">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>
    </main>
  );
}
