import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }
  const form = await request.formData();
  const password = form.get("password");
  if (typeof password !== "string" || password.length < 12 || password.length > 1024) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }
  try {
    if (!verifyAdminPassword(password)) {
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
    }
    const session = createAdminSession();
    const response = NextResponse.redirect(new URL("/admin", request.url), 303);
    response.cookies.set(session.name, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }
}
