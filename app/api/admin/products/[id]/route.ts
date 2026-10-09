import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession, COOKIE_NAME } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function authorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value);
}

function text(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;
}

function httpsUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function isCarry1stPartnerUrl(value: unknown) {
  if (!httpsUrl(value)) return false;
  const host = new URL(value as string).hostname.toLowerCase();
  return host === "carry1st.sng.link" || host === "carry1st.com" || host.endsWith(".carry1st.com");
}

export async function PATCH(request: NextRequest, context: Context) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const data: Prisma.ProductUpdateInput = {};
  if ("name" in body) { const v = text(body.name, 120); if (!v) return NextResponse.json({ error: "Invalid name" }, { status: 400 }); data.name = v; }
  if ("slug" in body) {
    const v = text(body.slug, 140)?.toLowerCase();
    if (!v || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    data.slug = v;
  }
  if ("category" in body) { const v = text(body.category, 80); if (!v) return NextResponse.json({ error: "Invalid category" }, { status: 400 }); data.category = v; }
  if ("description" in body) { const v = text(body.description, 3000); if (!v) return NextResponse.json({ error: "Invalid description" }, { status: 400 }); data.description = v; }
  if ("partnerUrl" in body) { if (!partnerUrl(body.partnerUrl)) return NextResponse.json({ error: "Partner URL must be a valid HTTPS Carry1st destination" }, { status: 400 }); data.partnerUrl = body.partnerUrl as string; }
  if ("imageUrl" in body) {
    if (body.imageUrl !== null && body.imageUrl !== "" && !httpsUrl(body.imageUrl)) return NextResponse.json({ error: "Image URL must use HTTPS" }, { status: 400 });
    data.imageUrl = body.imageUrl === "" || body.imageUrl === null ? null : body.imageUrl as string;
  }
  if ("status" in body) {
    if (!["DRAFT", "ACTIVE", "ARCHIVED"].includes(String(body.status))) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    data.status = body.status as "DRAFT" | "ACTIVE" | "ARCHIVED";
  }
  if ("sortOrder" in body) {
    if (!Number.isSafeInteger(body.sortOrder) || Math.abs(Number(body.sortOrder)) > 100000) return NextResponse.json({ error: "Invalid sort order" }, { status: 400 });
    data.sortOrder = Number(body.sortOrder);
  }
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "No valid fields supplied" }, { status: 400 });

  try {
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ product });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Unable to update product. Check database configuration." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ error: "Unable to delete product. Check database configuration." }, { status: 503 });
  }
}
