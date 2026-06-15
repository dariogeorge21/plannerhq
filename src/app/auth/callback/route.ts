import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACTIVITY_COOKIE = "plannerhq_last_activity";
const INACTIVITY_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      
      // Initialize the inactivity cookie to start the 24-hour inactivity timer
      response.cookies.set(ACTIVITY_COOKIE, Date.now().toString(), {
        maxAge: INACTIVITY_TIMEOUT,
        path: "/",
        sameSite: "lax",
        secure: true,
      });
      
      return response;
    }
  }

  // Return the user to the sign-in page with an error parameter
  return NextResponse.redirect(`${origin}/signin?error=Verification link expired or invalid`);
}
