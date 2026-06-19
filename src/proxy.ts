import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ACTIVITY_COOKIE = "plannerhq_last_activity";
const INACTIVITY_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Retrieve current user
  const { data: { user } } = await supabase.auth.getUser();
  const lastActivity = request.cookies.get(ACTIVITY_COOKIE)?.value;
  const isAuthRoute = ["/signin", "/signup", "/verify-otp", "/forgot-password"].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (user) {
    // Check if the user is logged in but the inactivity cookie is missing
    if (!lastActivity) {
      // User was inactive for > 24 hours (or the cookie expired)
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("expired", "true");
      
      const newResponse = NextResponse.redirect(redirectUrl);
      
      // Clear Supabase session cookies
      for (const cookie of request.cookies.getAll()) {
        if (cookie.name.startsWith("sb-") || cookie.name.includes("auth-token")) {
          newResponse.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
        }
      }
      // Clear inactivity cookie
      newResponse.cookies.set(ACTIVITY_COOKIE, "", { maxAge: 0, path: "/" });
      
      return newResponse;
    }

    // Refresh inactivity cookie
    response.cookies.set(ACTIVITY_COOKIE, Date.now().toString(), {
      maxAge: INACTIVITY_TIMEOUT,
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    // If logged in and cookie exists, redirect away from auth routes to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // If not logged in, redirect away from dashboard to signin
    if (isDashboardRoute) {
      const redirectUrl = new URL("/signin", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (png, svg, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
