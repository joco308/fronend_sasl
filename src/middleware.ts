import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getRoleFromToken(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
    return payload.rol
      ?? payload.role
      ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token_sesion')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (token && getRoleFromToken(token)) {
      return NextResponse.redirect(new URL('/Administrador', request.url))
    }
    return NextResponse.next() 
  }

  if (!token || !getRoleFromToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()

}

export const config = {
  matcher: [
    '/Administrador/:path*',
    '/login/auth'
  ],
}