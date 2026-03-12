import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/events", "/bookings", "/payments", "/tracking", "/finance", "/users"];
const AUTH_PATHS = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isRoot = pathname === "/";

  // มี token → ไป dashboard เสมอ (ยกเว้นถ้าอยู่ใน protected แล้ว)
  if (token && (isAuth || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ไม่มี token แล้วเข้า protected → ไป signin
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
