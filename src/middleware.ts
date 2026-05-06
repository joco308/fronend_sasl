import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mapa de rol → ruta base del portal
const ROLE_REDIRECT: Record<string, string> = {
  Admin:      '/admin',
  Supervisor: '/gerente',   // supervisores usan el portal de gerencia
  Limpieza:   '/usuario',   // personal de limpieza usa el portal de empleado
  Gerente:    '/gerente',
  Usuario:    '/usuario',
  Cliente:    '/cliente',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leer session_token (cookie JSON, no JWT)
  const sessionCookie = request.cookies.get('session_token');

  // Si ya está autenticado y va al login, redirigir a su portal
  if (pathname === '/login' || pathname === '/login/auth') {
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        const dest = ROLE_REDIRECT[session.rol] || '/login';
        if (session.autenticado && pathname === '/login') {
          return NextResponse.redirect(new URL(dest, request.url));
        }
      } catch { /* cookie inválida, dejar pasar */ }
    }
    return NextResponse.next();
  }

  // Rutas protegidas: verificar sesión
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let session: { rol: string; autenticado?: boolean };
  try {
    session = JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.set('session_token', '', { maxAge: 0, path: '/' });
    return res;
  }

  if (!session.autenticado) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const allowedBase = ROLE_REDIRECT[session.rol];
  if (!allowedBase || !pathname.startsWith(allowedBase)) {
    return NextResponse.redirect(new URL(allowedBase || '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/gerente/:path*',
    '/usuario/:path*',
    '/cliente/:path*',
    '/login',
    '/login/auth',
  ],
};
