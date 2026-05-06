import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_BASE: Record<string, string> = {
  Admin:   '/admin',
  Gerente: '/gerente',
  Usuario: '/usuario',
  Cliente: '/cliente',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/admin', '/gerente', '/usuario', '/cliente'];
  if (!protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session_token');
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let session: { rol: string };
  try {
    session = JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.set('session_token', '', { maxAge: 0, path: '/' });
    return res;
  }

  const allowedBase = ROLE_BASE[session.rol];
  if (!allowedBase || !pathname.startsWith(allowedBase)) {
    return NextResponse.redirect(new URL(allowedBase || '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/gerente/:path*', '/usuario/:path*', '/cliente/:path*'],
};
