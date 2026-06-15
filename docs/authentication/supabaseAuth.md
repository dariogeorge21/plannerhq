# PlannerHQ Authentication & Inactivity Management System

This document outlines the architecture, database schemas, configuration, and verification procedures for the PlannerHQ authentication system.

---

## 1. Architectural Request Flow

PlannerHQ uses a modern, server-side and client-side hybrid authentication architecture powered by Supabase and Next.js App Router.

```
[Sign Up Form] ──▶ Supabase Auth (signUp)
                       │
                       └── (Sends confirmation link with code to user's email)
                       │
                 [Redirects user to /check-email]
                       │
           User clicks link in email inbox
                       │
                       ▼
           [Next.js API Callback Route] (/auth/callback?code=...)
                       │
                       ├── exchanges code for Supabase JWT session cookies
                       ├── sets plannerhq_last_activity cookie (maxAge: 24 hours)
                       └── redirects user to /dashboard
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
[Server-Side Next.js Middleware]      [Client-Side SessionProvider]
 • Protects /dashboard                • Captures user activity events
 • Auto-refreshes activity cookie     • Throttles cookie updates (1 min)
 • Clears expired session cookies     • Logs out users inactive > 24 hours
```

### Components

1. **API Layer (`src/api/auth.ts`)**: Client wrapper for signing up, signing in, signing out, and fetching extended user profiles.
2. **Server Route Handler (`src/app/auth/callback/route.ts`)**: Receives the code from the verification email, exchanges it for session cookies, starts the inactivity timer, and handles redirects.
3. **Session Provider (`src/features/auth/providers/SessionProvider.tsx`)**: React Context provider. Updates `plannerhq_last_activity` cookie on user activity and triggers client-side signout if the cookie vanishes.
4. **Middleware Guard (`src/middleware.ts`)**: Restricts `/dashboard` routes, redirects logged-in users away from sign-in pages, and invalidates session cookies upon 24h inactivity.

---

## 2. Inactivity Session Expiry (24 Hours)

To security-protect workspaces, users are automatically signed out after 24 hours of inactivity.

* **Inactivity Cookie**: We use `plannerhq_last_activity` containing the last active timestamp with a `max-age` of 86400 seconds (24 hours).
* **Activity Listener**: The `SessionProvider` listens for window events (`mousemove`, `keydown`, `click`, `scroll`, `touchstart`) and throttles updating the cookie to once every 1 minute.
* **Server-side check**: If the user visits a protected route and the cookie is missing, `middleware.ts` clears all Supabase session cookies and redirects to `/signin?expired=true`.
* **Client-side check**: If the user is on the site and the cookie is missing, `SessionProvider` calls `supabase.auth.signOut()` and redirects to `/signin?expired=true` showing a toast.

---

## 3. Database Schema

The authentication schema resides in:
* **Manual Query Execution**: [supabase/schema.sql](file:///d:/VS%20CODE/clavis/plannerhq-nextjs/plannerhq/supabase/schema.sql)
* **CLI Migrations Tracking**: [supabase/migrations/20260615000000_init_auth.sql](file:///d:/VS%20CODE/clavis/plannerhq-nextjs/plannerhq/supabase/migrations/20260615000000_init_auth.sql)

### Tables
1. **`public.profiles`**: Contains user profiles synced automatically via trigger from `auth.users` on signup. Stores display names and unique `hqid` values.
2. **`public.plans`**: Contains product subscription limits (e.g. `free`, `pro`, `plus`, `enterprise`).
3. **`public.subscriptions`**: Stores user subscription statuses and cycle details.

### Triggers & Functions
* **`public.handle_updated_at()`**: Updates the `updated_at` timestamp on updates.
* **`public.handle_new_user()`**: Binded as an `after insert` trigger on `auth.users`. It automatically:
  1. Inserts a record in `public.profiles` using the user metadata `display_name`.
  2. Sets up a free plan subscription inside `public.subscriptions`.

---

## 4. Setup Instructions

### Supabase Settings
1. Go to your **Supabase Dashboard > Authentication > URL Configuration**.
2. Set **Site URL** to `http://localhost:3000` (or your production domain).
3. Set **Redirect URLs** to include `http://localhost:3000/auth/callback`.
4. Ensure email verification is enabled in **Authentication > Providers > Email**.

### Applying DB Schema
Run the queries inside [supabase/schema.sql](file:///d:/VS%20CODE/clavis/plannerhq-nextjs/plannerhq/supabase/schema.sql) inside the Supabase SQL Editor.

If using Supabase CLI, you can apply migrations locally:
```bash
supabase migration up
```
