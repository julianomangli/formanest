import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { ProductCard } from "@/components/ProductCard";
import { getAnalytics, getRecommendedProducts } from "@/lib/db";

export default function Home() {
  const analytics = getAnalytics();
  const featured = getRecommendedProducts();
  return (
    <main className="shell">
      <Nav />
      <section className="wrap hero">
        <div>
          <span className="eyebrow">FormaNest Furniture</span>
          <h1>Modern rooms, calmly priced.</h1>
          <p>
            A furniture store built around customer taste, live product signals, and pieces that make
            homes feel finished without making the buying process feel heavy.
          </p>
          <Link className="btn" href="/shop">Shop the collection <ArrowRight size={17} /></Link>
          <div className="hero-strip">
            <div className="metric"><strong>{analytics.totals.visits}</strong><span>product visits tracked</span></div>
            <div className="metric"><strong>{analytics.totals.likes}</strong><span>customer likes</span></div>
            <div className="metric"><strong>{analytics.trending.length}</strong><span>smart recommendations</span></div>
          </div>
        </div>
        <div className="hero-media">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=85"
            alt="Minimal modern living room with refined furniture"
            fill
            priority
          />
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Recommended now</span>
              <h2>Trending pieces</h2>
            </div>
            <p>Recommendations combine customer visits, likes, purchases, trend score, and product availability.</p>
          </div>
          <div className="grid">
            {featured.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>
      <footer className="footer"><div className="wrap">FormaNest · Modern furniture with a quieter, smarter shopping experience.</div></footer>
    </main>
  );
}
