import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production-32-chars-min";

function buildCsp(isDev: boolean, isApi: boolean): string {
  if (isApi) {
    const apiDirectives = [
      "default-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
    ];
    if (!isDev) {
      apiDirectives.push("upgrade-insecure-requests");
    }
    return apiDirectives.join("; ");
  }

  const parts = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
    "style-src 'self' 'unsafe-inline' https: http:",
    "img-src 'self' blob: data: https: http:",
    "font-src 'self' data: https: http:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' ws: wss: https: http:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];

  return parts.join("; ").trim();
}

function applySecurityHeaders(response: NextResponse, isDev: boolean, isApi: boolean): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.delete("X-Powered-By");

  const csp = buildCsp(isDev, isApi);
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

function makeRedirect(url: URL, isDev: boolean, isApi: boolean) {
  const response = NextResponse.redirect(url);
  return applySecurityHeaders(response, isDev, isApi);
}

export async function middleware(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Support both HTTP (localhost) and HTTPS (__Secure- prefix on Vercel production)
  const hasSecureCookie = req.cookies.has("__Secure-authjs.session-token") || req.cookies.has("__Secure-next-auth.session-token");
  const isHttps = nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https" || !isDev;

  let token = null;
  if (hasSecureCookie || isHttps) {
    token = await getToken({ req, secret: SECRET, secureCookie: true });
  }
  if (!token) {
    token = await getToken({ req, secret: SECRET, secureCookie: false });
  }

  const isLoggedIn = !!token;
  const userRole = (token?.role as "ADMIN" | "UMKM" | "COMPANY") || undefined;

  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isCompanyRoute = pathname.startsWith("/company");
  const isUmkmRoute = pathname.startsWith("/umkm");
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  if (!isApiRoute) {
    if (isAuthRoute && isLoggedIn) {
      if (userRole === "ADMIN") {
        return makeRedirect(new URL("/admin/dashboard", nextUrl), isDev, isApiRoute);
      }
      if (userRole === "UMKM") {
        return makeRedirect(new URL("/umkm/dashboard", nextUrl), isDev, isApiRoute);
      }
      return makeRedirect(new URL("/company/dashboard", nextUrl), isDev, isApiRoute);
    }

    if ((isCompanyRoute || isUmkmRoute || isAdminRoute) && !isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return makeRedirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl), isDev, isApiRoute);
    }

    const isPublicCompanySupplierRoute = pathname.startsWith("/company/suppliers");

    if (
      isCompanyRoute &&
      !isPublicCompanySupplierRoute &&
      isLoggedIn &&
      userRole !== "COMPANY" &&
      userRole !== "ADMIN"
    ) {
      if (userRole === "UMKM") {
        if (pathname.includes("/rfq")) {
          return makeRedirect(new URL("/umkm/rfq", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/analytics")) {
          return makeRedirect(new URL("/umkm/analytics", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/products")) {
          return makeRedirect(new URL("/umkm/products", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/assistant")) {
          return makeRedirect(new URL("/umkm/assistant", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/settings")) {
          return makeRedirect(new URL("/umkm/settings", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/notifications")) {
          return makeRedirect(new URL("/umkm/notifications", nextUrl), isDev, isApiRoute);
        }
        return makeRedirect(new URL("/umkm/dashboard", nextUrl), isDev, isApiRoute);
      }
      return makeRedirect(new URL("/unauthorized", nextUrl), isDev, isApiRoute);
    }

    if (
      isUmkmRoute &&
      isLoggedIn &&
      userRole !== "UMKM" &&
      userRole !== "ADMIN"
    ) {
      if (userRole === "COMPANY") {
        if (pathname.includes("/rfq")) {
          return makeRedirect(new URL("/company/rfq", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/analytics")) {
          return makeRedirect(new URL("/company/analytics", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/suppliers")) {
          return makeRedirect(new URL("/company/suppliers", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/assistant")) {
          return makeRedirect(new URL("/company/assistant", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/settings")) {
          return makeRedirect(new URL("/company/settings", nextUrl), isDev, isApiRoute);
        }
        if (pathname.includes("/notifications")) {
          return makeRedirect(new URL("/company/notifications", nextUrl), isDev, isApiRoute);
        }
        return makeRedirect(new URL("/company/dashboard", nextUrl), isDev, isApiRoute);
      }
      return makeRedirect(new URL("/unauthorized", nextUrl), isDev, isApiRoute);
    }

    if (isAdminRoute && isLoggedIn && userRole !== "ADMIN") {
      return makeRedirect(new URL("/unauthorized", nextUrl), isDev, isApiRoute);
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response, isDev, isApiRoute);
}
