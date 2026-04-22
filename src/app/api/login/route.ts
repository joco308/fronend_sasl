import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validamos el código de prueba
    if (body.codigo === "123456") {
      const response = NextResponse.json({ success: true });
      
      // Creamos la cookie de sesión
      response.cookies.set('session_token', 'marka_auth_active', {
        httpOnly: true,
        path: '/',
        maxAge: 3600 // 1 hora de acceso
      });
      
      return response;
    }
    
    return NextResponse.json({ success: false, message: "Código incorrecto" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}