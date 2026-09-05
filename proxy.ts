import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@prisma/client";

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

type JwtWithRole = {
  id?: string;
  role?: Role;
  emailVerified?: Date | null;
};

type SessionUserWithRole = {
  id?: string;
  role?: Role;
  emailVerified?: Date | null;
};

const { auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: Role; emailVerified: Date | null };
        token.id = u.id;
        token.role = u.role;
        token.emailVerified = u.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const t = token as JwtWithRole;
        const s = session.user as SessionUserWithRole;
        s.id = t.id;
        s.role = t.role;
        s.emailVerified = t.emailVerified;
      }
      return session;
    },
  },
});

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function buildCsp(nonce: string, isDev: boolean, isApi: boolean): string {
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
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "img-src 'self' blob: data: https://coresg-normal.trae.ai https://unpkg.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
    `connect-src 'self' http://localhost:3000 https://localhost:3000${isDev ? " ws://localhost:3000 wss://localhost:3000" : ""}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];

  return parts.join("; ").trim();
}

function applySecurityHeaders(
  response: NextResponse,
  nonce: string,
  isDev: boolean,
  isApi: boolean,
): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.delete("X-Powered-By");

  const csp = buildCsp(nonce, isDev, isApi);
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

function makeRedirect(url: URL, nonce: string, isDev: boolean, isApi: boolean) {
  const response = NextResponse.redirect(url);
  return applySecurityHeaders(response, nonce, isDev, isApi);
}

export default auth(function proxy(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const authPayload = (req as unknown as { auth?: unknown }).auth;
  const isLoggedIn = !!authPayload;
  const userRole =
    ((authPayload as { user?: { role?: unknown } } | undefined)?.user
      ?.role as "ADMIN" | "UMKM" | "COMPANY") || undefined;

  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isCompanyRoute = pathname.startsWith("/company");
  const isUmkmRoute = pathname.startsWith("/umkm");
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  if (!isApiRoute) {
    if (isAuthRoute && isLoggedIn) {
      if (userRole === "ADMIN") {
        return makeRedirect(
          new URL("/admin/dashboard", nextUrl),
          nonce,
          isDev,
          isApiRoute,
        );
      }
      if (userRole === "UMKM") {
        return makeRedirect(
          new URL("/umkm/dashboard", nextUrl),
          nonce,
          isDev,
          isApiRoute,
        );
      }
      return makeRedirect(
        new URL("/company/dashboard", nextUrl),
        nonce,
        isDev,
        isApiRoute,
      );
    }

    if ((isCompanyRoute || isUmkmRoute || isAdminRoute) && !isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return makeRedirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl),
        nonce,
        isDev,
        isApiRoute,
      );
    }

    if (
      isCompanyRoute &&
      isLoggedIn &&
      userRole !== "COMPANY" &&
      userRole !== "ADMIN"
    ) {
      return makeRedirect(
        new URL("/unauthorized", nextUrl),
        nonce,
        isDev,
        isApiRoute,
      );
    }
    if (
      isUmkmRoute &&
      isLoggedIn &&
      userRole !== "UMKM" &&
      userRole !== "ADMIN"
    ) {
      return makeRedirect(
        new URL("/unauthorized", nextUrl),
        nonce,
        isDev,
        isApiRoute,
      );
    }
    if (isAdminRoute && isLoggedIn && userRole !== "ADMIN") {
      return makeRedirect(
        new URL("/unauthorized", nextUrl),
        nonce,
        isDev,
        isApiRoute,
      );
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return applySecurityHeaders(response, nonce, isDev, isApiRoute);
});
