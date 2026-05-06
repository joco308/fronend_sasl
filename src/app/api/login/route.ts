import { NextResponse } from 'next/server';
import { USUARIOS } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, message: 'Correo y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const usuario = USUARIOS.find(
      u => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas.' },
        { status: 401 }
      );
    }

    const preAuthData = encodeURIComponent(JSON.stringify({
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol:    usuario.rol,
      id_rol: usuario.id_rol,
    }));

    const response = NextResponse.json({ success: true });
    response.cookies.set('pre_auth_user', preAuthData, {
      httpOnly: true, path: '/', maxAge: 300, sameSite: 'lax',
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'Error interno.' }, { status: 500 });
  }
}
