import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Cek apakah env variable Supabase sudah diisi
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase URL atau Key belum disetel di .env. Melewati pengecekan sesi...');
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies, so just do it here.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection — sudah ditangani di admin/layout.tsx
  // Middleware hanya refresh session

  // Redirect logged-in admin away from login page → ke /admin
  const ADMIN_EMAILS = ['admin@gmail.com', 'fadilahikhsann@gmail.com']
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    const url = request.nextUrl.clone()
    url.pathname = ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '') ? '/admin' : '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
