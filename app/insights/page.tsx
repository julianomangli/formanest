import { Nav } from "@/components/Nav";
import { getAnalytics } from "@/lib/db";
import { formatEuro } from "@/lib/money";

export default function InsightsPage() {
  const analytics = getAnalytics();
  return (
    <main className="shell">
      <Nav />
      <section className="wrap section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Real-world trend engine</span>
            <h1>Pricing and recommendations</h1>
          </div>
          <p>The site ranks products with customer activity, demand signals, trend score, stock, and gross margin.</p>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><span className="muted">Tracked visits</span><strong>{analytics.totals.visits}</strong></div>
          <div className="stat-card"><span className="muted">Likes</span><strong>{analytics.totals.likes}</strong></div>
          <div className="stat-card"><span className="muted">Units bought</span><strong>{analytics.totals.bought}</strong></div>
          <div className="stat-card"><span className="muted">Modeled profit</span><strong>{formatEuro(analytics.totals.profit)}</strong></div>
        </div>
        <div className="table-card" style={{ marginTop: 18 }}>
          <h2>Recommendation priority</h2>
          <table>
            <thead><tr><th>Product</th><th>Trend</th><th>Visits</th><th>Likes</th><th>Bought</th><th>Margin</th></tr></thead>
            <tbody>
              {analytics.trending.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.trendScore}</td>
                  <td>{product.visits}</td>
                  <td>{product.likes}</td>
                  <td>{product.bought}</td>
                  <td>{formatEuro(product.price - product.supplierCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
