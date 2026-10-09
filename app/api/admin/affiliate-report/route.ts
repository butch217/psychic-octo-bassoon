import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession, COOKIE_NAME } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [outboundClicks, verifiedOrders, commissionGroups] = await Promise.all([
      prisma.affiliateEvent.count({ where: { type: "OUTBOUND_CLICK" } }),
      prisma.affiliateEvent.count({ where: { type: "VERIFIED_ORDER", verified: true } }),
      prisma.affiliateEvent.groupBy({
        by: ["currency"],
        where: { verified: true, type: { in: ["VERIFIED_ORDER", "COMMISSION_ADJUSTMENT"] }, commissionMinor: { not: null }, currency: { not: null } },
        _sum: { commissionMinor: true },
      }),
    ]);
    const commissions = commissionGroups
      .filter((item): item is typeof item & { currency: string } => typeof item.currency === "string")
      .map(item => ({ currency: item.currency, amountMinor: item._sum.commissionMinor ?? 0 }));
    return NextResponse.json({ outboundClicks, verifiedOrders, commissions });
  } catch {
    return NextResponse.json({ error: "Reporting database unavailable." }, { status: 503 });
  }
}
