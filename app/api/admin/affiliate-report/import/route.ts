import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession, COOKIE_NAME } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportRow = { partnerReference: string; productSlug?: string | null; commissionMinor: number; currency: string; occurredAt?: string };

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { events?: unknown; sourceLabel?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 1000) {
    return NextResponse.json({ error: "events must contain between 1 and 1000 verified report rows." }, { status: 400 });
  }
  const rows = body.events as ImportRow[];
  for (const row of rows) {
    if (!row || typeof row.partnerReference !== "string" || row.partnerReference.trim().length < 1 || row.partnerReference.length > 191 ||
      !Number.isSafeInteger(row.commissionMinor) || row.commissionMinor < 0 || row.commissionMinor > 2_000_000_000 ||
      typeof row.currency !== "string" || !/^[A-Z]{3}$/.test(row.currency) ||
      (row.occurredAt !== undefined && (!Number.isFinite(Date.parse(row.occurredAt))))) {
      return NextResponse.json({ error: "Each row needs a partner reference, integer minor-unit commission, ISO currency code, and optional valid timestamp." }, { status: 400 });
    }
  }

  try {
    const slugs = [...new Set(rows.map(row => row.productSlug).filter((slug): slug is string => typeof slug === "string" && slug.length > 0))];
    const products = slugs.length ? await prisma.product.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } }) : [];
    const productIds = new Map(products.map(product => [product.slug, product.id]));
    if (rows.some(row => row.productSlug && !productIds.has(row.productSlug))) {
      return NextResponse.json({ error: "One or more product slugs do not exist in the catalogue." }, { status: 400 });
    }

    const result = await prisma.affiliateEvent.createMany({
      data: rows.map(row => ({
        type: "VERIFIED_ORDER" as const,
        verified: true,
        partnerReference: row.partnerReference.trim(),
        commissionMinor: row.commissionMinor,
        currency: row.currency,
        productId: row.productSlug ? productIds.get(row.productSlug) ?? null : null,
        source: "carry1st-official-report",
        occurredAt: row.occurredAt ? new Date(row.occurredAt) : new Date(),
      })),
      skipDuplicates: true,
    });
    return NextResponse.json({ imported: result.count, skippedAsDuplicates: rows.length - result.count });
  } catch {
    return NextResponse.json({ error: "Import failed. Confirm the data came from an official partner report and check database configuration." }, { status: 503 });
  }
}
