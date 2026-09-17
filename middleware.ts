import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, type NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

const memoryCache = new Map();

const sensitiveLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60s"),
  ephemeralCache: memoryCache,
  prefix: "@ratelimit:sensitive",
  analytics: true,
});

const mutationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60s"),
  ephemeralCache: memoryCache,
  prefix: "@ratelimit:mutation",
  analytics: true,
});

const readLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "60s"),
  ephemeralCache: memoryCache,
  prefix: "@ratelimit:read",
  analytics: true,
});

function pickLimiter(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const method = request.method;

  if (
    pathName.startsWith("/login") ||
    pathName.startsWith("/api/leetcode") ||
    pathName.startsWith("/api/auth")
  )
    return sensitiveLimiter;
  if (pathName.startsWith("/api")&&["POST", "PUT", "DELETE", "PATCH"].includes(method))
    return mutationLimiter;

  return readLimiter;
}

export async function middleware(
  request: NextRequest,
  context: NextFetchEvent,
): Promise<Response | undefined> {
  if (request.method === "OPTIONS") return NextResponse.next();

  // 1. Zero-Cost Edge Bot Sieve: drops bots & empty user-agents before touching DB or Redis
  const userAgent = (request.headers.get("user-agent") || "")
    .toLowerCase()
    .trim();
  const blockedAgents = [
    "node",
    "axios",
    "curl",
    "python",
    "wget",
    "go-http",
    "postman",
    "httpie",
    "insomnia",
  ];

  if (!userAgent || blockedAgents.some((agent) => userAgent.includes(agent))) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden",
        message: "Bots are not allowed to access this resource",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // 2. 3-Tier Rate Limiting with Fail-Open Resilience
  const limiter = pickLimiter(request);
  if (limiter) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const identifier = sessionToken ? `user:${sessionToken.value}` : `ip:${ip}`;

    let success = true;
    let limit = 0;
    let remaining = 0;
    let reset = Date.now();

    try {
      const res = await limiter.limit(identifier);
      success = res.success;
      limit = res.limit;
      remaining = res.remaining;
      reset = res.reset;
      if (res.pending) context.waitUntil(res.pending);
    } catch (error) {
      // Fail-open: if Upstash quota runs out or network blips, keep the site running for legitimate users
      console.error(
        "[RateLimiter Warning] Upstash check failed or quota exhausted:",
        error,
      );
    }

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          limit,
          remaining,
          message: "Rate Limit exceeded. Please try again shortly",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        },
      );
    }
  }

  // 3. Route Protection
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
    "/",
    "/dashboard/:path*",
    "/problems/:path*",
    "/review/:path*",
    "/profile/:path*",
    "/login",
    "/api/:path*",
  ],
};
