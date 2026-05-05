import { NextResponse } from "next/server";
import { DEMO_LISTINGS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ listings: DEMO_LISTINGS, count: DEMO_LISTINGS.length });
}

export async function POST(req: Request) {
  const body = await req.json();
  // In production: save to DB here (e.g. Supabase)
  const newListing = { ...body, id: `l${Date.now()}`, postedAt: new Date(), status:"pending" };
  return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
}
