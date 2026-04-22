import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Eliminar ambas cookies
  response.cookies.set('session_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  response.cookies.set('pre_auth_user', '', { httpOnly: true, path: '/', maxAge: 0 });

  return response;
}
