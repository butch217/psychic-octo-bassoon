import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true, name: true, slug: true, category: true, description: true,
        imageUrl: true, partnerUrl: true, status: true,
      },
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "Catalogue is temporarily unavailable. Configure the database and apply migrations." },
      { status: 503 },
    );
  }
}
