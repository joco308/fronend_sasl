import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_token');
  const { pathname } = request.nextUrl;

  // Rutas que requieren sesión activa
  const rutasProtegidas = ['/admin', '/supervisor', '/limpieza'];
  const necesitaSesion = rutasProtegidas.some(r => pathname.startsWith(r));

  if (necesitaSesion && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Control de acceso por rol: un Supervisor no puede ir a /admin ni a /limpieza
  if (session && necesitaSesion) {
    try {
      const { rol } = JSON.parse(decodeURIComponent(session.value));
      const mapa: Record<string, string> = {
        'Admin':      '/admin',
        'Supervisor': '/supervisor',
        'Limpieza':   '/limpieza',
      };
      const rutaPermitida = mapa[rol];
      if (rutaPermitida && !pathname.startsWith(rutaPermitida)) {
        return NextResponse.redirect(new URL(rutaPermitida, request.url));
      }
    } catch {
      // Cookie corrupta → redirigir al login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si ya tiene sesión y va al login, redirigir a su panel
  if (pathname === '/login' && session) {
    try {
      const { rol } = JSON.parse(decodeURIComponent(session.value));
      const mapa: Record<string, string> = { 'Admin': '/admin', 'Supervisor': '/supervisor', 'Limpieza': '/limpieza' };
      return NextResponse.redirect(new URL(mapa[rol] || '/admin', request.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/supervisor/:path*', '/limpieza/:path*', '/login'],
};
