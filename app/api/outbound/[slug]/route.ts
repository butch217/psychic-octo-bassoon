import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_AFFILIATE_URL = "https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3";
const ALLOWED_SLUGS = new Set([
  "call-of-duty-mobile", "free-fire-diamonds", "pubg-mobile-uc",
  "mobile-legends-diamonds", "blood-strike-golds", "gaming-gift-cards",
]);

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { slug } = await context.params;
  if (!ALLOWED_SLUGS.has(slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Invalid product slug" }, { status: 400 });
  }

  let destination = FALLBACK_AFFILIATE_URL;
  let productId: string | null = null;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product?.status === "ACTIVE") {
      destination = product.partnerUrl;
      productId = product.id;
    } else if (product && product.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/", request.url), 303);
    }
  } catch {
    // Keep outbound shopping available even while the optional analytics database is offline.
  }

  try {
    await prisma.affiliateEvent.create({
      data: { type: "OUTBOUND_CLICK", productId, source: "sentinel-storefront", verified: false },
    });
  } catch {
    // A click log is analytics only; it must never block the partner redirect.
  }

  const response = NextResponse.redirect(destination, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
