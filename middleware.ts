import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login") return NextResponse.next();
  const valid = isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value);
  if (!valid) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"], runtime: "nodejs" };
