import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, type NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

const sensitiveLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60s"),
  ephemeralCache: new Map(),
  prefix: "@ratelimit:sensitive",
  analytics: true,
});

const mutationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60s"),
  ephemeralCache: new Map(),
  prefix: "@ratelimit:mutation",
  analytics: true,
})

const readLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(70, "60s"),
  ephemeralCache: new Map(),
  prefix: "@ratelimit:read",
  analytics: true,
})

function pickLimiter(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const method = request.method;

  if (!pathName.startsWith('/api')) return null;

  if (pathName.startsWith('/api/leetcode') || pathName.startsWith('/api/auth')) return sensitiveLimiter;

  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) return mutationLimiter;

  return readLimiter;
}

export async function middleware(
  request: NextRequest,
  context: NextFetchEvent,
): Promise<Response | undefined> {
  if (request.method === "OPTIONS") return NextResponse.next();

  const userAgent = request.headers.get("user-agent") || "";
  if (userAgent.startsWith("node") || userAgent.startsWith("axios")) {
    return new NextResponse(JSON.stringify({
      error: "Forbidden",
      message: "Bots are not allowed to access this resource"
    }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json"
        }
      })
  }

  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const limiter = pickLimiter(request);
  if (limiter) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"
    const identifier = sessionToken ? `user:${sessionToken.value}` : `ip:${ip}`
    const { success, pending, limit, remaining, reset } = await limiter.limit(identifier);

    // pending is a promise for handling the analytics submission
    context.waitUntil(pending);

    if (!success) {
      return new NextResponse(JSON.stringify({
        error: "Too Many Requests",
        limit,
        remaining,
        message: "Rate Limit exceeded. Please try again shortly"
      }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "Retry-After": Math.ceil(((reset - Date.now()) / 1000)).toString()
          }

        })
    }
  }


  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/problems") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/profile");

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && sessionToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/problems/:path*",
    "/review/:path*",
    "/profile/:path*",
    "/login",
    "/api/:path*",
  ],
};
