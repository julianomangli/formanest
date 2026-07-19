import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatEuro } from "@/lib/money";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string; total?: string }> }) {
  const params = await searchParams;
  return (
    <main className="checkout-page">
      <section className="table-card" style={{ width: "min(620px, 100%)", textAlign: "center" }}>
        <CheckCircle2 size={54} color="#315f4b" />
        <h1>Payment complete</h1>
        <p className="muted">Your order has been recorded and the analytics database has been updated.</p>
        {params.total ? <p><strong>{formatEuro(Number(params.total))}</strong></p> : null}
        <p className="muted">Session: {params.session_id || "Stripe checkout session"}</p>
        <Link className="btn" href="/shop">Continue shopping</Link>
      </section>
    </main>
  );
}
