import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  trackEvent("like", id);
  return NextResponse.redirect(new URL(`/product/${id}`, request.url), 303);
}
