import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Protect /dashboard/* routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Get role from database (prioritize database over potentially stale cookie)
    let role = null;

    if (session.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        role = (profile as any).role as string;
        // Update cookie if it's missing or different
        const currentCookie = req.cookies.get('user-role')?.value;
        if (currentCookie !== role) {
          res.cookies.set('user-role', role, { maxAge: 60 * 60 * 24 * 30 });
        }
      }
    }

    // Redirect based on role
    if (role) {
      const roleRoot = `/dashboard/${role}`;
      
      // Allow access to common dashboard pages
      const commonPages = ['/dashboard/messages', '/dashboard/invoices', '/dashboard/search', '/dashboard/payments'];
      const isCommonPage = commonPages.some(page => pathname.startsWith(page));

      // If user is at /dashboard root, redirect to their role's root
      if (pathname === '/dashboard') {
        url.pathname = roleRoot;
        return createRedirectResponse(url, res);
      }

      // If not a common page, check if they are in their own role's namespace
      if (!isCommonPage && !pathname.startsWith(roleRoot)) {
        url.pathname = roleRoot;
        return createRedirectResponse(url, res);
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (pathname === '/login' || pathname === '/signup')) {
    let role = req.cookies.get('user-role')?.value;
    
    if (!role) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      role = (profile as any)?.role;
    }

    if (role) {
      url.pathname = `/dashboard/${role}`;
      return createRedirectResponse(url, res);
    }
  }

  return res;
}

function createRedirectResponse(url: URL, res: NextResponse) {
  const redirectRes = NextResponse.redirect(url);
  // Copy cookies from 'res' to the redirect response
  res.cookies.getAll().forEach((cookie) => {
    redirectRes.cookies.set(cookie.name, cookie.value);
  });
  return redirectRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
