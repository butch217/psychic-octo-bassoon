import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession, COOKIE_NAME } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value);
}

function cleanString(value: unknown, max = 500) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max
    ? value.trim()
    : null;
}

function validHttpsUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function validPartnerUrl(value: unknown) {
  if (!validHttpsUrl(value)) return false;
  const host = new URL(value as string).hostname.toLowerCase();
  return host === "carry1st.sng.link" || host === "carry1st.com" || host.endsWith(".carry1st.com");
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const products = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and run migrations." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const name = cleanString(body.name, 120);
  const slug = cleanString(body.slug, 140)?.toLowerCase();
  const category = cleanString(body.category, 80);
  const description = cleanString(body.description, 3000);
  const partnerUrl = body.partnerUrl;
  const imageUrl = body.imageUrl === "" || body.imageUrl == null ? null : body.imageUrl;
  const status = body.status === "ACTIVE" || body.status === "ARCHIVED" ? body.status : "DRAFT";
  const sortOrder = Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0;

  if (!name || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !category || !description ||
      !validPartnerUrl(partnerUrl) || (imageUrl !== null && !validHttpsUrl(imageUrl)) ||
      !Number.isSafeInteger(sortOrder) || Math.abs(sortOrder) > 100000) {
    return NextResponse.json({ error: "Provide valid name, slug, category, description, HTTPS partner URL, optional HTTPS image URL, and sort order." }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: { name, slug, category, description, partnerUrl: partnerUrl as string, imageUrl: imageUrl as string | null, status, sortOrder },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "A product with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to save product. Check database configuration." }, { status: 503 });
  }
}
