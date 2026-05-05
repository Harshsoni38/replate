import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { listingId, ngoId, ngoName } = await req.json();
  if (!listingId || !ngoId) {
    return NextResponse.json({ error:"listingId and ngoId required" }, { status:400 });
  }
  // In production: update DB, lock the listing, notify mess
  return NextResponse.json({
    success: true,
    message: `Listing ${listingId} claimed by ${ngoName ?? ngoId}`,
    claimedAt: new Date(),
  });
}
