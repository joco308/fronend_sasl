import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getRoleFromToken(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
    return payload.rol
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (token) {
      const rol = getRoleFromToken(token)
      return NextResponse.redirect(new URL(`/${rol}`, request.url))
    }
    return NextResponse.next() 
  }

  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const rol = getRoleFromToken(token)

  if (!pathname.startsWith(`/${rol}`)) {
    return NextResponse.redirect(new URL(`/${rol}`, request.url))
  }

  return NextResponse.next()

}

export const config = {
  matcher: [
    '/admin/:path*',
    '/gerente/:path*',
    '/trabajador/:path*',
    '/cliente/:path*',
    '/login/auth'
  ],
}