import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { getAnalytics } from "@/lib/db";
import { formatEuro } from "@/lib/money";
import { getSaleRecommendations } from "@/lib/sale-engine";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (password === (process.env.ADMIN_SECRET || "formanest-2026")) {
    const jar = await cookies();
    jar.set("formanest-admin", "ok", { httpOnly: true, sameSite: "lax", path: "/fn-admin-portal" });
    redirect("/fn-admin-portal");
  }
  redirect("/fn-admin-portal?error=1");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saleDate?: string }> }) {
  const jar = await cookies();
  const allowed = jar.get("formanest-admin")?.value === "ok";
  if (!allowed) {
    return (
      <main className="shell">
        <Nav />
        <section className="wrap admin-login">
          <form action={login} className="summary" style={{ maxWidth: 430, margin: "0 auto", position: "static" }}>
            <span className="eyebrow">Private</span>
            <h1>Admin access</h1>
            <p className="muted">Hidden dashboard for product performance, margins, and customer activity.</p>
            <div className="field"><label>Password</label><input name="password" type="password" required /></div>
            <button className="btn full">Enter dashboard</button>
          </form>
        </section>
      </main>
    );
  }

  const params = await searchParams;
  const analytics = getAnalytics();
  const saleDate = params.saleDate ? new Date(`${params.saleDate}T00:00:00.000Z`) : new Date();
  const saleRecommendations = getSaleRecommendations(analytics.products, saleDate).slice(0, 6);
  return (
    <main className="shell">
      <Nav />
      <section className="wrap admin">
        <div className="section-head">
          <div><span className="eyebrow">Secret admin</span><h1>FormaNest dashboard</h1></div>
          <p>Product cards, visits, likes, buys, revenue, margins, and recommendation logic.</p>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><span className="muted">Revenue</span><strong>{formatEuro(analytics.totals.revenue)}</strong></div>
          <div className="stat-card"><span className="muted">Profit</span><strong>{formatEuro(analytics.totals.profit)}</strong></div>
          <div className="stat-card"><span className="muted">Visits</span><strong>{analytics.totals.visits}</strong></div>
          <div className="stat-card"><span className="muted">Bought</span><strong>{analytics.totals.bought}</strong></div>
        </div>
        <div className="table-card" style={{ marginTop: 18 }}>
          <h2>Infinite sale machine</h2>
          <p className="muted">
            Today&apos;s sale picks are generated from date seasonality, visits, likes, purchases, stock pressure, trend score, and the private minimum profit rule.
          </p>
          <form action="/fn-admin-portal" style={{ display: "flex", gap: 10, alignItems: "end", margin: "16px 0", flexWrap: "wrap" }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Sale date</label>
              <input type="date" name="saleDate" defaultValue={params.saleDate || saleDate.toISOString().slice(0, 10)} />
            </div>
            <button className="btn secondary">Calculate sale plan</button>
          </form>
          <table>
            <thead><tr><th>Rank</th><th>Product</th><th>Season</th><th>Score</th><th>Sale price</th><th>Discount</th><th>Projected profit</th><th>Why</th></tr></thead>
            <tbody>
              {saleRecommendations.map((item, index) => (
                <tr key={item.product.id}>
                  <td>{index + 1}</td>
                  <td>{item.product.name}</td>
                  <td>{item.season}</td>
                  <td>{item.score}</td>
                  <td>{formatEuro(item.salePrice)}</td>
                  <td>{formatEuro(item.suggestedDiscount)}</td>
                  <td>{formatEuro(item.projectedProfit)}</td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-card" style={{ marginTop: 18 }}>
          <h2>All products</h2>
          <table>
            <thead><tr><th>Product</th><th>Price</th><th>Cost</th><th>Profit</th><th>Visits</th><th>Liked</th><th>Bought</th><th>Trend</th></tr></thead>
            <tbody>
              {analytics.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{formatEuro(product.price)}</td>
                  <td>{formatEuro(product.supplierCost)}</td>
                  <td>{formatEuro(product.price - product.supplierCost)}</td>
                  <td>{product.visits}</td>
                  <td>{product.likes}</td>
                  <td>{product.bought}</td>
                  <td>{product.trendScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
