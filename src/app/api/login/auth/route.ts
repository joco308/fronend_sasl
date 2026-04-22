import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { codigo } = await request.json();
    
    if (codigo === "123456") {
      const res = NextResponse.json({ success: true });
      res.cookies.set('session_token', 'active_session_luz', {
        httpOnly: true,
        path: '/',
        maxAge: 3600
      });
      return res;
    }
    return NextResponse.json({ success: false, message: "Código incorrecto" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}