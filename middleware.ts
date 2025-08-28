import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated by looking for session cookie
  const sessionCookie = request.cookies.get('authjs.session-token') || 
                       request.cookies.get('__Secure-authjs.session-token') ||
                       request.cookies.get('__Host-authjs.session-token')

  // If no session cookie and trying to access protected routes, redirect to login
  if (!sessionCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};


