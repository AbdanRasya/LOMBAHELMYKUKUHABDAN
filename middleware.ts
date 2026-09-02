import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password") ||
    nextUrl.pathname.startsWith("/verify-email");

  const isCompanyRoute = nextUrl.pathname.startsWith("/company");
  const isUmkmRoute = nextUrl.pathname.startsWith("/umkm");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // If on auth page and already logged in, redirect to appropriate dashboard
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    if (userRole === "UMKM") return NextResponse.redirect(new URL("/umkm/dashboard", nextUrl));
    return NextResponse.redirect(new URL("/company/dashboard", nextUrl));
  }

  // Protected routes - require login
  if ((isCompanyRoute || isUmkmRoute || isAdminRoute) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // Role-based access control
  if (isCompanyRoute && isLoggedIn && userRole !== "COMPANY" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }
  if (isUmkmRoute && isLoggedIn && userRole !== "UMKM" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }
  if (isAdminRoute && isLoggedIn && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
